package com.leetcode.visualizer.controller.admin;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.leetcode.visualizer.common.Result;
import com.leetcode.visualizer.entity.Tag;
import com.leetcode.visualizer.service.TagService;
import com.leetcode.visualizer.vo.TagVO;
import com.leetcode.visualizer.vo.TagRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/tags")
public class AdminTagController {

    @Autowired
    private TagService tagService;

    /**
     * 获取标签列表（分页、搜索）
     */
    @GetMapping
    public Result<IPage<TagVO>> getTags(
            @RequestParam(defaultValue = "-1") Long page,
            @RequestParam(defaultValue = "-1") Long size,
            @RequestParam(required = false) String keyword) {
        log.info("获取标签列表: page={}, size={}, keyword={}", page, size, keyword);
        Page<TagVO> pageParam = new Page<>(page, size);
        IPage<TagVO> result = tagService.getTagPage(pageParam, keyword);
        return Result.success(result);
    }

    /**
     * 获取标签详情
     */
    @GetMapping("/{id}")
    public Result<Tag> getTagById(@PathVariable Long id) {
        Tag tag = tagService.getById(id);
        if (tag == null) {
            return Result.error("标签不存在");
        }
        return Result.success(tag);
    }

    /**
     * 新增标签
     */
    @PostMapping
    public Result<Tag> addTag(@RequestBody TagRequest request) {
        log.info("新增标签: {}", request);
        Tag tag = new Tag();
        BeanUtils.copyProperties(request, tag);
        try {
            boolean success = tagService.addTag(tag);
            if (success) {
                return Result.success(tag);
            }
            return Result.error("新增失败");
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 更新标签
     */
    @PutMapping("/{id}")
    public Result<Tag> updateTag(@PathVariable Long id, @RequestBody TagRequest request) {
        log.info("更新标签: id={}, {}", id, request);
        Tag tag = tagService.getById(id);
        if (tag == null) {
            return Result.error("标签不存在");
        }
        BeanUtils.copyProperties(request, tag);
        try {
            boolean success = tagService.updateTag(tag);
            if (success) {
                return Result.success(tag);
            }
            return Result.error("更新失败");
        } catch (RuntimeException e) {
            return Result.error(e.getMessage());
        }
    }

    /**
     * 删除标签
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteTag(@PathVariable Long id) {
        log.info("删除标签: id={}", id);
        boolean success = tagService.deleteTag(id);
        if (success) {
            return Result.success();
        }
        return Result.error("删除失败");
    }
}
