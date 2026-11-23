package com.placelog.backend.like;

import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

// 기본 설정
@RestController
@RequestMapping("/api/posts/{postId}/like")
@RequiredArgsConstructor
public class LikeController {
    private final LikeRepository likeRepository;
    // 응답 데이터를 담는 구조 liked : 좋아요 눌렀는지 , likeCount : 해당 게시글의 좋아요 수
    public record LikeResponse(boolean liked, long likeCount) {}

    // 좋아요 토글 : 좋아요 버튼을 클릭했을 때 실행
    @PostMapping
    @Transactional
    public LikeResponse toggle(@PathVariable Long postId, HttpSession session) {
        // 어느 사람인지 로그인도 체크
        Long userId = loginUser(session);
        // 어느 게시물인지
        LikeId id = new LikeId(userId, postId);
        // 좋아요 취소 or 좋아요
        boolean liked;
        // 이미 좋아요를 누른거 -> 취소
        if (likeRepository.existsById(id)) {
            likeRepository.deleteById(id);
            liked = false;
        } else {
            likeRepository.save(new Like(userId, postId));
            liked = true;
        }
        return new LikeResponse(liked, likeRepository.countByPostId(postId));
    }

    // 좋아요 상태 조회 (로그인 안 했으면 liked=false) : 내 좋아요 상태를 확인하는 코드
    @GetMapping
    public LikeResponse status(@PathVariable Long postId, HttpSession session) {
        // 로그인한 유저의 아이디를 가져옴
        Long userId = (Long) session.getAttribute("userId");
        // 그 사람이 실제로 존재를 하고 그 사람이 해당 게시글에 좋아요를 눌렀는가?
        boolean liked = userId != null && likeRepository.existsById(new LikeId(userId, postId));
        return new LikeResponse(liked, likeRepository.countByPostId(postId));
    }

    // 로그인 확인하는 거
    private Long loginUser(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        if (userId == null) throw new IllegalStateException("로그인이 필요합니다.");
        return userId;
    }
}