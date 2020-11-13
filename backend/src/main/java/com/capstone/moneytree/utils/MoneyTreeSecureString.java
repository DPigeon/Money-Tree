package com.capstone.moneytree.utils;

import org.jasypt.encryption.StringEncryptor;
import org.jasypt.encryption.pbe.PooledPBEStringEncryptor;
import org.jasypt.encryption.pbe.config.SimpleStringPBEConfig;

public class MoneyTreeSecureString {

    private static final String ENCRYPTION_PASSWORD = "test"; // TODO: replace with System.getenv().get("ENCRYPTION_PASSWORD") for better security using secrets

    public StringEncryptor stringEncryptor() {
        PooledPBEStringEncryptor encryptor = new PooledPBEStringEncryptor();
        SimpleStringPBEConfig config = new SimpleStringPBEConfig();
        config.setPassword(ENCRYPTION_PASSWORD);
        config.setAlgorithm("PBEWITHHMACSHA512ANDAES_256");
        config.setKeyObtentionIterations("1000");
        config.setPoolSize("1");
        config.setProviderName("SunJCE");
        config.setSaltGeneratorClassName("org.jasypt.salt.RandomSaltGenerator");
        config.setIvGeneratorClassName("org.jasypt.iv.RandomIvGenerator");
        config.setStringOutputType("base64");
        encryptor.setConfig(config);
        return encryptor;
    }

    /**
     * Method to encrypt the value before it is persisted to Neo4j
     * @param text The string value
     * @return An encrypted text
     */
    public String toGraphProperty(String text) {
        return stringEncryptor().encrypt(text);
    }

    /**
     * Method to decrypt the value before it is used in the backend
     * @param text The string value
     * @return A decrypted text
     */
    public String toEntityAttribute(String text) {
        return stringEncryptor().decrypt(text);
    }
}
