package com.r3.reputationradar.controller;

import com.r3.reputationradar.dto.DemoRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class DemoController {

    @PostMapping("/api/demo/request")
    public ResponseEntity<?> requestDemo(@RequestBody DemoRequest req) {
        // In a real system you'd enqueue the request, send an email, etc.
        return ResponseEntity.ok(Map.of(
                "status", "received",
                "message", "Demo request submitted"
        ));
    }
}
