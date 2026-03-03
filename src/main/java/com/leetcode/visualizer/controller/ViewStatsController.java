package com.leetcode.visualizer.controller;

import com.leetcode.visualizer.common.Result;
import com.leetcode.visualizer.service.ViewStatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/view-stats")
public class ViewStatsController {

    @Autowired
    private ViewStatsService viewStatsService;

    /**
     * 获取浏览量统计（按维度）
     */
    @GetMapping
    public Result<Map<String, Object>> getViewStats(
            @RequestParam(required = false) Long solutionId,
            @RequestParam String dimension,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        Map<String, Object> result = viewStatsService.getViewStats(solutionId, dimension, startDate, endDate);
        return Result.success(result);
    }

    /**
     * 获取热门题解排行
     */
    @GetMapping("/top")
    public Result<List<Map<String, Object>>> getTopSolutions(
            @RequestParam String dimension,
            @RequestParam(required = false, defaultValue = "10") Integer limit) {
        List<Map<String, Object>> result = viewStatsService.getTopSolutions(dimension, limit);
        return Result.success(result);
    }

    /**
     * 获取总体统计概览
     */
    @GetMapping("/overview")
    public Result<Map<String, Object>> getOverview() {
        Map<String, Object> result = viewStatsService.getOverview();
        return Result.success(result);
    }
}
