package com.r3.reputationradar.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class SystemController {

    @PostMapping("/api/system/deploy")
    public ResponseEntity<?> deploy() {
        // Start async deployment tasks in production; here we return simulated response
        return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "Deployment started"
        ));
    }
}
