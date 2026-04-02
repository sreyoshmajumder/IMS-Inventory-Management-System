package com.ims.inventory.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

import com.ims.inventory.entity.User;
import com.ims.inventory.service.AuthService;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

private final AuthService authService;

// REGISTER
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody User user) {

    User savedUser = authService.register(user);

    Map<String, Object> response = new HashMap<>();
    response.put("message", "User registered successfully");
    response.put("userId", savedUser.getUserId());
    response.put("username", savedUser.getUsername());
    response.put("role", savedUser.getRole());

    return ResponseEntity.ok(response);
}
// LOGIN
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody User user) {

    User loggedUser = authService.login(user.getUsername(), user.getPassword());

    Map<String, Object> response = new HashMap<>();
    response.put("message", "Login successful");
    response.put("userId", loggedUser.getUserId());
    response.put("username", loggedUser.getUsername());
    response.put("role", loggedUser.getRole());

    return ResponseEntity.ok(response);
}

}