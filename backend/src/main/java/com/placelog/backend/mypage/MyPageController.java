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
    // 게시글 데이터
    private final PostRepository postRepository;
    // 좋아요 데이터
    private final LikeRepository likeRepository;

    // 내가 쓴 게시물
    @GetMapping("/posts")
    public List<PostDto.Response> myPosts(HttpSession session) {
        // loginUser에서 로그인 여부를 판단함. desc가 최신순(작성일)으로 정렬,
        return postRepository.findByUser_UserIdOrderByCreatedAtDesc(loginUser(session))
                // 조회한 데이터 게시글을 DTO로 변환하는 과정
                // stream : 리스트 데이터 하나씩 처리하게 함. -> toList가 결과를 list로 만듦
                .stream().map(PostDto.Response::from).toList();
    }

    // 내가 좋아요한 게시물
    @GetMapping("/likes")
    public List<PostDto.Response> myLikes(HttpSession session) {
        // 내가 좋아요누른 게시물의 postId만 가져옴 (list로 위와 코드가 비슷함.)
        List<Long> postIds = likeRepository.findByUserId(loginUser(session))
                .stream().map(Like::getPostId).toList();
        // 게시글 id들을 해당 id에 해당하는 게시글을 조회
        return postRepository.findAllById(postIds)
                .stream().map(PostDto.Response::from).toList();
    }
    // 로그인 여부
    private Long loginUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new IllegalStateException("로그인이 필요합니다.");
        return userId;
    }
}