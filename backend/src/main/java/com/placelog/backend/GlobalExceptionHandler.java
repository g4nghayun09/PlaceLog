package com.placelog.backend;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// 프로젝트 전체의 controller가 발생시키는 예외를 공통적으로 처리함.
@RestControllerAdvice
public class GlobalExceptionHandler {
    // 특정 예외를 처리하겠다고 선언함
    @ExceptionHandler(IllegalArgumentException.class)
    // 400 리턴
    public ResponseEntity<String> handle(IllegalArgumentException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }

    // 특정 예외를 처리하겠다고 선언함.
    @ExceptionHandler(IllegalStateException.class)
    // e가 발생한 예외의 객체임.
    // 401 return
    public ResponseEntity<String> handleAuth(IllegalStateException e) {
        return ResponseEntity.status(401).body(e.getMessage());
    }
}