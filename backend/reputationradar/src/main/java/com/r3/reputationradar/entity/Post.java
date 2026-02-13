package com.r3.reputationradar.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String text;
    private  boolean crisis;
    private String crisisLevel;
    private String sentimentLabel;
    private Double sentimentScore;

    private LocalDateTime timestamp = LocalDateTime.now();

    // Getters

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }
    public boolean isCrisis() {
        return crisis;
    }

    public void setCrisis(boolean crisis) {
        this.crisis = crisis;
    }
    public String getCrisisLevel() {
        return crisisLevel;
    }

    public void setCrisisLevel(String crisisLevel) {
        this.crisisLevel = crisisLevel;
    }


    public String getSentimentLabel() {
        return sentimentLabel;
    }

    public Double getSentimentScore() {
        return sentimentScore;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    // Setters

    public void setText(String text) {
        this.text = text;
    }

    public void setSentimentLabel(String sentimentLabel) {
        this.sentimentLabel = sentimentLabel;
    }

    public void setSentimentScore(Double sentimentScore) {
        this.sentimentScore = sentimentScore;
    }
}
