-- 管理员用户表
CREATE TABLE IF NOT EXISTS `admin_user` (
    `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT '主键ID',
    `username`    VARCHAR(50)     NOT NULL UNIQUE COMMENT '用户名',
    `password`    VARCHAR(200)    NOT NULL COMMENT '密码（加密存储）',
    `roles`       VARCHAR(50)     NOT NULL DEFAULT 'ADMIN' COMMENT '角色',
    `create_time`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `update_time` DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    `deleted`     TINYINT(1)      NOT NULL DEFAULT 0 COMMENT '逻辑删除标记',
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='管理员用户表';

-- 插入默认管理员账号 (密码: 123456, 使用 BCrypt 加密)
-- 用户名: admin, 密码: 123456
INSERT INTO `admin_user` (`username`, `password`, `roles`) VALUES
('admin', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iAt6Z5E', 'ADMIN');
