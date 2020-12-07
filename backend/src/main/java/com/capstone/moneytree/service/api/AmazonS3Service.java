package com.capstone.moneytree.service.api;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;

public interface AmazonS3Service {
    String uploadImageToS3Bucket(MultipartFile image, String bucketName);
    void deleteImageFromS3Bucket(String bucketName, String url);
}
