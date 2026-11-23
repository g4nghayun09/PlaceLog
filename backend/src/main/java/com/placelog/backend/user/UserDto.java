package com.placelog.backend.user;

import jakarta.validation.constraints.NotBlank;

public class UserDto {

    // 회원가입 요청
    public record SignupRequest(
            @NotBlank String loginId,
            @NotBlank String password,
            @NotBlank String name
    ) {}

    // 로그인 요청
    public record LoginRequest(
            @NotBlank String loginId,
            @NotBlank String password
    ) {}

    // 사용자 정보의 응답
    public record UserResponse(
            Long userId,
            String loginId,
            String name
    ) {
        // 엔티티를 dto로 변환
        public static UserResponse from(User u) {
            return new UserResponse(u.getUserId(), u.getLoginId(), u.getName());
        }
    }
}