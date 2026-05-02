package com.r3.reputationradar.controller;

import com.r3.reputationradar.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final PostRepository postRepository;

    public AnalyticsController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        long total = postRepository.count();
        long positive = postRepository.countBySentimentLabel("POSITIVE");
        long negative = postRepository.countBySentimentLabel("NEGATIVE");

        Map<String, Object> response = new HashMap<>();
        response.put("totalPosts", total);
        response.put("positivePosts", positive);
        response.put("negativePosts", negative);

        return response;
    }
}