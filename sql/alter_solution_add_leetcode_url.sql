-- LeetCode 链接功能 - 数据库变更脚本
-- 执行时间: 2026-03-01
-- 功能: 为 solution 表新增 leetcode_url 字段

USE leetcode_visualizer;

-- 新增 leetcode_url 字段
ALTER TABLE `solution`
ADD COLUMN `leetcode_url` VARCHAR(500) NULL COMMENT 'LeetCode题目链接，如 https://leetcode.com/problems/two-sum'
AFTER `leetcode_question_id`;

-- 验证字段是否添加成功
-- SELECT id, title, leetcode_question_id, leetcode_url FROM solution LIMIT 10;
