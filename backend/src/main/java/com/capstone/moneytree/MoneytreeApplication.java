package com.capstone.moneytree;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.neo4j.repository.config.EnableNeo4jRepositories;
import org.springframework.transaction.annotation.EnableTransactionManagement;

import com.ulisesbocchio.jasyptspringboot.annotation.EnableEncryptableProperties;

@EnableTransactionManagement
@EnableNeo4jRepositories
@SpringBootApplication
@Configuration
@EnableEncryptableProperties
public class MoneytreeApplication {

    public static void main(String[] args) { SpringApplication.run(MoneytreeApplication.class, args); }
}
