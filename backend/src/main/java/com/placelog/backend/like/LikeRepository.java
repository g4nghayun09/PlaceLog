package com.placelog.backend.like;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface LikeRepository extends JpaRepository<Like, LikeId> {
    long countByPostId(Long postId);
    List<Like> findByUserId(Long userId);
}