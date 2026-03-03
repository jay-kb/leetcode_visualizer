package com.leetcode.visualizer.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.leetcode.visualizer.entity.Tag;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface TagMapper extends BaseMapper<Tag> {
}
