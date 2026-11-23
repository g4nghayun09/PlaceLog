package com.placelog.backend.post;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // 최신순 조회
    List<Post> findAllByOrderByCreatedAtDesc();
    // 카테고리별 조회
    List<Post> findByCategory_CategoryIdOrderByCreatedAtDesc(Long categoryId);
    // 작성자 별 조회
    List<Post> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
}