package com.capstone.moneytree.service

import com.capstone.moneytree.facade.AmazonS3Facade
import com.capstone.moneytree.service.api.AmazonS3Service
import com.capstone.moneytree.service.impl.DefaultAmazonS3Service
import com.capstone.moneytree.utils.MoneyTreeTestUtils
import org.springframework.web.multipart.MultipartFile
import spock.lang.Specification

/**
 * This class is used to test all basic implementation for the AmazonS3 Service.
 */
class DefaultAmazonS3ServiceTest extends Specification {

    AmazonS3Facade amazonS3Facade = Mock()
    AmazonS3Service amazonS3Service = new DefaultAmazonS3Service(amazonS3Facade)

    def "Should upload image to S3 by calling the facade once"() {
        given: "An image and bucket name"
        MultipartFile image = MoneyTreeTestUtils.getMultipartFile()
        String bucketName = "test"

        when: "It upload image to S3"
        amazonS3Service.uploadImageToS3Bucket(image, bucketName)

        then: "It should be uploaded"
        1 * amazonS3Facade.uploadImageToS3Bucket(image, bucketName)
    }

    def "Should delete an image from S3 by calling the facade once"() {
        given: "An image and bucket name"
        String bucketName = "test"
        String url = "http://test-delete"

        when: "It upload image to S3"
        amazonS3Service.deleteImageFromS3Bucket(bucketName, url)

        then: "It should be uploaded"
        1 * amazonS3Facade.deleteImageFromS3Bucket(bucketName, url)
    }
}
