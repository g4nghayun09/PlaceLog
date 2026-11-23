package com.placelog.backend.post;

import com.placelog.backend.category.Category;
import com.placelog.backend.user.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@NoArgsConstructor
public class Post {
    // 좋아요 수를 계산 하는 코드
    @org.hibernate.annotations.Formula("(select count(*) from likes l where l.post_id = post_id)")
    private long likeCount;
    // 테이블에 있는거
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;
    // user와 post의 관계
    // LAZY가 필요하면 가져오겠다는 말
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // category와 post의 관계
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    // 게시글의 데이터 필드
    private String title;
    private String content;
    private String placeName;
    private String address;
    private Double latitude;
    private Double longitude;

    // 게시글의 생성시간 관련한 코드
    @CreationTimestamp
    private LocalDateTime createdAt;

    // 게시글과 이미지의 관게를 나타내는 코드
    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> images = new ArrayList<>();

    // 생성자
    public Post(User user, Category category, PostDto.Request req) {
        this.user = user;
        update(category, req);
    }

    // 수정하는 부분
    public void update(Category category, PostDto.Request req) {
        this.category = category;
        this.title = req.title();
        this.content = req.content();
        this.placeName = req.placeName();
        this.address = req.address();
        this.latitude = req.latitude();
        this.longitude = req.longitude();
        // 기존 이미지 삭제
        this.images.clear();
        // 만약 이미지가 null이 아님
        if (req.imageUrls() != null) {
            // 새로운 이미지로 갈아끼움
            req.imageUrls().forEach(url -> images.add(new PostImage(this, url)));
        }
    }
}