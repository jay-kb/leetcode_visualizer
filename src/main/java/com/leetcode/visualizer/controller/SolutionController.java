package com.leetcode.visualizer.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leetcode.visualizer.common.Result;
import com.leetcode.visualizer.entity.Solution;
import com.leetcode.visualizer.service.SolutionService;
import com.leetcode.visualizer.vo.PageResult;
import com.leetcode.visualizer.vo.SolutionRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/solutions")
public class SolutionController {

    @Autowired
    private SolutionService solutionService;

    /**
     * 分页获取题解列表
     */
    @GetMapping
    public Result<PageResult<Solution>> getSolutions(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) Long tagId,
            @RequestParam(required = false) Integer difficulty,
            @RequestParam(required = false) String questionId) {
        // 校验 questionId 参数
        if (questionId != null && !questionId.trim().isEmpty()) {
            String trimmedQuestionId = questionId.trim();
            // 判断是否为数字
            if (!trimmedQuestionId.matches("\\d+")) {
                return Result.error("题号必须是数字");
            }
            // 获取最大题号（从缓存或默认值）
            Integer maxQuestionId = solutionService.getMaxQuestionId();
            int maxId = maxQuestionId != null ? maxQuestionId : 10000;
            // 判断范围
            int qid = Integer.parseInt(trimmedQuestionId);
            if (qid < 1 || qid > maxId) {
                return Result.error("题号范围必须是 1-" + maxId);
            }
        }

        Page<Solution> pageParam = new Page<>(page, size);
        IPage<Solution> result = solutionService.getSolutionPage(pageParam, tagId, difficulty, 1, questionId);

        PageResult<Solution> pageResult = new PageResult<>(
                result.getTotal(),
                result.getRecords(),
                result.getCurrent(),
                result.getSize()
        );

        return Result.success(pageResult);
    }

    /**
     * 获取热门题解列表
     * @param limit 返回数量，默认10，最大20
     */
    @GetMapping("/hot")
    public Result<List<Solution>> getHotSolutions(@RequestParam(defaultValue = "10") Integer limit) {
        // 限制最大返回数
        limit = Math.min(limit, 20);
        List<Solution> hotSolutions = solutionService.getHotSolutions(limit);
        return Result.success(hotSolutions);
    }

    /**
     * 获取今日新增题解列表
     * @param limit 返回数量，默认10，最大20
     */
    @GetMapping("/today")
    public Result<List<Solution>> getTodayNewSolutions(@RequestParam(defaultValue = "10") Integer limit) {
        // 限制最大返回数
        limit = Math.min(limit, 20);
        List<Solution> todaySolutions = solutionService.getTodayNewSolutions(limit);
        return Result.success(todaySolutions);
    }

    /**
     * 获取单个题解详情
     */
    @GetMapping("/{id}")
    public Result<Solution> getSolutionById(@PathVariable Long id, HttpServletRequest request, HttpServletResponse response) {
        Solution solution = solutionService.getSolutionById(id);
        if (solution == null) {
            return Result.error("题解不存在");
        }
        // 获取或创建 Cookie 标识
        String cookieName = "view_token";
        String cookieValue = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookieName.equals(cookie.getName())) {
                    cookieValue = cookie.getValue();
                    break;
                }
            }
        }
        // 如无 Cookie，创建新的
        if (cookieValue == null) {
            cookieValue = UUID.randomUUID().toString().replace("-", "");
            Cookie cookie = new Cookie(cookieName, cookieValue);
            cookie.setPath("/");
            cookie.setMaxAge(30 * 24 * 60 * 60); // 30 天
            response.addCookie(cookie);
        }
        // 增加浏览次数（带 Cookie 标识，防止重复累加并记录统计）
        solutionService.incrementViewCount(id, cookieValue);
        return Result.success(solution);
    }

    /**
     * 新增题解
     */
    @PostMapping
    public Result<?> addSolution(@RequestBody SolutionRequest request) {
        Solution solution = new Solution();
        BeanUtils.copyProperties(request, solution);
        solution.setCreatedBy("admin");
        solution.setViewCount(0L);
        solution.setLikeCount(0L);

        boolean success = solutionService.addSolution(solution, request.getTagIds());
        if (success) {
            return Result.success(solution);
        }
        return Result.error("新增失败");
    }

    /**
     * 更新题解
     */
    @PutMapping("/{id}")
    public Result<?> updateSolution(@PathVariable Long id, @RequestBody SolutionRequest request) {
        Solution solution = solutionService.getById(id);
        if (solution == null) {
            return Result.error("题解不存在");
        }

        BeanUtils.copyProperties(request, solution);
        boolean success = solutionService.updateSolution(solution, request.getTagIds());
        if (success) {
            return Result.success(solution);
        }
        return Result.error("更新失败");
    }

    /**
     * 删除题解
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteSolution(@PathVariable Long id) {
        boolean success = solutionService.deleteSolution(id);
        if (success) {
            return Result.success();
        }
        return Result.error("删除失败");
    }

    /**
     * 获取所有题解 ID 列表（用于生成 sitemap）
     */
    @GetMapping("/ids")
    public Result<List<Long>> getAllSolutionIds() {
        List<Long> ids = solutionService.getAllSolutionIds();
        return Result.success(ids);
    }
}
