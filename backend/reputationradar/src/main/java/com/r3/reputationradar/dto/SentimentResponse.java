package com.r3.reputationradar.dto;

public class SentimentResponse {

    private String label;
    private double score;

    public SentimentResponse() {
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getScore() {
        return score;
    }

    public void setScore(double score) {
        this.score = score;
    }
}
