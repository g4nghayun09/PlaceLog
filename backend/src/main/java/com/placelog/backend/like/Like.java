package com.placelog.backend.like;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "likes")
@IdClass(LikeId.class)
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class Like {
    @Id
    private Long userId;
    @Id
    private Long postId;
}