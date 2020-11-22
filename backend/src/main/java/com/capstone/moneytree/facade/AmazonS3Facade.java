package com.capstone.moneytree.facade;

import com.amazonaws.AmazonClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.event.ProgressListener;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.amazonaws.services.s3.transfer.Upload;
import com.capstone.moneytree.exception.FailedUploadImageS3Exception;
import com.capstone.moneytree.service.impl.DefaultUserService;
import org.apache.commons.lang.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;

@Component
public class AmazonS3Facade {

    private static final Logger LOG = LoggerFactory.getLogger(AmazonS3Facade.class);
    private AmazonS3 amazonS3;

    public AmazonS3Facade(@Value("${access.key.id}") String s3AccessKey, @Value("${secret.access.key}") String s3SecretKey) {
        AWSCredentials credentials = new BasicAWSCredentials(
                s3AccessKey,
                s3SecretKey
        );
        this.amazonS3 = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.DEFAULT_REGION)
                .build();
    }

    public String uploadImageToS3Bucket(MultipartFile f, String bucketName) {
        File image = this.convertMultiPartToFile(f);
        if (image != null) {
            TransferManager tm = TransferManagerBuilder.standard()
                    .withS3Client(amazonS3)
                    .withMultipartUploadThreshold((long) (5 * 1024 * 1025))
                    .build();

            // generate unique name
            String keyName = RandomStringUtils.randomAlphanumeric(17).toUpperCase() + "-" + image.getName();

            //upload and wait for completion
            Upload upload = tm.upload(bucketName, keyName, image);
            try {
                upload.waitForCompletion();
                this.cleanUpLocalFileCreated(image);
                LOG.info("Uploaded " + keyName + " successfully!");

                //return image s3 url
                String url = "https://" + bucketName + ".s3.amazonaws.com/" + keyName;
                return url;
            } catch (AmazonClientException | InterruptedException e) {
                throw new FailedUploadImageS3Exception("Failed when uploading to S3");
            }
        }
        else {
            throw new FailedUploadImageS3Exception("Invalid file format");
        }
    }

    //need to convert MultipartFile => File
    private File convertMultiPartToFile(MultipartFile file) {
        File convFile;
        try {
            convFile = new File(file.getOriginalFilename());
            FileOutputStream fos = new FileOutputStream(convFile);
            fos.write(file.getBytes());
            fos.close();
            System.out.println("Converted file successfully!");
        }
        catch (Exception e) {
            throw new FailedUploadImageS3Exception("Failed when converting file");
        }
        return convFile;
    }

    private void cleanUpLocalFileCreated(File image) {
        //delete the local image
        if (!image.delete())
            throw new FailedUploadImageS3Exception("Failed when deleting local file");
    }

}
