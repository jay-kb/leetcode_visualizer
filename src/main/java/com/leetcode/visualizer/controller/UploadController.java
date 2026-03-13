package com.leetcode.visualizer.controller;

import com.leetcode.visualizer.common.Result;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/admin/upload")
public class UploadController {

    @Value("${file.upload.path}")
    private String uploadPath;

    @Value("${file.upload.covers-path}")
    private String coversPath;

    /**
     * 上传 HTML 文件
     * POST /api/admin/upload/html
     */
    @PostMapping("/html")
    public Result<Map<String, Object>> uploadHtml(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "leetcodeQuestionId", required = false) Integer leetcodeQuestionId) {

        if (file.isEmpty()) {
            return Result.error("文件为空");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || !originalFilename.toLowerCase().endsWith(".html")) {
            return Result.error("只支持 HTML 文件");
        }

        // 文件大小限制 10MB
        if (file.getSize() > 10 * 1024 * 1024) {
            return Result.error("文件大小不能超过 10MB");
        }

        try {
            // 确保目录存在
            File uploadDir = new File(uploadPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 生成文件名: {leetcodeQuestionId}-{slug}.html
            String fileName = generateHtmlFileName(originalFilename, leetcodeQuestionId);
            String filePath = uploadPath + fileName;

            // 保存文件
            file.transferTo(new File(filePath));

            // 返回结果
            Map<String, Object> result = new HashMap<>();
            result.put("fileName", fileName);
            result.put("filePath", "/solutions/" + fileName);
            result.put("fileSize", file.getSize());

            return Result.success(result);
        } catch (IOException e) {
            return Result.error("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 上传封面图片
     * POST /api/admin/upload/cover
     */
    @PostMapping("/cover")
    public Result<Map<String, Object>> uploadCover(@RequestParam("file") MultipartFile file) {

        if (file.isEmpty()) {
            return Result.error("文件为空");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null) {
            return Result.error("文件名无效");
        }

        // 文件大小限制 5MB
        if (file.getSize() > 5 * 1024 * 1024) {
            return Result.error("文件大小不能超过 5MB");
        }

        // 检查文件类型
        String lowerName = originalFilename.toLowerCase();
        if (!lowerName.endsWith(".png") && !lowerName.endsWith(".jpg") &&
                !lowerName.endsWith(".jpeg") && !lowerName.endsWith(".gif") &&
                !lowerName.endsWith(".webp")) {
            return Result.error("只支持图片文件 (png, jpg, jpeg, gif, webp)");
        }

        try {
            // 确保目录存在
            File uploadDir = new File(coversPath);
            if (!uploadDir.exists()) {
                uploadDir.mkdirs();
            }

            // 生成文件名: cover-{uuid}.{ext}
            String suffix = originalFilename.substring(originalFilename.lastIndexOf("."));
            String fileName = "cover-" + UUID.randomUUID().toString().replace("-", "") + suffix;
            String filePath = coversPath + fileName;

            // 保存文件
            file.transferTo(new File(filePath));

            // 返回结果
            Map<String, Object> result = new HashMap<>();
            result.put("fileName", fileName);
            result.put("filePath", "/covers/" + fileName);
            result.put("fileSize", file.getSize());

            return Result.success(result);
        } catch (IOException e) {
            return Result.error("文件上传失败: " + e.getMessage());
        }
    }

    /**
     * 生成 HTML 文件名
     * 格式: {leetcodeQuestionId}-{slug}.html
     */
    private String generateHtmlFileName(String originalFilename, Integer questionId) {
        // 提取 slug（去掉 .html 后缀，处理特殊字符）
        String slug = originalFilename
                .replace(".html", "")
                .replaceAll("[^a-zA-Z0-9\\u4e00-\\u9fa5]", "-")
                .toLowerCase();

        // 如果没有 questionId，使用时间戳+随机数
        if (questionId == null) {
            String uuid = UUID.randomUUID().toString().replace("-", "");
            // 取 UUID 的后 8 位并确保在 Integer 范围内
            questionId = (int) (Long.parseLong(uuid.substring(24, 32), 16) % Integer.MAX_VALUE);
        }

        return questionId + "-" + slug + ".html";
    }
}
