package com.capstone.moneytree.controller;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@RestController
@RequestMapping("/api/v1")
@CrossOrigin(
        origins = { "http://localhost:4200", "http://127.0.0.1", "https://127.0.0.1" },
        exposedHeaders = { "Location" })
public @interface MoneyTreeController {}
