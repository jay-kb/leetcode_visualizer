package com.leetcode.visualizer.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.util.Date;

@Data
@TableName("solution_tag_rel")
public class SolutionTagRel {

    @TableId(type = IdType.AUTO)
    private Long id;

    private Long solutionId;

    private Long tagId;

    @TableField(fill = FieldFill.INSERT)
    private Date createTime;

    @TableLogic
    private Integer deleted;
}
