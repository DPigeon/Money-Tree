package com.capstone.moneytree.service.impl;

import static com.capstone.moneytree.handler.ExceptionMessage.USER_ALREADY_FOLLOWED;
import static java.util.Collections.emptyList;
import static java.util.stream.Collectors.toList;

import javax.security.auth.login.CredentialNotFoundException;

import com.capstone.moneytree.ActiveProfile;
import com.capstone.moneytree.model.AlpacaOAuthResponse;
import com.capstone.moneytree.model.node.Stock;
import com.capstone.moneytree.service.api.StockService;
import com.google.gson.Gson;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.capstone.moneytree.dao.*;
import com.capstone.moneytree.model.SanitizedUser;
import com.capstone.moneytree.exception.BadRequestException;
import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.exception.FollowsRelationshipException;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.model.relationship.*;
import com.capstone.moneytree.service.api.AmazonS3Service;
import com.capstone.moneytree.service.api.UserService;
import com.capstone.moneytree.utils.MoneyTreePasswordEncryption;
import com.capstone.moneytree.validator.UserValidator;
import com.capstone.moneytree.validator.ValidatorFactory;

import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * {@inheritDoc}
 */
@Service
@Transactional
public class DefaultUserService implements UserService {

    private static final String USER_NOT_FOUND = "The requested user was not found";
    private static final String DEFAULT_PROFILE_NAME = "DEFAULT-profile.jpg";
    private static final String AUTHORIZATION_CODE = "authorization_code";
    private static final String NOT_FOLLOWED_BY_THIS_USER = "The user is not followed";
    private static final String USER_CANT_BE_FOLLOWED_BY_ITSELF = "User cannot followed by itself";

    @Value("${alpaca.key.id}")
    private String clientId;
    @Value("${alpaca.secret}")
    private String clientSecret;

    @Autowired
    private ActiveProfile activeProfile;

    @Autowired
    private StockService stockService;

    private final UserDao userDao;
    private final OwnsDao ownsDao;
    private final FollowsDao followsDao;
    private final ValidatorFactory validatorFactory;
    private final MoneyTreePasswordEncryption passwordEncryption;
    private static final Logger LOG = LoggerFactory.getLogger(DefaultUserService.class);
    private final AmazonS3Service amazonS3Service;

    private final String bucketName;

    @Autowired
    public DefaultUserService(UserDao userDao, FollowsDao followsDao, OwnsDao ownsDao, ValidatorFactory validatorFactory, AmazonS3Service amazonS3Service,
                              @Value("${aws.profile.pictures.bucket}") String bucketName) {
        this.userDao = userDao;
        this.followsDao = followsDao;
        this.validatorFactory = validatorFactory;
        this.passwordEncryption = new MoneyTreePasswordEncryption();
        this.amazonS3Service = amazonS3Service;
        this.bucketName = bucketName;
        this.ownsDao = ownsDao;
    }

    @Override
    public Iterable<User> getAllUsers() {
        return userDao.findAll();
    }

    @Override
    public User getUserById(Long id) {
        User user = userDao.findUserById(id);
        if (user == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        return user;
    }

    @Override
    public User getUserByUsername(String username) {
        User user = userDao.findUserByUsername(username);
        if (user == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        return user;
    }

    @Override
    public User getUserByEmailAndUsername(String email, String username) {
        User existingUser = userDao.findUserByEmailAndUsername(email, username);
        if (existingUser == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        LOG.info("Found user with email {}", existingUser.getEmail());
        return existingUser;
    }

    @Override
    public User createUser(User user) {
        getUserValidator().validate(user);

        String password = user.getPassword();
        String encryptedPassword = encryptData(password);
        user.setPassword(encryptedPassword);
        user.setAvatarURL(String.format("https://%s.s3.amazonaws.com/%s", bucketName, DEFAULT_PROFILE_NAME));
        user.setCoverPhotoURL(String.format("https://%s.s3.amazonaws.com/%s", bucketName, "COVER-"  + DEFAULT_PROFILE_NAME));
        user.setScore(0.0);

        userDao.save(user);

        LOG.info("Created user: {}", user.getUsername());

        return user;
    }

    @Override
    public User updateUser(User userToUpdate, User user) {
        // ensure user in payload has the same id as in the path
        if (!userToUpdate.getId().equals(user.getId())) {
            throw new BadRequestException("The ID of the user in the payload is not the same as the ID in the path");
        }

        // ensure that if username is changed, then it is changed to an unused username
        if (user.getUsername() != null && !user.getUsername().equals(userToUpdate.getUsername())) {
            getUserValidator().validateUsername(user);
            userToUpdate.setUsername(user.getUsername());
        }

        // ensure that if email is changed, then it is changed to an unused email
        if (user.getEmail() != null && !user.getEmail().equals(userToUpdate.getEmail())) {
            getUserValidator().validateEmail(user);
            userToUpdate.setEmail(user.getEmail());
        }

        if (user.getFirstName() != null) {
            userToUpdate.setFirstName(user.getFirstName());
        }

        if (user.getLastName() != null) {
            userToUpdate.setLastName(user.getLastName());
        }

        if (user.getAvatarURL() != null) {
            userToUpdate.setAvatarURL(user.getAvatarURL());
        }

        if (user.getCoverPhotoURL() != null) {
            userToUpdate.setCoverPhotoURL(user.getCoverPhotoURL());
        }

        if (user.getScore() != null) {
            userToUpdate.setScore(user.getScore());
        }

        if (user.getRank() != null) {
            userToUpdate.setRank(user.getRank());
        }

        if (user.getBalance() != null) {
            userToUpdate.setBalance(user.getBalance());
        }

        if (user.getPassword() != null) {
            userToUpdate.setPassword(encryptData(user.getPassword()));
        }

        if (user.getBiography() != null) {
            userToUpdate.setBiography(user.getBiography());
        }

        User updatedUser = userDao.save(userToUpdate);
        LOG.info("Updated user: {}", updatedUser.getUsername());

        return updatedUser;
    }

    @Override
    public User editUserProfilePicture(User user, MultipartFile imageFile, String selection) {
        switch (selection) {
            case "avatarURL": {
                // since user exists, we can now upload image to s3 and save imageUrl into db
                String imageUrl = amazonS3Service.uploadImageToS3Bucket(imageFile, getBucketName());
                // if user already has a profile picture that is not the default picture, handle
                // deleting old picture
                if (StringUtils.isNotBlank(user.getAvatarURL()) && !user.getAvatarURL().contains(DEFAULT_PROFILE_NAME)) {
                    this.amazonS3Service.deleteImageFromS3Bucket(getBucketName(), user.getAvatarURL());
                }

                user.setAvatarURL(imageUrl);
                userDao.save(user);
                LOG.info("Edited {}'s profile picture successfully!", user.getUsername());
                break;
            }
            case "coverPhotoURL": {
                String imageUrl = amazonS3Service.uploadImageToS3Bucket(imageFile, getBucketName());
                if (StringUtils.isNotBlank(user.getCoverPhotoURL())
                        && !user.getCoverPhotoURL().contains("COVER-"+DEFAULT_PROFILE_NAME)) {
                    this.amazonS3Service.deleteImageFromS3Bucket(getBucketName(), user.getCoverPhotoURL());
                }

                user.setCoverPhotoURL(imageUrl);
                userDao.save(user);
                LOG.info("Edited {}'s profile cover photo successfully!", user.getUsername());
                break;
            }
            default:
                LOG.info("Photo was not saved on Amazon S3!");
                throw new BadRequestException("Wrong selection string was put as parameter.");
        }

        return user;
    }

    @Override
    public User registerAlpacaApiKey(Long id, String code) {
        User userToUpdate = userDao.findUserById(id);
        if (userToUpdate == null) {
            throw new EntityNotFoundException(String.format("User with id %s not found", id));
        }
        try {
            String redirectUri = activeProfile.getApplicationUrl();

            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = buildRequest(code, redirectUri);
            HttpResponse<?> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            // parse json response using gson
            Gson gson = new Gson();
            AlpacaOAuthResponse alpacaOAuthResponse = gson.fromJson(response.body().toString(), AlpacaOAuthResponse.class);
            LOG.info("Alpaca code successfully converted into OAuth token {}", alpacaOAuthResponse.getAccessToken());

            // update alpacaApiKey; code => oauthToken
            userToUpdate.setAlpacaApiKey(alpacaOAuthResponse.getAccessToken());
            userDao.save(userToUpdate);
            LOG.info("Registered Alpaca key for user email {}", userToUpdate.getEmail());

        } catch (Exception exception) {
            LOG.error("Error occurred while trying to process alpaca api key for user {}", exception.getMessage());
        }

        return userToUpdate;
    }

    /**
     * A method to verify given credentials against existing user records
     *
     * @param credentials A User object with email and unencrypted password
     * @return The full User object from the database if login is successful, null
     * otherwise
     */
    @Override
    public User login(User credentials) throws CredentialNotFoundException {
        User user = userDao.findUserByEmail(credentials.getEmail());
        if (user != null && compareDigests(credentials.getPassword(), user.getPassword())) {
            return user;
        } else {
            throw new CredentialNotFoundException("Authentication failed for this email/pwd combination.");
        }
    }

    @Override
    public Long followUser(Long userId, Long userToFollowId) {
        if (userId.longValue() == userToFollowId.longValue()) { // change the way comparison is done to fix the codesmell
            // in sonarcloud
            throw new FollowsRelationshipException(USER_CANT_BE_FOLLOWED_BY_ITSELF);
        }
        User user = userDao.findUserById(userId);
        User userToFollow = userDao.findUserById(userToFollowId);
        if (user == null || userToFollow == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        List<Follows> alreadyFollowed = followsDao.findByFollowerIdAndUserToFollowId(userId, userToFollowId);
        // check to see if user already following the other user
        if (!alreadyFollowed.isEmpty()) {
            throw new FollowsRelationshipException(USER_ALREADY_FOLLOWED.getMessage());
        }
        Date currentDate = new Date();
        Follows newFollowRel = new Follows(user, userToFollow, currentDate);
        followsDao.save(newFollowRel);

        return userToFollowId;
    }

    @Override
    public Long unfollowUser(Long userId, Long userToUnfollowId) {
        User user = userDao.findUserById(userId);
        User userToUnfollow = userDao.findUserById(userToUnfollowId);
        if (user == null || userToUnfollow == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        List<Follows> allFollowRels = followsDao.findByFollowerIdAndUserToFollowId(userId, userToUnfollowId);
        if (allFollowRels.isEmpty()) {
            throw new FollowsRelationshipException(NOT_FOLLOWED_BY_THIS_USER);
        }
        for (Follows rel : allFollowRels) {
            followsDao.delete(rel);
        }
        return userToUnfollowId;
    }

    @Override
    public List<SanitizedUser> getFollowings(Long userId) {
        User user = userDao.findUserById(userId);
        if (user == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }

        List<Follows> allFollowRels = followsDao.findByFollowerId(userId);
        List<SanitizedUser> thisUserFollowings = new ArrayList<>();

        if (allFollowRels.isEmpty()) {
            return thisUserFollowings;
        }

        for (Follows rel : allFollowRels) { // going through all follow relationships and return the followed user for
            // when this user was the follower
            SanitizedUser sanitizedFollowed = new SanitizedUser(rel.getUserToFollow());
            thisUserFollowings.add(sanitizedFollowed);
        }
        return thisUserFollowings;

    }

    @Override
    public List<SanitizedUser> getFollowers(Long userId) {
        User user = userDao.findUserById(userId);
        if (user == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }

        List<Follows> allFollowRels = followsDao.findByUserToFollowId(userId);
        List<SanitizedUser> thisUserFollowers = new ArrayList<>();

        if (allFollowRels.isEmpty()) {
            return thisUserFollowers;
        }

        for (Follows rel : allFollowRels) {
            // going through all follow relationships and return the followers for when this
            // user was followed
            SanitizedUser sanitizedFollower = new SanitizedUser(rel.getFollower());
            thisUserFollowers.add(sanitizedFollower);
        }
        return thisUserFollowers;
    }

    @Override
    public void deleteUserByEmail(String email) {
        User existingUser = userDao.findUserByEmail(email);
        if (existingUser == null) {
            throw new EntityNotFoundException(USER_NOT_FOUND);
        }
        userDao.delete(existingUser);
    }

    @Override
    public List<User> getTopUsers(String symbol) {
        List<User> users = ownsDao.findAll().stream()
                        .filter(owns -> owns.getUser().getScore() != null && owns.getStock().getSymbol().equals(symbol))
                        .map(Owns::getUser)
                        .sorted(Comparator.comparing(User::getScore).reversed())
                        .distinct() // distinct users in results
                        .collect(toList());

        if (users.isEmpty()) {
            return emptyList();
        }

        int top10percent = Math.max(users.size() / 10 , 1); // rounded down for conservative results

        return users.stream()
                .limit(top10percent)
                .collect(toList());
    }
  
    public List<SanitizedUser> getLeaderboard() {
        return userDao.findAll().stream()
                // discarding null scores
                .filter(user -> user.getScore()!=null)
                // sort by score desc
                .sorted(Comparator.comparing(User::getScore).reversed())
                // sanitize user list
                .map(SanitizedUser::new)
                // limit to 50 top investors
                .limit(50)
                .collect(Collectors.toList());
    }

    @Override
    public List<User> getFollowersWhoOwnsTheStock(Long id, String symbol) {
        List<User> followersWhoOwnsThisStock = new ArrayList<>();

        User user = getUserById(id);
        Stock stock = stockService.getStockBySymbol(symbol);
        List<Follows> followers = followsDao.findByUserToFollowId(user.getId());

        followers.forEach(follower -> addFollowerToList(follower, followersWhoOwnsThisStock, stock));
        return followersWhoOwnsThisStock;
    }

    @Override
    public List<Map<String, String>> getSearchUsers() {
        return userDao.getSearchUsers();
    }

    @Override
    public UserValidator getUserValidator() {
        return validatorFactory.getUserValidator();
    }

    private void addFollowerToList(Follows follower, List<User> followersWhoOwnTheStock, Stock stock) {
        // add the follower to the list only if he owns the given stock
        List<Owns> ownedStock = ownsDao.findByUserIdAndStockId(follower.getFollower().getId(), stock.getId());
        if (!ownedStock.isEmpty()) {
            followersWhoOwnTheStock.add(follower.getFollower());
        }
    }

    public String encryptData(String text) {
        return passwordEncryption.toGraphProperty(text);
    }

    public boolean compareDigests(String plainPassword, String encryptedPassword) {
        return passwordEncryption.checkPassword(plainPassword, encryptedPassword);
    }

    public String getBucketName() {
        return bucketName;
    }

    private HttpRequest buildRequest(String code, String redirectUri) {
        HashMap<String, String> parameters = new HashMap<>();
        parameters.put("grant_type", AUTHORIZATION_CODE);
        parameters.put("code", code);
        parameters.put("client_id", clientId);
        parameters.put("client_secret", clientSecret);
        parameters.put("redirect_uri", redirectUri);

        String form = parameters.keySet().stream()
                .map(key -> key + "=" + URLEncoder.encode(parameters.get(key), StandardCharsets.UTF_8))
                .collect(Collectors.joining("&"));

        return HttpRequest.newBuilder().uri(URI.create("https://api.alpaca.markets/oauth/token"))
                .headers("Content-Type", "application/x-www-form-urlencoded")
                .POST(HttpRequest.BodyPublishers.ofString(form)).build();
    }

    @Override
    public Float getUserPercentile(String username) {
        List<String> usernames = userDao.getUsernamesSortedByScoreDesc();
        float index = 0;
        for (int i = 0; i < usernames.size(); i++) {
            if (usernames.get(i).equals(username)) {
                index = i+1;
                break;
            }
        }
        return index/usernames.size()*100;
    }
}