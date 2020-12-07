package com.capstone.moneytree.service.impl;

import com.capstone.moneytree.facade.AmazonS3Facade;
import com.capstone.moneytree.service.api.AmazonS3Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
public class DefaultAmazonS3Service implements AmazonS3Service {

    private final AmazonS3Facade amazonS3Facade;

    @Autowired
    public DefaultAmazonS3Service(AmazonS3Facade amazonS3Facade) {
        this.amazonS3Facade = amazonS3Facade;
    }

    @Override
    public String uploadImageToS3Bucket(MultipartFile image, String bucketName) {
        String imageUrl = amazonS3Facade.uploadImageToS3Bucket(image, bucketName);
        return imageUrl;
    }

    @Override
    public void deleteImageFromS3Bucket(String bucketName, String url) {
        amazonS3Facade.deleteImageFroms3Bucket(bucketName, url);
    }
}
