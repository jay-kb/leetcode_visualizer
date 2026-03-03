package com.leetcode.visualizer.controller;

import com.leetcode.visualizer.common.Result;
import com.leetcode.visualizer.entity.Tag;
import com.leetcode.visualizer.service.TagService;
import com.leetcode.visualizer.vo.TagRequest;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    /**
     * 获取所有标签
     */
    @GetMapping
    public Result<List<Tag>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return Result.success(tags);
    }

    /**
     * 新增标签
     */
    @PostMapping
    public Result<Tag> addTag(@RequestBody TagRequest request) {
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
     * 删除标签
     */
    @DeleteMapping("/{id}")
    public Result<?> deleteTag(@PathVariable Long id) {
        boolean success = tagService.deleteTag(id);
        if (success) {
            return Result.success();
        }
        return Result.error("删除失败");
    }
}
