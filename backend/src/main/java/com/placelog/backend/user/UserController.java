package com.placelog.backend.user;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static com.placelog.backend.user.UserDto.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @PostMapping("/signup")
    public UserResponse signup(@Valid @RequestBody SignupRequest req) {
        return userService.signup(req);
    }

    @PostMapping("/login")
    public UserResponse login(@Valid @RequestBody LoginRequest req, HttpSession session) {
        User user = userService.login(req);
        session.setAttribute("userId", user.getUserId());
        return UserResponse.from(user);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    @GetMapping("/me")
    public ResponseEntity<Long> me(HttpSession session) {
        Long userId = (Long) session.getAttribute("userId");
        return userId == null ? ResponseEntity.status(401).build() : ResponseEntity.ok(userId);
    }

    @GetMapping("/check")
    public boolean check(@RequestParam String loginId) {
        return userService.isAvailable(loginId);
    }
}