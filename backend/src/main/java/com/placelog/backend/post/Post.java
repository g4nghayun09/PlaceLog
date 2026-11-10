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
    @org.hibernate.annotations.Formula("(select count(*) from likes l where l.post_id = post_id)")
    private long likeCount;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id")
    private Category category;

    private String title;
    private String content;
    private String placeName;
    private String address;
    private Double latitude;
    private Double longitude;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PostImage> images = new ArrayList<>();

    public Post(User user, Category category, PostDto.Request req) {
        this.user = user;
        update(category, req);
    }

    public void update(Category category, PostDto.Request req) {
        this.category = category;
        this.title = req.title();
        this.content = req.content();
        this.placeName = req.placeName();
        this.address = req.address();
        this.latitude = req.latitude();
        this.longitude = req.longitude();
        this.images.clear();
        if (req.imageUrls() != null) {
            req.imageUrls().forEach(url -> images.add(new PostImage(this, url)));
        }
    }
}