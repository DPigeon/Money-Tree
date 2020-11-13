package com.capstone.moneytree;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@EnableNeo4jRepositories
@SpringBootApplication
@Configuration
@EnableEncryptableProperties
@PropertySource(name="EncryptedProperties", value = "classpath:application.properties")
public class MoneytreeApplication {

    public static void main(String[] args) { SpringApplication.run(MoneytreeApplication.class, args); }
}
