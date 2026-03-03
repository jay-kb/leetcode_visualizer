-- 创建数据库（如未创建）
CREATE DATABASE IF NOT EXISTS leetcode_visualizer
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE leetcode_visualizer;

-- 1. 标签表
CREATE TABLE IF NOT EXISTS `tag` (
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `name`        VARCHAR(50)     NOT NULL UNIQUE COMMENT '标签名称，唯一',
    `color`       VARCHAR(20)     NOT NULL DEFAULT '#1890ff' COMMENT '标签颜色',
    `create_time` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '逻辑删除标记（0-正常，1-删除）',
    PRIMARY KEY (`id`),
    INDEX `idx_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 2. 题解表
CREATE TABLE IF NOT EXISTS `solution` (
    `id`                  BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `title`               VARCHAR(200)    NOT NULL COMMENT '题解标题',
    `description`         VARCHAR(500)             DEFAULT NULL COMMENT '简短描述',
    `leetcode_question_id` VARCHAR(20)    NOT NULL COMMENT '关联的LeetCode题目ID（如"15"）',
    `difficulty`          TINYINT(1)      NOT NULL COMMENT '难度：1-简单，2-中等，3-困难',
    `html_file_url`       VARCHAR(500)    NOT NULL COMMENT '上传的HTML文件访问路径',
    `cover_image_url`     VARCHAR(500)             DEFAULT NULL COMMENT '封面图URL',
    `view_count`          BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览次数',
    `like_count`          BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '点赞次数',
    `status`              TINYINT(1)      NOT NULL DEFAULT 1 COMMENT '状态：0-草稿，1-已发布',
    `created_by`          VARCHAR(50)     NOT NULL DEFAULT 'admin' COMMENT '创建者',
    `create_time`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time`         DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`             TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '逻辑删除标记（0-正常，1-删除）',
    PRIMARY KEY (`id`),
    INDEX `idx_leetcode_question_id` (`leetcode_question_id`),
    INDEX `idx_difficulty` (`difficulty`),
    INDEX `idx_status` (`status`),
    INDEX `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题解表';

-- 3. 题解-标签关联表
CREATE TABLE IF NOT EXISTS `solution_tag_rel` (
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `solution_id` BIGINT UNSIGNED NOT NULL COMMENT '题解ID',
    `tag_id`      BIGINT UNSIGNED NOT NULL COMMENT '标签ID',
    `create_time` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `deleted`     TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '逻辑删除标记（0-正常，1-删除）',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_solution_tag` (`solution_id`, `tag_id`) COMMENT '确保同一题解不重复打同一标签',
    INDEX `idx_tag_id` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='题解-标签关联表';

  -- 插入默认管理员账号 (密码: 123456，使用 BCrypt 加密)
  INSERT INTO `admin_user` (`username`, `password`, `roles`) VALUES
  ('admin', '$2a$10$cUdik0HcBVuFNAR.T2xKzusTANT3GqDvnK5wddAB65tPbW.HuzLyC', 'ADMIN');