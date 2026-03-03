package com.leetcode.visualizer.controller;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.leetcode.visualizer.common.Result;
import com.leetcode.visualizer.entity.AdminUser;
import com.leetcode.visualizer.mapper.AdminUserMapper;
import com.leetcode.visualizer.security.JwtTokenUtil;
import com.leetcode.visualizer.vo.LoginRequest;
import com.leetcode.visualizer.vo.LoginResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/admin/api/auth")
public class AuthController {

    @Autowired
    private AdminUserMapper adminUserMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    /**
     * 登录接口
     */
    @PostMapping("/login")
    public Result<LoginResponse> login(@RequestBody @Validated LoginRequest request) {
        log.info("用户登录: {}", request.getUsername());

        // 查询用户
        AdminUser user = adminUserMapper.selectOne(
                new LambdaQueryWrapper<AdminUser>()
                        .eq(AdminUser::getUsername, request.getUsername())
        );

        if (user == null) {
            return Result.error("用户名或密码错误");
        }

        // 验证密码
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return Result.error("用户名或密码错误");
        }

        // 生成 Token
        String token = jwtTokenUtil.generateToken(user.getUsername(), user.getRoles());

        log.info("用户 {} 登录成功", user.getUsername());
        return Result.success(new LoginResponse(token, user.getUsername(), user.getRoles()));
    }

    /**
     * 临时：生成密码哈希（测试用）
     */
    @GetMapping("/gen-password")
    public Result<String> genPassword(@RequestParam String password) {
        String hash = passwordEncoder.encode(password);
        return Result.success(hash);
    }

}
