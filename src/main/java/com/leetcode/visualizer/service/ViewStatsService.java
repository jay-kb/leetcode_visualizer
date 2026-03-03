package com.leetcode.visualizer.service;

import java.util.List;
import java.util.Map;

public interface ViewStatsService {

    /**
     * 获取浏览量统计（按维度）
     */
    Map<String, Object> getViewStats(Long solutionId, String dimension, String startDate, String endDate);

    /**
     * 获取热门题解排行
     */
    List<Map<String, Object>> getTopSolutions(String dimension, Integer limit);

    /**
     * 获取总体统计概览
     */
    Map<String, Object> getOverview();
}
