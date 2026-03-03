package com.leetcode.visualizer.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.leetcode.visualizer.entity.Tag;
import com.leetcode.visualizer.mapper.SolutionTagRelMapper;
import com.leetcode.visualizer.mapper.TagMapper;
import com.leetcode.visualizer.vo.TagVO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements TagService {

    @Autowired
    private SolutionTagRelMapper solutionTagRelMapper;

    @Override
    public List<Tag> getAllTags() {
        return list(new LambdaQueryWrapper<Tag>()
                .orderByAsc(Tag::getName));
    }

    @Override
    public IPage<TagVO> getTagPage(Page<TagVO> page, String keyword) {
        LambdaQueryWrapper<Tag> wrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.isEmpty()) {
            wrapper.like(Tag::getName, keyword);
        }
        wrapper.orderByDesc(Tag::getCreateTime);

        IPage<Tag> tagPage = page(new Page<>(page.getCurrent(), page.getSize()), wrapper);

        // 转换为 VO 并查询题解数量
        List<TagVO> voList = new ArrayList<>();
        for (Tag tag : tagPage.getRecords()) {
            TagVO vo = new TagVO();
            vo.setId(tag.getId());
            vo.setName(tag.getName());
            vo.setColor(tag.getColor());
            vo.setCreateTime(tag.getCreateTime());
            // 查询题解数量
            List<Long> solutionIds = solutionTagRelMapper.selectSolutionIdsByTagId(tag.getId());
            vo.setSolutionCount((long) solutionIds.size());
            voList.add(vo);
        }

        Page<TagVO> result = new Page<>(tagPage.getCurrent(), tagPage.getSize(), tagPage.getTotal());
        result.setRecords(voList);
        return result;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean addTag(Tag tag) {
        // 检查名称是否已存在
        long count = count(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getName, tag.getName()));
        if (count > 0) {
            throw new RuntimeException("标签名称已存在");
        }
        return save(tag);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean updateTag(Tag tag) {
        // 检查名称是否已存在（排除自己）
        long count = count(new LambdaQueryWrapper<Tag>()
                .eq(Tag::getName, tag.getName())
                .ne(Tag::getId, tag.getId()));
        if (count > 0) {
            throw new RuntimeException("标签名称已存在");
        }
        return updateById(tag);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public boolean deleteTag(Long id) {
        return removeById(id);
    }
}
