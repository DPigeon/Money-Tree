package com.capstone.moneytree.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.capstone.moneytree.facade.AmazonS3Facade;
import com.capstone.moneytree.service.api.AmazonS3Service;

@Service
public class DefaultAmazonS3Service implements AmazonS3Service {

    private final AmazonS3Facade amazonS3Facade;

    @Autowired
    public DefaultAmazonS3Service(AmazonS3Facade amazonS3Facade) {
        this.amazonS3Facade = amazonS3Facade;
    }

    @Override
    public String uploadImageToS3Bucket(MultipartFile image, String bucketName) {
        return amazonS3Facade.uploadImageToS3Bucket(image, bucketName);
    }

    @Override
    public void deleteImageFromS3Bucket(String bucketName, String url) {
        amazonS3Facade.deleteImageFromS3Bucket(bucketName, url);
    }
}
