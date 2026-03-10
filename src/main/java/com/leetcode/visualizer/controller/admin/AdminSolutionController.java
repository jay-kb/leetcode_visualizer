package com.leetcode.visualizer.controller.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leetcode.visualizer.common.Result;
import com.leetcode.visualizer.entity.Solution;
import com.leetcode.visualizer.entity.SolutionTagRel;
import com.leetcode.visualizer.entity.Tag;
import com.leetcode.visualizer.mapper.SolutionMapper;
import com.leetcode.visualizer.mapper.SolutionTagRelMapper;
import com.leetcode.visualizer.mapper.TagMapper;
import com.leetcode.visualizer.service.SolutionService;
import com.leetcode.visualizer.vo.PageResult;
import com.leetcode.visualizer.vo.SolutionRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/admin/solutions")
public class AdminSolutionController {

    @Autowired
    private SolutionService solutionService;

    @Autowired
    private SolutionTagRelMapper solutionTagRelMapper;

    @Autowired
    private TagMapper tagMapper;

    /**
     * 获取题解列表（分页、搜索）
     */
    @GetMapping
    public Result<PageResult<Solution>> getSolutions(
            @RequestParam(defaultValue = "1") Long page,
            @RequestParam(defaultValue = "10") Long size,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer difficulty,
            @RequestParam(required = false) Integer status,
            @RequestParam(required = false) Integer questionId) {
        log.info("获取题解列表: page={}, size={}, keyword={}, difficulty={}, status={}, questionId={}",
                page, size, keyword, difficulty, status, questionId);

        Page<Solution> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Solution> wrapper = new LambdaQueryWrapper<>();

        if (keyword != null && !keyword.isEmpty()) {
            wrapper.and(w -> w.like(Solution::getTitle, keyword)
                    .or().like(Solution::getDescription, keyword));
        }
        if (difficulty != null) {
            wrapper.eq(Solution::getDifficulty, difficulty);
        }
        if (status != null) {
            wrapper.eq(Solution::getStatus, status);
        }
        if (questionId != null) {
            wrapper.eq(Solution::getLeetcodeQuestionId, questionId);
        }

        wrapper.orderByDesc(Solution::getCreateTime);

        IPage<Solution> result = solutionService.page(pageParam, wrapper);

        // 填充标签信息
        for (Solution solution : result.getRecords()) {
            List<Long> tagIds = solutionTagRelMapper.selectTagIdsBySolutionId(solution.getId());
            if (!tagIds.isEmpty()) {
                List<Tag> tags = tagMapper.selectBatchIds(tagIds);
                solution.setTags(tags);
            }
        }

        PageResult<Solution> pageResult = new PageResult<>(
                result.getTotal(),
                result.getRecords(),
                result.getCurrent(),
                result.getSize()
        );
        return Result.success(pageResult);
    }

    /**
     * 获取题解详情
     */
    @GetMapping("/{id}")
    public Result<Solution> getSolutionById(@PathVariable Long id) {
        log.info("获取题解详情: id={}", id);
        Solution solution = solutionService.getById(id);
        if (solution == null) {
            return Result.error("题解不存在");
        }
        // 填充标签信息
        List<Long> tagIds = solutionTagRelMapper.selectTagIdsBySolutionId(id);
        if (!tagIds.isEmpty()) {
            List<Tag> tags = tagMapper.selectBatchIds(tagIds);
            solution.setTags(tags);
        }
        return Result.success(solution);
    }

    /**
     * 新增题解
     */
    @PostMapping
    public Result<Solution> addSolution(@RequestBody SolutionRequest request) {
        log.info("新增题解: {}", request.getTitle());
        Solution solution = new Solution();
        BeanUtils.copyProperties(request, solution);
        solution.setCreatedBy("admin");
        if (solution.getViewCount() == null) {
            solution.setViewCount(0L);
        }
        if (solution.getLikeCount() == null) {
            solution.setLikeCount(0L);
        }
        if (solution.getStatus() == null) {
            solution.setStatus(1);
        }

        try {
            boolean success = solutionService.addSolution(solution, request.getTagIds());
            if (success) {
                return Result.success(solution);
            }
            return Result.error("新增失败");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新题解
     */
    @PutMapping("/{id}")
    public Result<Solution> updateSolution(@PathVariable Long id, @RequestBody SolutionRequest request) {
        log.info("更新题解: id={}, title={}", id, request.getTitle());
        Solution solution = solutionService.getById(id);
        if (solution == null) {
            return Result.error("题解不存在");
        }

        BeanUtils.copyProperties(request, solution);
        try {
            boolean success = solutionService.updateSolution(solution, request.getTagIds());
            if (success) {
                return Result.success(solution);
            }
            return Result.error("更新失败");
        } catch (Exception e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 删除题解
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteSolution(@PathVariable Long id) {
        log.info("删除题解: id={}", id);
        boolean success = solutionService.deleteSolution(id);
        if (success) {
            return Result.success();
        }
        return Result.error("删除失败");
    }
}
