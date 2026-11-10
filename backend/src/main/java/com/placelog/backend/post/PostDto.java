package com.placelog.backend.post;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;
import java.util.List;

public class PostDto {
    public record Request(
            @NotNull Long categoryId,
            @NotBlank String title,
            String content,
            @NotBlank String placeName,
            String address,
            Double latitude,
            Double longitude,
            List<String> imageUrls
    ) {}

    public record Response(
            Long postId, Long userId, String writerName,
            Long categoryId, String categoryName,
            String title, String content,
            String placeName, String address, Double latitude, Double longitude,
            List<String> imageUrls, LocalDateTime createdAt,
            long likeCount
    ) {
        public static Response from(Post p) {
            return new Response(
                    p.getPostId(), p.getUser().getUserId(), p.getUser().getName(),
                    p.getCategory().getCategoryId(), p.getCategory().getName(),
                    p.getTitle(), p.getContent(),
                    p.getPlaceName(), p.getAddress(), p.getLatitude(), p.getLongitude(),
                    p.getImages().stream().map(PostImage::getImageUrl).toList(),
                    p.getCreatedAt(),
                    p.getLikeCount()
            );
        }
    }
}