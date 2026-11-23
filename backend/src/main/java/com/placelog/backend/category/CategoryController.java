package com.placelog.backend.category;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final CategoryRepository categoryRepository;

    // 값을 가져오는데 레포지토리에 있는 데이터를 가져오데 category를 기준으로 정렬함.
    @GetMapping
    public List<Category> list() {
        return categoryRepository.findAll(org.springframework.data.domain.Sort.by("categoryId"));
    }
}