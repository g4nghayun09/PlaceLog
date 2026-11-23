package com.placelog.backend.category;

import org.springframework.data.jpa.repository.JpaRepository;
// controller와 sql 사이에서 데이터 접근을 담당
public interface CategoryRepository extends JpaRepository<Category, Long> {}