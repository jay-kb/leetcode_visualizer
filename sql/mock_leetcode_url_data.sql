-- LeetCode 链接测试数据
-- 为现有题解添加 leetcode_url 字段数据

USE leetcode_visualizer;

-- 先添加字段（如果还没有）
ALTER TABLE `solution`
ADD COLUMN IF NOT EXISTS `leetcode_url` VARCHAR(500) NULL COMMENT 'LeetCode题目链接'
AFTER `leetcode_question_id`;

-- 更新题解数据，添加 LeetCode 链接
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/two-sum' WHERE `leetcode_question_id` = '1';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/add-two-numbers' WHERE `leetcode_question_id` = '2';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/longest-substring-without-repeating-characters' WHERE `leetcode_question_id` = '3';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/median-of-two-sorted-arrays' WHERE `leetcode_question_id` = '4';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/longest-palindromic-substring' WHERE `leetcode_question_id` = '5';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/zigzag-conversion' WHERE `leetcode_question_id` = '6';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/reverse-integer' WHERE `leetcode_question_id` = '7';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/palindrome-number' WHERE `leetcode_question_id` = '9';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/regular-expression-matching' WHERE `leetcode_question_id` = '10';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/container-with-most-water' WHERE `leetcode_question_id` = '11';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/3sum' WHERE `leetcode_question_id` = '15';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/3sum-closest' WHERE `leetcode_question_id` = '16';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/letter-combinations-of-a-phone-number' WHERE `leetcode_question_id` = '17';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/remove-nth-node-from-end-of-list' WHERE `leetcode_question_id` = '19';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/valid-parentheses' WHERE `leetcode_question_id` = '20';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/merge-two-sorted-lists' WHERE `leetcode_question_id` = '21';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/generate-parentheses' WHERE `leetcode_question_id` = '22';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/merge-k-sorted-lists' WHERE `leetcode_question_id` = '23';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/remove-duplicates-from-sorted-array' WHERE `leetcode_question_id` = '26';
UPDATE `solution` SET `leetcode_url` = 'https://leetcode.com/problems/search-in-rotated-sorted-array' WHERE `leetcode_question_id` = '33';

-- 验证数据
SELECT id, title, leetcode_question_id, leetcode_url FROM solution LIMIT 10;
