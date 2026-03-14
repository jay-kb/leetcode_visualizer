-- 新增字段：考察点、解题思路、相关链接
-- 执行时间：请在上线前执行

ALTER TABLE solution
ADD COLUMN points VARCHAR(500) COMMENT '考察的问题点，逗号分隔' AFTER description,
ADD COLUMN solution_thoughts TEXT COMMENT '解题思路（Markdown）' AFTER points,
ADD COLUMN reference_links JSON COMMENT '相关链接 [{"title":"","url":"","type":""}]' AFTER solution_thoughts;
