package com.r3.reputationradar.controller;

import com.r3.reputationradar.entity.Post;
import com.r3.reputationradar.service.PostService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import com.r3.reputationradar.repository.PostRepository;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final PostRepository postRepository;

    public PostController(PostService postService, PostRepository postRepository) {
        this.postService = postService;
        this.postRepository = postRepository;
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

    // Export CSV
    @GetMapping("/export")
    public void exportCsv(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=posts.csv");

        // Use service to fetch posts; PostService returns list
        List<Post> posts = postService.getAllPosts();

        PrintWriter writer = response.getWriter();
        writer.println("Text,Sentiment,Score,Crisis");

        for (Post p : posts) {
            String text = p.getText() == null ? "" : p.getText().replaceAll("\n", " ").replaceAll(",", " ");
            writer.println(text + "," + (p.getSentimentLabel() == null ? "" : p.getSentimentLabel()) + "," + (p.getSentimentScore() == null ? "" : p.getSentimentScore()) + "," + p.isCrisis());
        }

        writer.flush();
    }
}
