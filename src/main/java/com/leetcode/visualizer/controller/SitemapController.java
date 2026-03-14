package com.leetcode.visualizer.controller;

import com.leetcode.visualizer.common.Result;
import com.leetcode.visualizer.service.SolutionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;

@RestController
@RequestMapping("/api/sitemap")
public class SitemapController {

    @Autowired
    private SolutionService solutionService;

    /**
     * 生成 sitemap.xml
     */
    @GetMapping("/sitemap.xml")
    public void getSitemap(HttpServletResponse response) throws IOException {
        response.setContentType("application/xml;charset=UTF-8");

        List<Long> solutionIds = solutionService.getAllSolutionIds();
        String baseUrl = "https://www.codevisualis.top";

        StringBuilder sb = new StringBuilder();
        sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        sb.append("<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n");

        // 首页
        sb.append("  <url>\n");
        sb.append("    <loc>").append(baseUrl).append("/</loc>\n");
        sb.append("    <priority>1.0</priority>\n");
        sb.append("    <changefreq>daily</changefreq>\n");
        sb.append("  </url>\n");

        // 每个题解详情页
        for (Long id : solutionIds) {
            sb.append("  <url>\n");
            sb.append("    <loc>").append(baseUrl).append("/solution/").append(id).append("</loc>\n");
            sb.append("    <priority>0.8</priority>\n");
            sb.append("    <changefreq>weekly</changefreq>\n");
            sb.append("  </url>\n");
        }

        sb.append("</urlset>");

        PrintWriter writer = response.getWriter();
        writer.write(sb.toString());
        writer.flush();
    }
}
