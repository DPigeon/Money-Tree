package com.capstone.moneytree;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ActiveProfile {

   private static final String LOCAL_APP_URL = "http://localhost:4200/";
   private static final String DEV_APP_URL = "https://dev.money-tree.tech/";
   private static final String PROD_APP_URL = "https://money-tree.tech/";

   @Value("${spring.profiles.active}")
   private String currentProfile;

   public String getSpringProfile() {
      return currentProfile.toLowerCase();
   }

   public String getApplicationUrl() {
      switch (currentProfile) {
         case "local":
            return LOCAL_APP_URL;
         case "dev":
            return DEV_APP_URL;
         default:
            return PROD_APP_URL;
      }
   }
}