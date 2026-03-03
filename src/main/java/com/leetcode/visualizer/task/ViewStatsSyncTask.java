package com.leetcode.visualizer.task;

import com.leetcode.visualizer.entity.Solution;
import com.leetcode.visualizer.entity.ViewStats;
import com.leetcode.visualizer.mapper.SolutionMapper;
import com.leetcode.visualizer.mapper.ViewStatsMapper;
import com.leetcode.visualizer.mapper.ViewStatsTotalMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@Slf4j
public class ViewStatsSyncTask {

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Autowired
    private ViewStatsMapper viewStatsMapper;

    @Autowired
    private ViewStatsTotalMapper viewStatsTotalMapper;

    @Autowired
    private SolutionMapper solutionMapper;

    private static final String VIEW_STATS_SOLUTION_KEY = "view:stats:solution:";
    private static final String VIEW_STATS_TOTAL_KEY = "view:stats:total:";

    /**
     * 每5分钟执行一次同步任务
     */
    @Scheduled(cron = "0 */5 * * * ?")
    @Transactional(rollbackFor = Exception.class)
    public void syncViewStats() {
        log.info("开始同步浏览量统计数据...");
        try {
            String today = LocalDate.now().toString();

            // 1. 同步题解浏览量
            syncSolutionViewStats(today);

            // 2. 同步全站浏览量
            syncTotalViewStats(today);

            log.info("浏览量统计数据同步完成");
        } catch (Exception e) {
            log.error("浏览量统计数据同步失败", e);
        }
    }

    /**
     * 同步题解浏览量
     */
    private void syncSolutionViewStats(String date) {
        // 查询所有题解
        List<Solution> solutions = solutionMapper.selectList(null);
        if (solutions == null || solutions.isEmpty()) {
            return;
        }

        List<ViewStats> statsList = new ArrayList<>();
        for (Solution solution : solutions) {
            String key = VIEW_STATS_SOLUTION_KEY + solution.getId() + ":" + date;
            Object value = redisTemplate.opsForValue().get(key);
            if (value != null) {
                long viewCount = 0;
                if (value instanceof Number) {
                    viewCount = ((Number) value).longValue();
                } else {
                    viewCount = Long.parseLong(value.toString());
                }

                if (viewCount > 0) {
                    ViewStats stats = new ViewStats();
                    stats.setSolutionId(solution.getId());
                    stats.setStatDate(LocalDate.parse(date));
                    stats.setViewCount(viewCount);
                    statsList.add(stats);
                }
            }
        }

        if (!statsList.isEmpty()) {
            viewStatsMapper.batchInsertOrUpdate(statsList);
            log.info("同步了 {} 条题解浏览量数据", statsList.size());
        }
    }

    /**
     * 同步全站浏览量
     */
    private void syncTotalViewStats(String date) {
        String key = VIEW_STATS_TOTAL_KEY + date;
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            long totalViews = 0;
            if (value instanceof Number) {
                totalViews = ((Number) value).longValue();
            } else {
                totalViews = Long.parseLong(value.toString());
            }

            if (totalViews > 0) {
                // 查询是否已存在
                com.leetcode.visualizer.entity.ViewStatsTotal existing =
                        viewStatsTotalMapper.selectByDate(LocalDate.parse(date));

                if (existing != null) {
                    existing.setTotalViews(existing.getTotalViews() + totalViews);
                    viewStatsTotalMapper.updateById(existing);
                } else {
                    com.leetcode.visualizer.entity.ViewStatsTotal total = new com.leetcode.visualizer.entity.ViewStatsTotal();
                    total.setStatDate(LocalDate.parse(date));
                    total.setTotalViews(totalViews);
                    total.setUniqueVisitors(0L);
                    viewStatsTotalMapper.insert(total);
                }
            }
        }
    }
}
