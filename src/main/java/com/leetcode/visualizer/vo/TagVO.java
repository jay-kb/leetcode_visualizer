package com.leetcode.visualizer.vo;

import lombok.Data;

import java.util.Date;

@Data
public class TagVO {

    private Long id;
    private String name;
    private String color;
    private Long solutionCount;
    private Date createTime;
}
