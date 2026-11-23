package com.placelog.backend.user;

import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import static com.placelog.backend.user.UserDto.*;

// 이 클래스가 service를 담당하는 것을 표시함.
@Service
// 초기화 되지 않은 final 필드를 위한 생성자 자동 생성
@RequiredArgsConstructor
public class UserService {
    //db에서 조회하거나 저장
    private final UserRepository userRepository;
    // 비밀번호 암호화
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    // 회원가입 부분
    // req는 회원가입에 대한 내용들임.
    public UserResponse signup(SignupRequest req) {
        // 만약 req의 로그인 아이디가 db에도 있으면 이미 사용 중인 아이디입니다
        if (userRepository.existsByLoginId(req.loginId())) {
            throw new IllegalArgumentException("이미 사용 중인 아이디입니다.");
        }
        // 로그인 아이디와, 암호화된 비번, 이름
        User user = new User(req.loginId(), encoder.encode(req.password()), req.name());
        // db에 저장
        return UserResponse.from(userRepository.save(user));
    }

    // 로그인 부분
    public User login(LoginRequest req) {
        // db에서 로그인 아이디를 찾고
        User user = userRepository.findByLoginId(req.loginId())
                // 조회결과 없으면 예외 발생
                .orElseThrow(() -> new IllegalArgumentException("아이디 또는 비밀번호가 틀렸습니다."));
        // 만약 비번이 틀리면
        if (!encoder.matches(req.password(), user.getPassword())) {
            // 오류 발생
            throw new IllegalArgumentException("아이디 또는 비밀번호가 틀렸습니다.");
        }
        return user;
    }

    // 불리안으로 t 아니면 f임
    // 로그인 아이디로 db에 있는지확인함.
    public boolean isAvailable(String loginId) {
        return !userRepository.existsByLoginId(loginId);
    }
}