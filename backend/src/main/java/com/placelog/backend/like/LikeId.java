package com.placelog.backend.like;

import lombok.*;
import java.io.Serializable;
// 복합 기본키를 정의하는 역할
// userId와 postId 가 primary key가 되는 거임
@Getter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class LikeId implements Serializable {
    private Long userId;
    private Long postId;
}