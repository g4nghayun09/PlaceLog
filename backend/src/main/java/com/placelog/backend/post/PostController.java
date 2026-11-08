package com.placelog.backend.post;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class PostController {
    private final PostService postService;

    @PostMapping
    public PostDto.Response create(@Valid @RequestBody PostDto.Request req, HttpSession session) {
        return postService.create(loginUser(session), req);
    }

    @GetMapping
    public List<PostDto.Response> list(@RequestParam(required = false) Long categoryId) {
        return postService.list(categoryId);
    }

    @GetMapping("/{postId}")
    public PostDto.Response detail(@PathVariable Long postId) {
        return postService.detail(postId);
    }

    @PutMapping("/{postId}")
    public PostDto.Response update(@PathVariable Long postId, @Valid @RequestBody PostDto.Request req, HttpSession session) {
        return postService.update(loginUser(session), postId, req);
    }

    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable Long postId, HttpSession session) {
        postService.delete(loginUser(session), postId);
        return ResponseEntity.ok().build();
    }

    private Long loginUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new IllegalStateException("로그인이 필요합니다.");
        return userId;
    }
}