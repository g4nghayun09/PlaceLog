package com.placelog.backend.mypage;

import com.placelog.backend.like.*;
import com.placelog.backend.post.*;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MyPageController {
    private final PostRepository postRepository;
    private final LikeRepository likeRepository;

    // 내가 쓴 게시물
    @GetMapping("/posts")
    public List<PostDto.Response> myPosts(HttpSession session) {
        return postRepository.findByUser_UserIdOrderByCreatedAtDesc(loginUser(session))
                .stream().map(PostDto.Response::from).toList();
    }

    // 내가 좋아요한 게시물
    @GetMapping("/likes")
    public List<PostDto.Response> myLikes(HttpSession session) {
        List<Long> postIds = likeRepository.findByUserId(loginUser(session))
                .stream().map(Like::getPostId).toList();
        return postRepository.findAllById(postIds)
                .stream().map(PostDto.Response::from).toList();
    }

    private Long loginUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new IllegalStateException("로그인이 필요합니다.");
        return userId;
    }
}