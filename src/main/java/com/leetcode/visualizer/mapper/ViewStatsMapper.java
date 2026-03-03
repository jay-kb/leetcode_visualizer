package com.leetcode.visualizer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.leetcode.visualizer.entity.ViewStats;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ViewStatsMapper extends BaseMapper<ViewStats> {

    /**
     * 批量插入或更新浏览量统计
     */
    void batchInsertOrUpdate(@Param("list") List<ViewStats> list);

    /**
     * 查询指定日期范围的浏览量统计
     */
    List<ViewStats> selectByDateRange(@Param("startDate") LocalDate startDate,
                                       @Param("endDate") LocalDate endDate,
                                       @Param("solutionId") Long solutionId);

    /**
     * 查询题解的浏览量统计（按维度）
     */
    List<ViewStats> selectByDimension(@Param("solutionId") Long solutionId,
                                        @Param("dimension") String dimension,
                                        @Param("startDate") LocalDate startDate,
                                        @Param("endDate") LocalDate endDate);

    /**
     * 查询热门题解排行
     */
    List<ViewStats> selectTopSolutions(@Param("dimension") String dimension,
                                         @Param("startDate") LocalDate startDate,
                                         @Param("endDate") LocalDate endDate,
                                         @Param("limit") Integer limit);

    /**
     * 统计总浏览量
     */
    Long sumViewCount(@Param("startDate") LocalDate startDate,
                      @Param("endDate") LocalDate endDate,
                      @Param("solutionId") Long solutionId);
}
