package com.placelog.backend.like;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
// controller와 sql을 이어주는 매개체 역할
public interface LikeRepository extends JpaRepository<Like, LikeId> {
    // 특정 글의 좋아요 수 조회
    long countByPostId(Long postId);
    // 내가 누른 게시물의 좋아요 목록 조회
    List<Like> findByUserId(Long userId);
}