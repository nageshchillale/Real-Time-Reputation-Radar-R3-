package com.r3.reputationradar.service;

import com.r3.reputationradar.entity.Post;
import com.r3.reputationradar.repository.PostRepository;
import com.r3.reputationradar.dto.SentimentResponse;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final SentimentClient sentimentClient;

    public PostService(PostRepository postRepository,
                       SentimentClient sentimentClient) {
        this.postRepository = postRepository;
        this.sentimentClient = sentimentClient;
    }

    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    public Post createPost(String text) {

        // 1️⃣ Call ML Sentiment Service
        SentimentResponse response =
                sentimentClient.analyzeSentiment(text);

        // 2️⃣ Create Post Entity
        Post post = new Post();
        post.setText(text);
        post.setSentimentLabel(response.getLabel());
        post.setSentimentScore(response.getScore());

        // 3️⃣ Save first to persist timestamp
        post = postRepository.save(post);

        // 4️⃣ Sliding Window (Last 5 Minutes)
        LocalDateTime fiveMinutesAgo =
                LocalDateTime.now().minusMinutes(5);

        long negativeCount =
                postRepository.countBySentimentLabelAndTimestampAfter(
                        "NEGATIVE",
                        fiveMinutesAgo
                );

        // 5️⃣ Severity Classification Logic
        String crisisLevel;

        if (negativeCount >= 8) {
            crisisLevel = "SEVERE";
        } else if (negativeCount >= 5) {
            crisisLevel = "CRITICAL";
        } else if (negativeCount >= 3) {
            crisisLevel = "WARNING";
        } else {
            crisisLevel = "NORMAL";
        }

        // 6️⃣ Set Crisis Flags
        post.setCrisisLevel(crisisLevel);
        post.setCrisis(!"NORMAL".equals(crisisLevel));

        // 7️⃣ Save updated state
        return postRepository.save(post);
    }
}
