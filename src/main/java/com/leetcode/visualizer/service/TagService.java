package com.leetcode.visualizer.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.leetcode.visualizer.entity.Tag;
import com.leetcode.visualizer.vo.TagVO;

import java.util.List;

public interface TagService extends IService<Tag> {

    /**
     * 获取所有标签
     */
    List<Tag> getAllTags();

    /**
     * 分页获取标签列表（包含题解数量）
     */
    IPage<TagVO> getTagPage(Page<TagVO> page, String keyword);

    /**
     * 新增标签
     */
    boolean addTag(Tag tag);

    /**
     * 更新标签
     */
    boolean updateTag(Tag tag);

    /**
     * 删除标签
     */
    boolean deleteTag(Long id);
}
