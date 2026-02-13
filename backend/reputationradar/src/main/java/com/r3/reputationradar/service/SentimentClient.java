package com.r3.reputationradar.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.r3.reputationradar.dto.SentimentRequest;
import com.r3.reputationradar.dto.SentimentResponse;
@Service
public class SentimentClient {

    private final RestTemplate restTemplate = new RestTemplate();

    // Flask ML service endpoint
    private static final String ML_URL = "http://127.0.0.1:5000/analyze";

    public SentimentResponse analyzeSentiment(String text) {

        // Prepare request body
        SentimentRequest request = new SentimentRequest();
        request.setText(text);

        // Call Flask ML API
        return restTemplate.postForObject(
                ML_URL,
                request,
                SentimentResponse.class
        );
    }
}
