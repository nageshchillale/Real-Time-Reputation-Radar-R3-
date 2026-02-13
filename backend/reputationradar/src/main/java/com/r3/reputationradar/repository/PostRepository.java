package com.r3.reputationradar.repository;

import com.r3.reputationradar.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    // Find posts by sentiment label
    List<Post> findBySentimentLabel(String sentimentLabel);

    // Find posts created after specific time
    List<Post> findByTimestampAfter(LocalDateTime time);

    // Count negative posts in sliding window
    long countBySentimentLabelAndTimestampAfter(
            String sentimentLabel,
            LocalDateTime time
    );
}
