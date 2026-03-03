package com.leetcode.visualizer.service;

import com.leetcode.visualizer.entity.Solution;
import com.leetcode.visualizer.entity.ViewStats;
import com.leetcode.visualizer.entity.ViewStatsTotal;
import com.leetcode.visualizer.mapper.SolutionMapper;
import com.leetcode.visualizer.mapper.ViewStatsMapper;
import com.leetcode.visualizer.mapper.ViewStatsTotalMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@Slf4j
public class ViewStatsServiceImpl implements ViewStatsService {

    @Autowired
    private ViewStatsMapper viewStatsMapper;

    @Autowired
    private ViewStatsTotalMapper viewStatsTotalMapper;

    @Autowired
    private SolutionMapper solutionMapper;

    @Override
    public Map<String, Object> getViewStats(Long solutionId, String dimension, String startDate, String endDate) {
        LocalDate start = LocalDate.parse(startDate);
        LocalDate end = LocalDate.parse(endDate);

        List<Map<String, Object>> records = new ArrayList<>();

        // 根据维度生成日期列表
        List<LocalDate> dates = generateDates(start, end, dimension);

        // 获取题解映射
        Map<Long, String> solutionMap = getSolutionMap();

        long total = 0;
        long maxViews = 0;
        long minViews = Long.MAX_VALUE;

        for (LocalDate date : dates) {
            String dateStr = date.toString();
            long viewCount = 0;

            if (solutionId != null) {
                // 从数据库查询指定题解的浏览量
                List<ViewStats> stats = viewStatsMapper.selectByDateRange(date, date, solutionId);
                if (!stats.isEmpty()) {
                    viewCount = stats.get(0).getViewCount();
                }
            } else {
                // 从数据库查询全站浏览量
                ViewStatsTotal totalStats = viewStatsTotalMapper.selectByDate(date);
                if (totalStats != null) {
                    viewCount = totalStats.getTotalViews();
                }
            }

            Map<String, Object> record = new HashMap<>();
            record.put("date", dateStr);
            record.put("viewCount", viewCount);
            records.add(record);

            total += viewCount;
            maxViews = Math.max(maxViews, viewCount);
            minViews = Math.min(minViews, viewCount == 0 ? 0 : viewCount);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("dimension", dimension);
        result.put("startDate", startDate);
        result.put("endDate", endDate);
        result.put("records", records);
        result.put("total", total);

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalViews", total);
        summary.put("avgViews", records.isEmpty() ? 0 : total / records.size());
        summary.put("maxViews", maxViews);
        summary.put("minViews", minViews == Long.MAX_VALUE ? 0 : minViews);
        result.put("summary", summary);

        return result;
    }

    @Override
    public List<Map<String, Object>> getTopSolutions(String dimension, Integer limit) {
        if (limit == null || limit <= 0) {
            limit = 10;
        }

        LocalDate[] dateRange = getDateRangeByDimension(dimension);
        LocalDate startDate = dateRange[0];
        LocalDate endDate = dateRange[1];

        // 从数据库查询热门题解
        List<ViewStats> topStats = viewStatsMapper.selectTopSolutions(dimension, startDate, endDate, limit);

        // 获取题解信息
        Map<Long, String> solutionMap = getSolutionMap();

        List<Map<String, Object>> result = new ArrayList<>();
        long rank = 1;
        for (ViewStats stats : topStats) {
            Map<String, Object> item = new HashMap<>();
            Map<Long, Integer> solutionToQuestionIdMap = getSolutionToQuestionIdMap();
            Integer leetcodeQuestionId = solutionToQuestionIdMap.get(stats.getSolutionId());
            item.put("leetcodeQuestionId", leetcodeQuestionId != null ? leetcodeQuestionId : stats.getSolutionId());
            item.put("title", solutionMap.getOrDefault(stats.getSolutionId(), "未知"));
            item.put("viewCount", stats.getViewCount());
            item.put("rank", rank++);
            result.add(item);
        }

        return result;
    }

    @Override
    public Map<String, Object> getOverview() {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.minusDays(6);
        LocalDate monthStart = today.minusDays(29);
        LocalDate yearStart = today.minusDays(364);

        // 从数据库获取各维度浏览量
        long todayViews = getViewsFromDB(today, today);
        long weekViews = getViewsFromDB(weekStart, today);
        long monthViews = getViewsFromDB(monthStart, today);
        long yearViews = getViewsFromDB(yearStart, today);
        long totalViews = getTotalViews();

        // 计算趋势
        Map<String, String> trend = new HashMap<>();
        trend.put("day", calculateTrend(today.minusDays(1), today));
        trend.put("week", calculateTrend(today.minusDays(7), weekStart));
        trend.put("month", calculateTrend(today.minusDays(30), monthStart));

        Map<String, Object> result = new HashMap<>();
        result.put("todayViews", todayViews);
        result.put("weekViews", weekViews);
        result.put("monthViews", monthViews);
        result.put("yearViews", yearViews);
        result.put("totalViews", totalViews);
        result.put("trend", trend);

        return result;
    }

    private List<LocalDate> generateDates(LocalDate start, LocalDate end, String dimension) {
        List<LocalDate> dates = new ArrayList<>();
        LocalDate current = start;

        while (!current.isAfter(end)) {
            dates.add(current);
            switch (dimension) {
                case "day":
                    current = current.plusDays(1);
                    break;
                case "week":
                    current = current.plusWeeks(1);
                    break;
                case "month":
                    current = current.plusMonths(1);
                    break;
                case "year":
                    current = current.plusYears(1);
                    break;
                default:
                    current = current.plusDays(1);
            }
        }

        return dates;
    }

    private Map<Long, String> getSolutionMap() {
        Map<Long, String> map = new HashMap<>();
        List<Solution> solutions = solutionMapper.selectList(null);
        if (solutions != null) {
            for (Solution solution : solutions) {
                map.put(solution.getId(), solution.getTitle());
            }
        }
        return map;
    }

    /**
     * 获取 solutionId 到 leetcodeQuestionId 的映射
     */
    private Map<Long, Integer> getSolutionToQuestionIdMap() {
        Map<Long, Integer> map = new HashMap<>();
        List<Solution> solutions = solutionMapper.selectList(null);
        if (solutions != null) {
            for (Solution solution : solutions) {
                map.put(solution.getId(), solution.getLeetcodeQuestionId());
            }
        }
        return map;
    }

    private LocalDate[] getDateRangeByDimension(String dimension) {
        LocalDate today = LocalDate.now();
        LocalDate start;

        switch (dimension) {
            case "day":
                start = today;
                break;
            case "week":
                start = today.minusDays(6);
                break;
            case "month":
                start = today.minusDays(29);
                break;
            case "year":
                start = today.minusDays(364);
                break;
            default:
                start = today;
        }

        return new LocalDate[]{start, today};
    }

    private long getViewsFromDB(LocalDate start, LocalDate end) {
        Long total = viewStatsTotalMapper.sumTotalViews(start, end);
        return total != null ? total : 0;
    }

    private long getTotalViews() {
        // 从 Solution 表获取总浏览量
        List<Solution> solutions = solutionMapper.selectList(null);
        long total = 0;
        if (solutions != null) {
            for (Solution solution : solutions) {
                total += solution.getViewCount() != null ? solution.getViewCount() : 0;
            }
        }
        return total;
    }

    private String calculateTrend(LocalDate prevStart, LocalDate prevEnd) {
        long prevViews = getViewsFromDB(prevStart, prevEnd);
        LocalDate today = LocalDate.now();
        long currentViews = getViewsFromDB(prevEnd, today);

        if (prevViews == 0) {
            return "+0%";
        }
        double change = ((double) (currentViews - prevViews) / prevViews) * 100;
        String sign = change >= 0 ? "+" : "";
        return sign + String.format("%.1f%%", change);
    }
}
