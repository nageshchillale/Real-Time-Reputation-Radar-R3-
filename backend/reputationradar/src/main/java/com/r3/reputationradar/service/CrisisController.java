package com.r3.reputationradar.controller;

import com.r3.reputationradar.repository.PostRepository;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/crisis")
public class CrisisController {

    private final PostRepository postRepository;

    public CrisisController(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    @GetMapping("/status")
    public Map<String, Object> getCrisisStatus() {

        LocalDateTime fiveMinutesAgo =
                LocalDateTime.now().minusMinutes(5);

        long negativeCount =
                postRepository.countBySentimentLabelAndTimestampAfter(
                        "NEGATIVE",
                        fiveMinutesAgo
                );

        String level;

        if (negativeCount >= 8) level = "SEVERE";
        else if (negativeCount >= 5) level = "CRITICAL";
        else if (negativeCount >= 3) level = "WARNING";
        else level = "NORMAL";

        Map<String, Object> response = new HashMap<>();
        response.put("negativeCountLast5Minutes", negativeCount);
        response.put("crisisLevel", level);

        return response;
    }
}
