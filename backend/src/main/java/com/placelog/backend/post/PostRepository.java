package com.placelog.backend.post;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    List<Post> findAllByOrderByCreatedAtDesc();
    List<Post> findByCategory_CategoryIdOrderByCreatedAtDesc(Long categoryId);
    List<Post> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
}