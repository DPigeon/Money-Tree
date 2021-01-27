package com.capstone.moneytree.facade;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;

import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.amazonaws.services.s3.transfer.Upload;
import com.capstone.moneytree.exception.ExceptionAmazonS3;

@Component
public class AmazonS3Facade {

   private static final Logger LOG = LoggerFactory.getLogger(AmazonS3Facade.class);
   private AmazonS3 s3;

   public AmazonS3Facade(@Value("${aws.access.key.id}") String accessKey, @Value("${aws.secret.access.key}") String secretKey) {
      AWSCredentials credentials = new BasicAWSCredentials(
              accessKey,
              secretKey
      );
      this.s3 = AmazonS3ClientBuilder
              .standard()
              .withCredentials(new AWSStaticCredentialsProvider(credentials))
              .withRegion(Regions.DEFAULT_REGION)
              .build();
   }

   public String uploadImageToS3Bucket(MultipartFile f, String bucketName) {
      File image = convertMultiPartToFile(f);
      if (image.exists()) {
         TransferManager tm = TransferManagerBuilder.standard()
                 .withS3Client(s3)
                 .withMultipartUploadThreshold((long) (5 * 1024 * 1025))
                 .build();

         // generate unique name
         String keyName = RandomStringUtils.randomAlphanumeric(17).toUpperCase() + "-" + image.getName();

         //upload and wait for completion
         Upload upload = tm.upload(bucketName, keyName, image);
         try {
            upload.waitForCompletion();
            this.cleanUpLocalFileCreated(image);
            LOG.info("Uploaded {} successfully!", keyName);
            return String.format("https://%s.s3.amazonaws.com/%s", bucketName, keyName);
         } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            LOG.error("Failed to upload image");
            throw new ExceptionAmazonS3("Failed to upload image");
         }
      } else {
         throw new ExceptionAmazonS3("Invalid file format");
      }
   }

   //need to convert MultipartFile => File
   public File convertMultiPartToFile(MultipartFile file) {
      File convFile;
      try {
         convFile = new File(Objects.requireNonNull(file.getOriginalFilename()));
         FileOutputStream fos = new FileOutputStream(convFile);
         fos.write(file.getBytes());
         fos.close();
         LOG.info("Converted file successfully!");
      } catch (Exception e) {
         throw new ExceptionAmazonS3("Failed to convert file");
      }
      return convFile;
   }

   private void cleanUpLocalFileCreated(File image) {
      try {
         if (!Files.deleteIfExists(Path.of(image.getAbsolutePath()))) {
            throw new ExceptionAmazonS3("Failed when deleting local file");
         }
      } catch (IOException e) {
         LOG.error("Error deleting the file. {}", e.getMessage());
      }
   }

   public void deleteImageFromS3Bucket(String bucketName, String url) {
      if (StringUtils.isBlank(url)) {
         // No need to delete the previous profile pic if url is empty
         return;
      }
      try {
         String[] urlPieces = url.split("/");
         String keyName = urlPieces[urlPieces.length - 1];
         s3.deleteObject(bucketName, keyName);
         LOG.info("Deleted {} successfully!", keyName);
      } catch (AmazonServiceException e) {
         throw new ExceptionAmazonS3(e.getErrorMessage());
      }
   }
}
