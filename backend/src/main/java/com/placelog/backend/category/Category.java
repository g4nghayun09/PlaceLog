package com.placelog.backend.category;

import jakarta.persistence.*;
import lombok.*;

// 테이블의 구조를 나타냄
@Entity
@Getter
@NoArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;
    private String name;
}