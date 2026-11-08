package com.placelog.backend.user;

import jakarta.validation.constraints.NotBlank;

public class UserDto {
    public record SignupRequest(@NotBlank String loginId, @NotBlank String password, @NotBlank String name) {}
    public record LoginRequest(@NotBlank String loginId, @NotBlank String password) {}
    public record UserResponse(Long userId, String loginId, String name) {
        public static UserResponse from(User u) {
            return new UserResponse(u.getUserId(), u.getLoginId(), u.getName());
        }
    }
}