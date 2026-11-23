package com.placelog.backend.user;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@NoArgsConstructor
public class User {
    // 기본키를 설정하겠다.
    @Id
    // 기본키 값을 자동으로 생성, IDENTITY를 가지고 자동 증가
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // 유저의 id
    private Long userId;

    // 로그인 id
    private String loginId;
    // 비밀번호
    private String password;
    // 유저의 이름
    private String name;

    // 언제 만들어졌는지 확인을 위한 어노테이션
    @CreationTimestamp
    // 그걸 저장하는 createdAt
    private LocalDateTime createdAt;

    // 생성자 -> 객체를 만들때 필요한 정보를 저장하는 생성자
    public User(String loginId, String password, String name) {
        this.loginId = loginId;
        this.password = password;
        this.name = name;
    }
}