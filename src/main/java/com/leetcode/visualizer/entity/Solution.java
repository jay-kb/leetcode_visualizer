package com.leetcode.visualizer.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;
import java.util.List;

@Getter
@Setter
@Data
@TableName("solution")
public class Solution {

    @TableId(type = IdType.AUTO)
    private Long id;

    private String title;

    private String description;

    private Integer leetcodeQuestionId;

    private String leetcodeUrl;

    /**
     * 难度：1-简单，2-中等，3-困难
     */
    private Integer difficulty;

    private String htmlFileUrl;

    private String coverImageUrl;

    private Long viewCount;

    private Long likeCount;

    /**
     * 状态：0-草稿，1-已发布
     */
    private Integer status;

    private String createdBy;

    @TableField(fill = FieldFill.INSERT)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date createTime;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Date updateTime;

    @TableLogic
    private Integer deleted;

    /**
     * 标签列表（非数据库字段）
     */
    @TableField(exist = false)
    private List<Tag> tags;
}
