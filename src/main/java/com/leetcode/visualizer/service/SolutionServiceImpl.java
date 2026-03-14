package com.leetcode.visualizer.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leetcode.visualizer.entity.Solution;
import com.leetcode.visualizer.entity.SolutionTagRel;
import com.leetcode.visualizer.entity.Tag;
import com.leetcode.visualizer.mapper.SolutionMapper;
import com.leetcode.visualizer.mapper.SolutionTagRelMapper;
import com.leetcode.visualizer.mapper.TagMapper;
import com.leetcode.visualizer.mapper.ViewStatsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
public class SolutionServiceImpl extends ServiceImpl<SolutionMapper, Solution> implements SolutionService {

    @Autowired
    private SolutionTagRelMapper solutionTagRelMapper;

    @Autowired
    private TagMapper tagMapper;

    @Autowired
    private ViewStatsMapper viewStatsMapper;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    private static final String HOT_SOLUTIONS_CACHE_KEY = "hot:solutions:list";
    private static final String TODAY_SOLUTIONS_CACHE_KEY = "solutions:today:list";
    private static final String SEARCH_QUESTION_ID_CACHE_KEY = "solutions:search:qid:";
    private static final String MAX_QUESTION_ID_CACHE_KEY = "solutions:max:qid";
    private static final String SOLUTIONS_PAGE_CACHE_KEY = "solutions:page:";
    private static final String SOLUTION_DETAIL_CACHE_KEY = "solution:detail:";
    // 浏览量统计 Redis Key
    private static final String VIEW_STATS_SOLUTION_KEY = "view:stats:solution:";
    private static final String VIEW_STATS_TOTAL_KEY = "view:stats:total:";
    private static final long HOT_CACHE_EXPIRE_MINUTES = 30;
    private static final long TODAY_CACHE_EXPIRE_HOURS = 1;
    private static final long SEARCH_CACHE_EXPIRE_MINUTES = 5;
    private static final long MAX_QUESTION_ID_CACHE_HOURS = 24;
    private static final long PAGE_FIRST_CACHE_EXPIRE_MINUTES = 5;
    private static final long PAGE_OTHER_CACHE_EXPIRE_MINUTES = 1;
    private static final int PAGE_OTHER_CACHE_MAX_PAGE = 5;
    private static final long SOLUTION_DETAIL_CACHE_MINUTES = 5;
    private static final long VIEW_STATS_CACHE_DAYS = 2;

    @Override
    public IPage<Solution> getSolutionPage(Page<Solution> page, Long tagId, Integer difficulty, Integer status, String questionId) {
        // 判断是否为纯题号搜索（无标签和难度筛选），用于缓存
        boolean isPureQuestionIdSearch = questionId != null && !questionId.trim().isEmpty()
                && tagId == null && difficulty == null;

        // 判断是否为纯分页查询（无任何筛选条件），用于缓存第1页
        boolean isPurePageQuery = (questionId == null || questionId.trim().isEmpty())
                && tagId == null && difficulty == null;
        boolean isFirstPage = page.getCurrent() == 1;

        // 纯题号搜索时尝试从缓存获取（key不包含page和size）
        if (isPureQuestionIdSearch) {
            String cacheKey = SEARCH_QUESTION_ID_CACHE_KEY + questionId.trim();
            IPage<Solution> cached = (IPage<Solution>) redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return cached;
            }
        }

        // 纯分页查询时尝试从缓存获取（第1-5页）
        if (isPurePageQuery && page.getCurrent() <= PAGE_OTHER_CACHE_MAX_PAGE) {
            String cacheKey = SOLUTIONS_PAGE_CACHE_KEY + "page" + page.getCurrent() + ":size" + page.getSize();
            IPage<Solution> cached = (IPage<Solution>) redisTemplate.opsForValue().get(cacheKey);
            if (cached != null) {
                return cached;
            }
        }

        // 构建查询条件
        LambdaQueryWrapper<Solution> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Solution::getStatus, 1)  // 只查询已发布的
                .eq(Solution::getDeleted, 0)
                .orderByDesc(Solution::getViewCount)
                .orderByDesc(Solution::getCreateTime);

        // 题目ID搜索
        if (questionId != null && !questionId.trim().isEmpty()) {
            wrapper.eq(Solution::getLeetcodeQuestionId, Integer.parseInt(questionId.trim()));
        }

        if (difficulty != null) {
            wrapper.eq(Solution::getDifficulty, difficulty);
        }

        IPage<Solution> result = page(page, wrapper);

        // 如果指定了标签筛选
        if (tagId != null) {
            List<Long> solutionIds = solutionTagRelMapper.selectSolutionIdsByTagId(tagId);
            if (solutionIds.isEmpty()) {
                result.setRecords(new ArrayList<>());
                return result;
            }
            // 构建查询条件
            LambdaQueryWrapper<Solution> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.eq(Solution::getStatus, 1)  // 只查询已发布的
                    .orderByDesc(Solution::getViewCount)
                    .orderByDesc(Solution::getCreateTime);
            queryWrapper.in(Solution::getId, solutionIds);
            result = page(page, queryWrapper);

            // 过滤出包含指定标签的题解
            List<Solution> filteredRecords = new ArrayList<>();
            for (Solution solution : result.getRecords()) {
                if (solutionIds.contains(solution.getId())) {
                    filteredRecords.add(solution);
                }
            }
            result.setRecords(filteredRecords);
        }

        // 填充标签信息
        for (Solution solution : result.getRecords()) {
            List<Long> tagIds = solutionTagRelMapper.selectTagIdsBySolutionId(solution.getId());
            if (!tagIds.isEmpty()) {
                List<Tag> tags = tagMapper.selectBatchIds(tagIds);
                solution.setTags(tags);
            }
        }

        // 纯题号搜索时存入缓存（key不包含page和size）
        if (isPureQuestionIdSearch) {
            String cacheKey = SEARCH_QUESTION_ID_CACHE_KEY + questionId.trim();
            redisTemplate.opsForValue().set(cacheKey, result, SEARCH_CACHE_EXPIRE_MINUTES, TimeUnit.MINUTES);
        }

        // 纯分页查询时存入缓存（第1-5页）
        if (isPurePageQuery && page.getCurrent() <= PAGE_OTHER_CACHE_MAX_PAGE) {
            String cacheKey = SOLUTIONS_PAGE_CACHE_KEY + "page" + page.getCurrent() + ":size" + page.getSize();
            long expireMinutes = isFirstPage ? PAGE_FIRST_CACHE_EXPIRE_MINUTES : PAGE_OTHER_CACHE_EXPIRE_MINUTES;
            redisTemplate.opsForValue().set(cacheKey, result, expireMinutes, TimeUnit.MINUTES);
        }

        return result;
    }

    @Override
    public Solution getSolutionById(Long id) {
        // 尝试从缓存获取
        String cacheKey = SOLUTION_DETAIL_CACHE_KEY + id;
        Solution cached = (Solution) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }

        // 从数据库查询
        Solution solution = getById(id);
        if (solution != null) {
            // 填充标签信息
            List<Long> tagIds = solutionTagRelMapper.selectTagIdsBySolutionId(id);
            if (!tagIds.isEmpty()) {
                List<Tag> tags = tagMapper.selectBatchIds(tagIds);
                solution.setTags(tags);
            }
            // 存入缓存
            redisTemplate.opsForValue().set(cacheKey, solution, SOLUTION_DETAIL_CACHE_MINUTES, TimeUnit.MINUTES);
        }
        return solution;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addSolution(Solution solution, List<Long> tagIds) {
        boolean result = save(solution);
        if (result && tagIds != null && !tagIds.isEmpty()) {
            // 保存标签关联
            for (Long tagId : tagIds) {
                SolutionTagRel rel = new SolutionTagRel();
                rel.setSolutionId(solution.getId());
                rel.setTagId(tagId);
                solutionTagRelMapper.insert(rel);
            }
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateSolution(Solution solution, List<Long> tagIds) {
        boolean result = updateById(solution);
        if (result && tagIds != null) {
            // 先删除旧的关联
            solutionTagRelMapper.deleteBySolutionId(solution.getId());
            // 添加新的关联
            for (Long tagId : tagIds) {
                SolutionTagRel rel = new SolutionTagRel();
                rel.setSolutionId(solution.getId());
                rel.setTagId(tagId);
                solutionTagRelMapper.insert(rel);
            }
        }
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteSolution(Long id) {
        // 先删除关联
        solutionTagRelMapper.deleteBySolutionId(id);
        return removeById(id);
    }

    @Override
    public void incrementViewCount(Long id) {
        Solution solution = getById(id);
        if (solution != null) {
            solution.setViewCount(solution.getViewCount() + 1);
            updateById(solution);
        }
    }

    @Override
    public void incrementViewCount(Long id, String cookieValue) {
        // 记录浏览量统计到 Redis
        recordViewStats(id);
        // 浏览量防重复缓存 Key
        String viewCacheKey = "view:solution:" + id + ":cookie:" + cookieValue;
        // 检查是否已经浏览过
        Boolean hasViewed = redisTemplate.hasKey(viewCacheKey);
        if (Boolean.TRUE.equals(hasViewed)) {
            // 已浏览过，不累加
            return;
        }
        // 累加浏览量
        Solution solution = getById(id);
        if (solution != null) {
            solution.setViewCount(solution.getViewCount() + 1);
            updateById(solution);
        }
        // 设置缓存，10分钟内不重复累加
        redisTemplate.opsForValue().set(viewCacheKey, "1", 10, TimeUnit.MINUTES);

    }

    /**
     * 记录浏览量统计到 Redis
     */
    private void recordViewStats(Long solutionId) {
        String today = java.time.LocalDate.now().toString();

        // 1. 记录题解今日浏览量
        String solutionKey = VIEW_STATS_SOLUTION_KEY + solutionId + ":" + today;
        redisTemplate.opsForValue().increment(solutionKey);

        // 2. 记录全站今日浏览量
        String totalKey = VIEW_STATS_TOTAL_KEY + today;
        redisTemplate.opsForValue().increment(totalKey);

        // 设置过期时间（2天）
        redisTemplate.expire(solutionKey, VIEW_STATS_CACHE_DAYS, TimeUnit.DAYS);
        redisTemplate.expire(totalKey, VIEW_STATS_CACHE_DAYS, TimeUnit.DAYS);
    }

    @Override
    public void incrementLikeCount(Long id) {
        Solution solution = getById(id);
        if (solution != null) {
            solution.setLikeCount(solution.getLikeCount() + 1);
            updateById(solution);
        }
    }

    @Override
    public List<Solution> getHotSolutions(Integer limit) {
        String cacheKey = HOT_SOLUTIONS_CACHE_KEY + ":" + limit;
        // 尝试从缓存获取
        List<Solution> cached = (List<Solution>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        // 从数据库查询
        LambdaQueryWrapper<Solution> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Solution::getStatus, 1)  // 只查询已发布的
                .orderByDesc(Solution::getViewCount)
                .last("LIMIT " + limit);
        List<Solution> hotSolutions = list(wrapper);
        // 存入缓存
        redisTemplate.opsForValue().set(cacheKey, hotSolutions, HOT_CACHE_EXPIRE_MINUTES, TimeUnit.MINUTES);
        return hotSolutions;
    }

    @Override
    public List<Solution> getTodayNewSolutions(Integer limit) {
        String cacheKey = TODAY_SOLUTIONS_CACHE_KEY + ":" + limit;
        // 尝试从缓存获取
        List<Solution> cached = (List<Solution>) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }
        // 从数据库查询：24小时内的已发布题解
        LocalDateTime yesterday = LocalDateTime.now().minusHours(24);
        LambdaQueryWrapper<Solution> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Solution::getStatus, 1)  // 只查询已发布的
                .ge(Solution::getCreateTime, yesterday)  // 创建时间在24小时内
                .orderByDesc(Solution::getCreateTime)  // 最新在前
                .last("LIMIT " + limit);
        List<Solution> todaySolutions = list(wrapper);
        // 存入缓存
        redisTemplate.opsForValue().set(cacheKey, todaySolutions, TODAY_CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
        return todaySolutions;
    }

    @Override
    public Integer getMaxQuestionId() {
        // 尝试从缓存获取
        Integer cached = (Integer) redisTemplate.opsForValue().get(MAX_QUESTION_ID_CACHE_KEY);
        if (cached != null) {
            return cached;
        }
        // 从数据库查询最大题号
        LambdaQueryWrapper<Solution> wrapper = new LambdaQueryWrapper<>();
        wrapper.isNotNull(Solution::getLeetcodeQuestionId)
                .orderByDesc(Solution::getLeetcodeQuestionId)
                .last("LIMIT 1");
        Solution solution = getOne(wrapper);
        if (solution != null && solution.getLeetcodeQuestionId() != null) {
            cached = solution.getLeetcodeQuestionId();
            // 存入缓存，24小时过期
            redisTemplate.opsForValue().set(MAX_QUESTION_ID_CACHE_KEY, cached, MAX_QUESTION_ID_CACHE_HOURS, TimeUnit.HOURS);
            return cached;
        }
        return null;
    }
}
