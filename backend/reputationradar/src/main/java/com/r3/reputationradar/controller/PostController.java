package com.r3.reputationradar.controller;

import com.r3.reputationradar.entity.Post;
import com.r3.reputationradar.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    // Create new post
    @PostMapping
    public Post createPost(@RequestBody Post request) {
        return postService.createPost(request.getText());
    }

    // Get all posts
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }
}
