package com.r3.reputationradar.controller;

import com.r3.reputationradar.entity.Post;
import com.r3.reputationradar.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;

    public PostController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        return postRepository.save(post);
    }

    @GetMapping
    public Iterable<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
