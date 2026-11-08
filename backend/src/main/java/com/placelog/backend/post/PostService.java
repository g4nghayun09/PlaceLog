package com.placelog.backend.post;

import com.placelog.backend.category.*;
import com.placelog.backend.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;

    public PostDto.Response create(Long userId, PostDto.Request req) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
        Post post = new Post(user, getCategory(req.categoryId()), req);
        return PostDto.Response.from(postRepository.save(post));
    }

    @Transactional(readOnly = true)
    public List<PostDto.Response> list(Long categoryId) {
        List<Post> posts = (categoryId == null)
                ? postRepository.findAllByOrderByCreatedAtDesc()
                : postRepository.findByCategory_CategoryIdOrderByCreatedAtDesc(categoryId);
        return posts.stream().map(PostDto.Response::from).toList();
    }

    @Transactional(readOnly = true)
    public PostDto.Response detail(Long postId) {
        return PostDto.Response.from(getPost(postId));
    }

    public PostDto.Response update(Long userId, Long postId, PostDto.Request req) {
        Post post = getMyPost(userId, postId);
        post.update(getCategory(req.categoryId()), req);
        return PostDto.Response.from(post);
    }

    public void delete(Long userId, Long postId) {
        postRepository.delete(getMyPost(userId, postId));
    }

    private Post getPost(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new IllegalArgumentException("게시물이 없습니다."));
    }

    private Post getMyPost(Long userId, Long postId) {
        Post post = getPost(postId);
        if (!post.getUser().getUserId().equals(userId)) {
            throw new IllegalArgumentException("본인 게시물만 수정/삭제할 수 있습니다.");
        }
        return post;
    }

    private Category getCategory(Long categoryId) {
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다."));
    }
}