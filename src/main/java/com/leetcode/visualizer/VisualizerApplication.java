package com.leetcode.visualizer;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@MapperScan("com.leetcode.visualizer.mapper")
@EnableScheduling
public class VisualizerApplication {

    public static void main(String[] args) {
        SpringApplication.run(VisualizerApplication.class, args);
    }
}
