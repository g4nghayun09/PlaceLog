package com.placelog.backend.user;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // 로그인 아이디를 이용해서 해당 사용자의 정보를 조회
    Optional<User> findByLoginId(String loginId);

    // 해당 로그인 아이디가 db에 존재하는지 확인
    boolean existsByLoginId(String loginId);
}