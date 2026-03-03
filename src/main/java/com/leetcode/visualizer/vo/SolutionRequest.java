package com.leetcode.visualizer.vo;

import lombok.Data;

import java.util.List;

@Data
public class SolutionRequest {

    private String title;

    private String description;

    private Integer leetcodeQuestionId;

    private String leetcodeUrl;

    private Integer difficulty;

    private String htmlFileUrl;

    private String coverImageUrl;

    private Integer status;

    private List<Long> tagIds;
}
