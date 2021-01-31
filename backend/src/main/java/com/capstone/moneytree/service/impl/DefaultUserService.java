package com.capstone.moneytree.service.impl;

import javax.security.auth.login.CredentialNotFoundException;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.capstone.moneytree.dao.UserDao;
import com.capstone.moneytree.exception.BadRequestException;
import com.capstone.moneytree.exception.EntityNotFoundException;
import com.capstone.moneytree.model.node.User;
import com.capstone.moneytree.service.api.AmazonS3Service;
import com.capstone.moneytree.service.api.UserService;
import com.capstone.moneytree.utils.MoneyTreePasswordEncryption;
import com.capstone.moneytree.validator.UserValidator;
import com.capstone.moneytree.validator.ValidatorFactory;

/**
 * {@inheritDoc}
 */
@Service
@Transactional
public class DefaultUserService implements UserService {

   private static final String USER_NOT_FOUND = "The requested user was not found";
   private static final String DEFAULT_PROFILE_NAME = "DEFAULT-profile.jpg";

   private final UserDao userDao;
   private final ValidatorFactory validatorFactory;
   private final MoneyTreePasswordEncryption passwordEncryption;
   private static final Logger LOG = LoggerFactory.getLogger(DefaultUserService.class);
   private final AmazonS3Service amazonS3Service;

   private final String bucketName;

   @Autowired
   public DefaultUserService(UserDao userDao, ValidatorFactory validatorFactory, AmazonS3Service amazonS3Service,
         @Value("${aws.profile.pictures.bucket}") String bucketName) {
      this.userDao = userDao;
      this.validatorFactory = validatorFactory;
      this.passwordEncryption = new MoneyTreePasswordEncryption();
      this.amazonS3Service = amazonS3Service;
      this.bucketName = bucketName;
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
      user.setCoverPhotoURL(String.format("https://%s.s3.amazonaws.com/%s", bucketName, DEFAULT_PROFILE_NAME)); // TODO: must be changed to a general cover photo

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

      if (user.getBiography() != null) {
         userToUpdate.setBiography(user.getBiography());
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

      if (user.getAlpacaApiKey() != null) {
         userToUpdate.setAlpacaApiKey(user.getAlpacaApiKey());
      }

      if (user.getFollowers() != null) {
         userToUpdate.setFollowers(user.getFollowers());
      }

      if (user.getStocks() != null) {
         userToUpdate.setStocks(user.getStocks());
      }

      if (user.getTransactions() != null) {
         userToUpdate.setTransactions(user.getTransactions());
      }

      User updatedUser = userDao.save(userToUpdate);
      LOG.info("Updated user: {}", updatedUser.getUsername());

      return userToUpdate;
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
            // set new image url
            user.setAvatarURL(imageUrl);
            userDao.save(user);
            LOG.info("Edited {}'s profile picture successfully!", user.getUsername());
            break;
         }
         case "coverPhotoURL": {
            String imageUrl = amazonS3Service.uploadImageToS3Bucket(imageFile, getBucketName());
            if (StringUtils.isNotBlank(user.getCoverPhotoURL())
                  && !user.getCoverPhotoURL().contains(DEFAULT_PROFILE_NAME)) {
               this.amazonS3Service.deleteImageFromS3Bucket(getBucketName(), user.getCoverPhotoURL());
            }
            // set new image url
            user.setCoverPhotoURL(imageUrl);
            userDao.save(user);
            LOG.info("Edited {}'s profile cover photo successfully!", user.getUsername());
            break;
         }
         default:
            LOG.info("Photo was not saved on Amazon S3!");
            throw new BadRequestException(String.format("Wrong selection string was put as parameter."));
      }
      return user;
   }

   @Override
   public User registerAlpacaApiKey(Long id, String key) {
      User userToUpdate = userDao.findUserById(id);
      if (userToUpdate == null) {
         throw new EntityNotFoundException(String.format("User with id %s not found", id));
      }
      userToUpdate.setAlpacaApiKey(key);
      userDao.save(userToUpdate);

      LOG.info("Registered Alpaca key for user email {}", userToUpdate.getEmail());

      return userToUpdate;
   }

   /**
    * A method to verify given credentials against existing user records
    *
    * @param credentials A User object with email and unencrypted password
    * @return The full User object from the database if login is successful, null
    *         otherwise
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
   public void deleteUserByEmail(String email) {
      User existingUser = userDao.findUserByEmail(email);
      if (existingUser == null) {
         throw new EntityNotFoundException(USER_NOT_FOUND);
      }
      userDao.delete(existingUser);
   }

   @Override
   public UserValidator getUserValidator() {
      return validatorFactory.getUserValidator();
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
}