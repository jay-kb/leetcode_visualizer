package com.leetcode.visualizer.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.leetcode.visualizer.entity.Solution;

import java.util.List;

public interface SolutionService extends IService<Solution> {

    /**
     * 分页查询题解列表
     * @param questionId LeetCode题目ID（可选）
     */
    IPage<Solution> getSolutionPage(Page<Solution> page, Long tagId, Integer difficulty, Integer status, String questionId);

    /**
     * 获取题解详情
     */
    Solution getSolutionById(Long id);

    /**
     * 新增题解
     */
    boolean addSolution(Solution solution, List<Long> tagIds);

    /**
     * 更新题解
     */
    boolean updateSolution(Solution solution, List<Long> tagIds);

    /**
     * 删除题解
     */
    boolean deleteSolution(Long id);

    /**
     * 增加浏览次数
     */
    void incrementViewCount(Long id);

    /**
     * 增加浏览次数（带 Cookie 标识，防止重复累加）
     * @param id 题解ID
     * @param cookieValue Cookie 标识
     */
    void incrementViewCount(Long id, String cookieValue);

    /**
     * 增加点赞次数
     */
    void incrementLikeCount(Long id);

    /**
     * 获取热门题解
     * @param limit 返回数量
     * @return 热门题解列表
     */
    List<Solution> getHotSolutions(Integer limit);

    /**
     * 获取今日新增题解
     * @param limit 返回数量
     * @return 今日新增题解列表
     */
    List<Solution> getTodayNewSolutions(Integer limit);

    /**
     * 获取最大题号（用于搜索校验）
     * @return 最大题号，缓存未命中返回 null
     */
    Integer getMaxQuestionId();
}
