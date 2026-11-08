package com.placelog.backend.like;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts/{postId}/like")
@RequiredArgsConstructor
public class LikeController {
    private final LikeRepository likeRepository;

    public record LikeResponse(boolean liked, long likeCount) {}

    // 좋아요 토글
    @PostMapping
    @Transactional
    public LikeResponse toggle(@PathVariable Long postId, HttpSession session) {
        Long userId = loginUser(session);
        LikeId id = new LikeId(userId, postId);
        boolean liked;
        if (likeRepository.existsById(id)) {
            likeRepository.deleteById(id);
            liked = false;
        } else {
            likeRepository.save(new Like(userId, postId));
            liked = true;
        }
        return new LikeResponse(liked, likeRepository.countByPostId(postId));
    }

    // 좋아요 상태 조회 (로그인 안 했으면 liked=false)
    @GetMapping
    public LikeResponse status(@PathVariable Long postId, HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        boolean liked = userId != null && likeRepository.existsById(new LikeId(userId, postId));
        return new LikeResponse(liked, likeRepository.countByPostId(postId));
    }

    private Long loginUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new IllegalStateException("로그인이 필요합니다.");
        return userId;
    }
}