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

    // 게시물 만들기를 위한 메소드, 유저의 id, 내용을 가지고 게시물을 만든다.
    public PostDto.Response create(Long userId, PostDto.Request req) {
        // 유저의 아이디를 가지고 존재하는지 조회를 하고 없으면 유저 없음이 됨.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("유저 없음"));
        // post의 유저와 카테고리와 내용들임.
        Post post = new Post(user, getCategory(req.categoryId()), req);
        return PostDto.Response.from(postRepository.save(post));
    }

    // 게시글 목록을 db에서 조회하고 조회한 게시글을 dto로 변환해서 반환함.
    // 오직 읽기 전용으로 설정함
    @Transactional(readOnly = true)
    public List<PostDto.Response> list(Long categoryId) {
        // 삼항 연산자를 활용함. categoryid가 null이면 모든 게시글을 조회하고 만약 있으면 그 해당 categoryid의 게시글만 조회
        List<Post> posts = (categoryId == null)
                ? postRepository.findAllByOrderByCreatedAtDesc()
                : postRepository.findByCategory_CategoryIdOrderByCreatedAtDesc(categoryId);
        return posts.stream().map(PostDto.Response::from).toList();
    }

    // 특정 게시글 하나를 조회하겠다는 의미. 그걸 dto로 변환
    // 읽기 전용임.
    @Transactional(readOnly = true)
    public PostDto.Response detail(Long postId) {
        return PostDto.Response.from(getPost(postId));
    }

    // 수정하는 기능임. 유저의 id와 게시글의 id, 내용들을 가지고 고치는 것임
    public PostDto.Response update(Long userId, Long postId, PostDto.Request req) {
        // 객체를 선언하는데 사용자의 id와, 게시글의 id가이씅ㅁ
        Post post = getMyPost(userId, postId);
        // 그리고 여기서 수정을 하는데 userId의 postId를가지고 찾고 카테고리와 내용들을 넣어서 해결
        post.update(getCategory(req.categoryId()), req);
        return PostDto.Response.from(post);
    }

    // 게시물을 삭제하는 메소드
    // 유저의 id와 게시물의 id를 가지고 삭제를 함
    public void delete(Long userId, Long postId) {
        postRepository.delete(getMyPost(userId, postId));
    }

    // 게시물을 가져오는 역할을 한다.
    private Post getPost(Long postId) {
        // 게시글을 찾기
        return postRepository.findById(postId)
                // 없으면 예외 발생
                .orElseThrow(() -> new IllegalArgumentException("게시물이 없습니다."));
    }

    // 나의 게시물을 가져오는 역할을 함.
    // 유저의 id와 게시물의 id를 가지고
    private Post getMyPost(Long userId, Long postId) {
        Post post = getPost(postId);

        // 게시물의 유저의 id와 유저의id가 같은지 보고 다르면 안되는 크런 코드
        if (!post.getUser().getUserId().equals(userId)) {
            // 경고문구
            throw new IllegalArgumentException("본인 게시물만 수정/삭제할 수 있습니다.");
        }
        return post;
    }

    // 카테고리를 가져옴 long categoryId를 가지고
    private Category getCategory(Long categoryId) {
        // 카테고리의 레포 안에 category id가있는지 보고없음녀 없다고 말하ㅣㄱ
        return categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("카테고리가 없습니다."));
    }
}