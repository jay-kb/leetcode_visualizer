-- 浏览量统计表
CREATE TABLE IF NOT EXISTS `view_stats` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `solution_id` BIGINT UNSIGNED NOT NULL COMMENT '题解ID',
    `stat_date` DATE NOT NULL COMMENT '统计日期',
    `view_count` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '浏览次数',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_solution_date` (`solution_id`, `stat_date`),
    INDEX `idx_stat_date` (`stat_date`),
    INDEX `idx_solution_id` (`solution_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='浏览量统计表';

-- 总体浏览量统计表（可选）
CREATE TABLE IF NOT EXISTS `view_stats_total` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `stat_date` DATE NOT NULL COMMENT '统计日期',
    `total_views` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '总浏览次数',
    `unique_visitors` BIGINT UNSIGNED NOT NULL DEFAULT 0 COMMENT '独立访客数',
    `create_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_stat_date` (`stat_date`),
    INDEX `idx_stat_date` (`stat_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='总体浏览量统计表';
