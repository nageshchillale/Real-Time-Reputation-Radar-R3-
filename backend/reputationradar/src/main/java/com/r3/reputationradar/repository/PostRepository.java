package com.r3.reputationradar.repository;

import com.r3.reputationradar.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;

public interface PostRepository extends JpaRepository<Post, Long> {

    long countBySentimentAndTimestampAfter(String sentiment, LocalDateTime time);
}
