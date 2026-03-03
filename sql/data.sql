-- 初始化测试数据
USE leetcode_visualizer;

-- 插入标签数据（参考 LeetCode 常用标签）
INSERT INTO `tag` (`name`, `color`) VALUES
('数组', '#87d068'),
('字符串', '#1890ff'),
('哈希表', '#722ed1'),
('动态规划', '#eb2f96'),
('数学', '#faad14'),
('排序', '#13c2c2'),
('贪心', '#f5222d'),
('深度优先搜索', '#2f54eb'),
('二叉树', '#52c41a'),
('广度优先搜索', '#fa8c16'),
('双指针', '#a0d911'),
('栈', '#eb6f76'),
('堆', '#722ed1'),
('回溯', '#13c2c2'),
('链表', '#1890ff'),
('二分查找', '#faad14'),
('树', '#52c41a'),
('矩阵', '#2f54eb'),
('滑动窗口', '#f5222d'),
('设计', '#a0d911');

-- 插入题解数据（示例）
INSERT INTO `solution` (`title`, `description`, `leetcode_question_id`, `difficulty`, `html_file_url`, `cover_image_url`, `view_count`, `like_count`, `status`, `created_by`) VALUES
('两数之和', '暴力解法和哈希表解法可视化演示', '1', 1, '/solutions/two-sum.html', NULL, 1520, 89, 1, 'admin'),
('两数相加', '链表逆序相加可视化演示', '2', 2, '/solutions/add-two-numbers.html', NULL, 980, 56, 1, 'admin'),
('无重复字符的最长子串', '滑动窗口解法可视化', '3', 2, '/solutions/longest-substring.html', NULL, 1340, 78, 1, 'admin'),
('寻找两个正序数组的中位数', '二分查找解法可视化', '4', 3, '/solutions/median-sorted-arrays.html', NULL, 756, 45, 1, 'admin'),
('最长回文子串', '动态规划与中心扩展法可视化', '5', 2, '/solutions/longest-palindromic.html', NULL, 1120, 67, 1, 'admin'),
('Z 字形变换', '按行访问解法可视化', '6', 2, '/solutions/zigzag-conversion.html', NULL, 650, 38, 1, 'admin'),
('整数反转', '数学解法可视化', '7', 1, '/solutions/reverse-integer.html', NULL, 890, 52, 1, 'admin'),
('回文数', '数学解法可视化', '9', 1, '/solutions/palindrome-number.html', NULL, 720, 41, 1, 'admin'),
('正则表达式匹配', '动态规划解法可视化', '10', 3, '/solutions/regular-expression.html', NULL, 540, 32, 1, 'admin'),
('盛最多水的容器', '双指针解法可视化', '11', 2, '/solutions/container-water.html', NULL, 1180, 71, 1, 'admin'),
('三数之和', '双指针+排序解法可视化', '15', 2, '/solutions/3sum.html', NULL, 1650, 95, 1, 'admin'),
('最接近的三数指针解之和', '双法可视化', '16', 2, '/solutions/3sum-closest.html', NULL, 680, 39, 1, 'admin'),
('电话号码的字母组合', '回溯解法可视化', '17', 2, '/solutions/letter-combinations.html', NULL, 820, 48, 1, 'admin'),
('删除链表的倒数第 N 个结点', '双指针解法可视化', '19', 2, '/solutions/remove-nth-node.html', NULL, 950, 58, 1, 'admin'),
('有效的括号', '栈解法可视化', '20', 1, '/solutions/valid-parentheses.html', NULL, 1380, 82, 1, 'admin'),
('合并两个有序链表', '迭代与递归解法可视化', '21', 1, '/solutions/merge-two-lists.html', NULL, 1100, 65, 1, 'admin'),
('括号生成', '回溯解法可视化', '22', 2, '/solutions/generate-parentheses.html', NULL, 920, 55, 1, 'admin'),
('合并K个升序链表', '堆与分治解法可视化', '23', 3, '/solutions/merge-k-lists.html', NULL, 480, 28, 1, 'admin'),
('删除有序数组中的重复项', '双指针解法可视化', '26', 1, '/solutions/remove-duplicates.html', NULL, 1050, 63, 1, 'admin'),
('搜索旋转排序数组', '二分查找解法可视化', '33', 2, '/solutions/search-rotated-array.html', NULL, 870, 51, 1, 'admin');

-- 插入题解-标签关联数据
-- 两数之和 (solution_id=1): 数组, 哈希表
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (1, 1), (1, 3);

-- 两数相加 (solution_id=2): 链表, 递归
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (2, 15);

-- 无重复字符的最长子串 (solution_id=3): 字符串, 滑动窗口, 双指针
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (3, 2), (3, 19), (3, 11);

-- 寻找两个正序数组的中位数 (solution_id=4): 二分查找, 数组
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (4, 16), (4, 1);

-- 最长回文子串 (solution_id=5): 动态规划, 字符串
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (5, 4), (5, 2);

-- Z 字形变换 (solution_id=6): 字符串
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (6, 2);

-- 整数反转 (solution_id=7): 数学
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (7, 5);

-- 回文数 (solution_id=8): 数学
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (8, 5);

-- 正则表达式匹配 (solution_id=9): 动态规划, 字符串, 回溯
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (9, 4), (9, 2), (9, 14);

-- 盛最多水的容器 (solution_id=10): 双指针, 数组
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (10, 11), (10, 1);

-- 三数之和 (solution_id=11): 数组, 排序, 双指针
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (11, 1), (11, 6), (11, 11);

-- 最接近的三数之和 (solution_id=12): 数组, 双指针
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (12, 1), (12, 11);

-- 电话号码的字母组合 (solution_id=13): 字符串, 回溯, 哈希表
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (13, 2), (13, 14), (13, 3);

-- 删除链表的倒数第 N 个结点 (solution_id=14): 链表, 双指针
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (14, 15), (14, 11);

-- 有效的括号 (solution_id=15): 栈, 字符串
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (15, 12), (15, 2);

-- 合并两个有序链表 (solution_id=16): 链表, 递归
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (16, 15);

-- 括号生成 (solution_id=17): 字符串, 回溯
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (17, 2), (17, 14);

-- 合并K个升序链表 (solution_id=18): 链表, 堆, 分治
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (18, 15), (18, 13);

-- 删除有序数组中的重复项 (solution_id=19): 数组, 双指针
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (19, 1), (19, 11);

-- 搜索旋转排序数组 (solution_id=20): 二分查找, 数组
INSERT INTO `solution_tag_rel` (`solution_id`, `tag_id`) VALUES (20, 16), (20, 1);
