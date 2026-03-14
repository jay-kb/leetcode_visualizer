-- 模拟数据：添加新字段的测试数据

-- 先查看现有数据
SELECT id, title FROM solution LIMIT 5;

-- 更新现有数据，添加考察点、解题思路、相关链接
UPDATE solution SET
    points = '哈希表, 数组遍历',
    solution_thoughts = '## 解题思路\n\n使用哈希表存储已遍历的元素和索引。\n\n1. 遍历数组\n2. 检查 target - nums[i] 是否在哈希表中\n3. 如果存在，返回索引\n4. 否则，将当前元素存入哈希表',
    reference_links = '[{"title":"代码随想录","url":"https://programmercarl.com/0001.%E4%B8%A4%E6%95%B0%E4%B9%8B%E5%92%8C.html","type":"article"},{"title":"官方题解","url":"https://leetcode.cn/problems/two-sum/solution/","type":"article"}]'
WHERE id = 1;

UPDATE solution SET
    points = '数组, 二分查找',
    solution_thoughts = '## 解题思路\n\n使用二分查找定位目标值。\n\n1. 对数组进行排序\n2. 使用双指针或二分查找\n3. 找到目标值后返回索引'
WHERE id = 2;

-- 插入更多测试数据
INSERT INTO solution (title, description, leetcodeQuestionId, leetcodeUrl, difficulty, htmlFileUrl, viewCount, likeCount, status, createdBy, points, solutionThoughts, referenceLinks, createTime, updateTime)
VALUES
(
    '反转链表',
    '给你单链表的头节点 head ，请你反转链表，并返回反转后的链表。',
    206,
    'https://leetcode.cn/problems/reverse-linked-list/',
    1,
    '/solutions/reverse-linked-list.html',
    0, 0, 1, 'admin',
    '链表, 双指针, 递归',
    '## 解题思路\n\n### 方法一：迭代\n使用双指针 prev 和 cur，逐个节点反转。\n\n### 方法二：递归\n递归反转链表。\n\n- 时间复杂度：O(n)\n- 空间复杂度：O(n)',
    '[{"title":"代码随想录","url":"https://programmercarl.com/0206.%E5%8F%8D%E8%BD%AC%E9%93%BE%E8%A1%A8.html","type":"article"}]',
    NOW(), NOW()
),
(
    '合并两个有序链表',
    '将两个升序链表合并为一个新的升序链表并返回。',
    21,
    'https://leetcode.cn/problems/merge-two-sorted-lists/',
    1,
    '/solutions/merge-two-sorted-lists.html',
    0, 0, 1, 'admin',
    '链表, 递归, 双指针',
    '## 解题思路\n\n1. 使用哑节点简化操作\n2. 比较两个链表的节点值\n3. 将较小的节点接到结果链表后面\n4. 时间复杂度：O(n+m)\n5. 空间复杂度：O(1)',
    '[{"title":"官方题解","url":"https://leetcode.cn/problems/merge-two-sorted-lists/solution/","type":"article"}]',
    NOW(), NOW()
),
(
    '删除排序数组中的重复项',
    '给定一个排序数组，你需要在原地删除重复出现的元素。',
    26,
    'https://leetcode.cn/problems/remove-duplicates-from-sorted-array/',
    1,
    '/solutions/remove-duplicates.html',
    0, 0, 1, 'admin',
    '数组, 双指针, 原地修改',
    '## 解题思路\n\n使用快慢指针：\n1. 慢指针指向不重复元素的最后位置\n2. 快指针遍历数组\n3. 当快指针指向的值与慢指针不同时，移动慢指针并更新\n\n- 时间复杂度：O(n)\n- 空间复杂度：O(1)',
    '[{"title":"代码随想录","url":"https://programmercarl.com/0026.%E5%88%A0%E9%99%A4%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E4%B8%AD%E7%9A%84%E9%87%8D%E5%A4%8D%E9%A1%B9.html","type":"article"},{"title":"B站讲解","url":"https://www.bilibili.com/video/BV1ev411P7KR","type":"video"}]',
    NOW(), NOW()
)，
(
    '删除排序数组中的重复项',
    '给定一个排序数组，你需要在原地删除重复出现的元素。',
    24,
    'https://leetcode.cn/problems/remove-duplicates-from-sorted-array/',
    1,
    '/solutions/remove-duplicates.html',
    0, 0, 1, 'admin',
    '数组, 双指针, 原地修改',
    '## 解题思路\n\n使用快慢指针：\n1. 慢指针指向不重复元素的最后位置\n2. 快指针遍历数组\n3. 当快指针指向的值与慢指针不同时，移动慢指针并更新\n\n- 时间复杂度：O(n)\n- 空间复杂度：O(1)',
    '[{"title":"代码随想录","url":"https://programmercarl.com/0026.%E5%88%A0%E9%99%A4%E6%8E%92%E5%BA%8F%E6%95%B0%E7%BB%84%E4%B8%AD%E7%9A%84%E9%87%8D%E5%A4%8D%E9%A1%B9.html","type":"article"},{"title":"B站讲解","url":"https://www.bilibili.com/video/BV1ev411P7KR","type":"video"}]',
    NOW(), NOW()
);

