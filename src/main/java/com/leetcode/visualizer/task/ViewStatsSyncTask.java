package com.leetcode.visualizer.task;

import com.leetcode.visualizer.entity.ViewStats;
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
     * 同步题解浏览量 - 使用 Redis KEYS 模式匹配获取有数据的题解
     */
    private void syncSolutionViewStats(String date) {
        // 使用 Redis 模式匹配获取当天有浏览量的题解 ID，避免全表查询
        String pattern = VIEW_STATS_SOLUTION_KEY + "*:" + date;
        Set<String> keys = redisTemplate.keys(pattern);
        if (keys == null || keys.isEmpty()) {
            return;
        }

        List<ViewStats> statsList = new ArrayList<>();
        for (String keyStr : keys) {
            // 从 key 中提取 solutionId: view:stats:solution:{id}:{date}
            String idPart = keyStr.substring(VIEW_STATS_SOLUTION_KEY.length(), keyStr.lastIndexOf(":" + date));
            Long solutionId = Long.parseLong(idPart);

            Object value = redisTemplate.opsForValue().get(keyStr);
            if (value != null) {
                long viewCount = parseLong(value);
                if (viewCount > 0) {
                    ViewStats stats = new ViewStats();
                    stats.setSolutionId(solutionId);
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
     * 将 Object 转换为 long 值
     */
    private long parseLong(Object value) {
        if (value instanceof Number) {
            return ((Number) value).longValue();
        }
        return Long.parseLong(value.toString());
    }

    /**
     * 同步全站浏览量
     */
    private void syncTotalViewStats(String date) {
        String key = VIEW_STATS_TOTAL_KEY + date;
        Object value = redisTemplate.opsForValue().get(key);
        if (value != null) {
            long totalViews = parseLong(value);

            if (totalViews > 0) {
                // 查询是否已存在
                com.leetcode.visualizer.entity.ViewStatsTotal existing =
                        viewStatsTotalMapper.selectByDate(LocalDate.parse(date));

                if (existing != null) {
                    // 直接覆盖当天数据，而不是累加（Redis 中是当天累计值）
                    existing.setTotalViews(totalViews);
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
