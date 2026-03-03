-- 将 solution 表的 leetcode_question_id 字段从 VARCHAR 改为 INT
-- 执行前请备份数据库

-- 1. 查看当前表结构
-- DESC solution;

-- 2. 修改字段类型（MySQL）
ALTER TABLE solution MODIFY COLUMN leetcode_question_id INT;

-- 3. 如果有索引需要重建（可选）
-- ALTER TABLE solution DROP INDEX idx_leetcode_question_id;
-- ALTER TABLE solution ADD INDEX idx_leetcode_question_id (leetcode_question_id);
