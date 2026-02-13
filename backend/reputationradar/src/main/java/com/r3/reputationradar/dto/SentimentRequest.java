package com.r3.reputationradar.dto;

public class SentimentRequest {

    private String text;

    public SentimentRequest() {
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
