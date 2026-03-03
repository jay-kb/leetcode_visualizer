package com.leetcode.visualizer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.leetcode.visualizer.entity.SolutionTagRel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SolutionTagRelMapper extends BaseMapper<SolutionTagRel> {

    /**
     * 根据题解ID查询标签ID列表
     */
    List<Long> selectTagIdsBySolutionId(@Param("solutionId") Long solutionId);

    /**
     * 根据标签ID查询题解ID列表
     */
    List<Long> selectSolutionIdsByTagId(@Param("tagId") Long tagId);

    /**
     * 删除题解的所有标签关联
     */
    void deleteBySolutionId(@Param("solutionId") Long solutionId);
}
