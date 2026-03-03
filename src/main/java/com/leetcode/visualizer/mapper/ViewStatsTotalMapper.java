package com.leetcode.visualizer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.leetcode.visualizer.entity.ViewStatsTotal;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;

@Mapper
public interface ViewStatsTotalMapper extends BaseMapper<ViewStatsTotal> {

    /**
     * 查询指定日期的总浏览量
     */
    ViewStatsTotal selectByDate(@Param("statDate") LocalDate statDate);

    /**
     * 统计日期范围内的总浏览量
     */
    Long sumTotalViews(@Param("startDate") LocalDate startDate,
                       @Param("endDate") LocalDate endDate);
}
