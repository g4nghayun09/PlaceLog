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

    // 게시글 작성
    @PostMapping
    public PostDto.Response create(@Valid @RequestBody PostDto.Request req, HttpSession session) {
        // postservice의 create 메소드에서 로그인을 조회하고 사용자가 작성한 게시글의 데이터가 req, 사용자의 세션
        return postService.create(loginUser(session), req);
    }

    // 게시글 전체 조회
    @GetMapping
    public List<PostDto.Response> list(@RequestParam(required = false) Long categoryId) {
        // postservice의 리스트에 카테고리 아이디에 해당하는 게시글 전체 조회
        // 전달 x -> 전체 조회
        return postService.list(categoryId);
    }

    // 게시글 특정 하나를 조회
    @GetMapping("/{postId}")
    public PostDto.Response detail(@PathVariable Long postId) {
        // postservice의 detail에 게시글id를 가지고 함.
        return postService.detail(postId);
    }

    // 게시글 수정하기
    @PutMapping("/{postId}")
    public PostDto.Response update(@PathVariable Long postId, @Valid @RequestBody PostDto.Request req, HttpSession session) {
        // postservice의 update에서 로그인 여부를 조사하고 해당 게시물의 id와 내용을 가지고 수정을 한다.
        return postService.update(loginUser(session), postId, req);
    }

    // 게시글 삭제하기
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> delete(@PathVariable Long postId, HttpSession session) {
        // postservice의 delete에서 로그인 여부를 조사하고 해당 게시물의 id를 가지고 삭제를 한다.
        postService.delete(loginUser(session), postId);
        return ResponseEntity.ok().build();
    }

    // 로그인 여부를 확인하는 코드
    private Long loginUser(HttpSession session) {
        // 현재 유저의 pk를 가져옴. 없으면 null
        Long userId = (Long) session.getAttribute("userId");
        // null 즉 없으면 로그인이 필요합니다라고 보내기
        if (userId == null) throw new IllegalStateException("로그인이 필요합니다.");
        return userId;
    }
}