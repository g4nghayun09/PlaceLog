package com.placelog.backend.image;

import jakarta.servlet.http.HttpSession;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/images")
public class ImageController {
    public static final Path UPLOAD_DIR = Paths.get("uploads").toAbsolutePath();

    @PostMapping
    public List<String> upload(@RequestParam("files") List<MultipartFile> files, HttpSession session) throws IOException {
        if (session.getAttribute("userId") == null) throw new IllegalStateException("로그인이 필요합니다.");
        Files.createDirectories(UPLOAD_DIR);

        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            String type = file.getContentType();
            if (!"image/jpeg".equals(type) && !"image/png".equals(type)) {
                throw new IllegalArgumentException("JPG, PNG 파일만 올릴 수 있어요.");
            }
            String name = UUID.randomUUID() + ("image/png".equals(type) ? ".png" : ".jpg");
            file.transferTo(UPLOAD_DIR.resolve(name));
            urls.add("http://localhost:8080/uploads/" + name);
        }
        return urls;
    }
}