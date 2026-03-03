package com.leetcode.visualizer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.leetcode.visualizer.entity.Solution;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SolutionMapper extends BaseMapper<Solution> {

    /**
     * 根据标签ID查询题解列表
     */
    List<Solution> selectByTagId(@Param("tagId") Long tagId);

    /**
     * 查询题解及其标签
     */
    List<Solution> selectSolutionWithTags(@Param("tagId") Long tagId,
                                          @Param("difficulty") Integer difficulty,
                                          @Param("status") Integer status);
}
