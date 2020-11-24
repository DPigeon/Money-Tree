package com.capstone.moneytree.utils;

import org.jasypt.util.password.StrongPasswordEncryptor;

public class MoneyTreePasswordEncryption {

   StrongPasswordEncryptor passwordEncryptor = new StrongPasswordEncryptor();

   /**
    * Method to encrypt the value before it is persisted to Neo4j
    *
    * @param text The string value
    * @return An encrypted text
    */
   public String toGraphProperty(String text) {
      return passwordEncryptor.encryptPassword(text);
   }

   /**
    * Method to compare the digest of two passwords together
    *
    * @param plainPassword     The password
    * @param encryptedPassword The encrypted password
    * @return True if digests matches or false if they don't
    */
   public boolean checkPassword(String plainPassword, String encryptedPassword) {
      return passwordEncryptor.checkPassword(plainPassword, encryptedPassword);
   }
}
