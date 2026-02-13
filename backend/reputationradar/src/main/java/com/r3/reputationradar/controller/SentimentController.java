package com.r3.reputationradar.controller;

import com.r3.reputationradar.dto.SentimentRequest;
import com.r3.reputationradar.dto.SentimentResponse;
import com.r3.reputationradar.service.SentimentClient;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/sentiment")
public class SentimentController {

    private final SentimentClient sentimentClient;

    public SentimentController(SentimentClient sentimentClient) {
        this.sentimentClient = sentimentClient;
    }

    @PostMapping("/analyze")
    public SentimentResponse analyze(@RequestBody SentimentRequest request) {
        return sentimentClient.analyzeSentiment(request.getText());
    }
}
