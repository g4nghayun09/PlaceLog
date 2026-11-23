package com.placelog.backend.user;

import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import static com.placelog.backend.user.UserDto.*;

// http 요청을 처리하고 데이터로 응답하는 controller
@RestController
// 공통 api 주소 설정
@RequestMapping("/api/users")
// final 필드의 생성자 자동 생성
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    // 회원가입
    @PostMapping("/signup")
    // valid는 요청 데이터의 유효성을 검사 requestbody : json을 자바 객체로 변환
    // req는 회원가입에 필요한 내용들임.
    public UserResponse signup(@Valid @RequestBody SignupRequest req) {
        // userservice 의 signup파트 부분에서 회원 가입에 필요한 내용들을 전달함.
        return userService.signup(req);
    }

    /*
    *       httpsesssion이란
    *      -> 사용자가 로그인 했다는 정보를 서버가 기억하도록 도와주는 기능
    * */


    // 로그인
    @PostMapping("/login")
    // valid는 유효성 검사, requestbody는 json형태의 데이터를 java 객체로 변환 시켜줌
    // req는 로그인에 대한 내용들임 session은 로그인 상태를 유지하기 위한 세션
    public UserResponse login(@Valid @RequestBody LoginRequest req, HttpSession session) {
        // 유저 서비스의 로그인에 정보들을 넣고 그결과를 user에 저장함.
        User user = userService.login(req);
        // 세션에 userId라는 이름으로 사용자 ID 저장
        session.setAttribute("userId", user.getUserId());
        return UserResponse.from(user);
    }

    // 로그아웃
    @PostMapping("/logout")
    // 그 로그인 상태를 유지하기 위한 세션을 매개변수로
    public ResponseEntity<Void> logout(HttpSession session) {
        // 현재 새션을 무효화함.
        session.invalidate();
        // http 200 ok 응답을 반환
        return ResponseEntity.ok().build();
    }

    // 현재 사용자가 누구인지 확인
    @GetMapping("/me")
    // 현재 세션을 가지고
    public ResponseEntity<Long> me(HttpSession session) {
        // 세션을 userid로 변환하고
        Long userId = (Long) session.getAttribute("userId");
        // null이면 401이고 아니면 200 ok
        return userId == null ? ResponseEntity.status(401).build() : ResponseEntity.ok(userId);
    }

    // 회원가입할때 중복 여부를 확인함.
    @GetMapping("/check")
    // boolean으로 t 아니면 f임.
    // url의 쿼리 파라미터를 가져옴, 확인할 로그인아이디
    public boolean check(@RequestParam String loginId) {
        // 해당 아이디를 사용할 수 있는지 확인을 함.
        return userService.isAvailable(loginId);
    }
}