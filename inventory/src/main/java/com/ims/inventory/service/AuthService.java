package com.ims.inventory.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.ims.inventory.entity.User;
import com.ims.inventory.repository.UserRepository;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // REGISTER
    public User register(User user) {

        Optional<User> existingUser =
                userRepository.findByUsername(user.getUsername());

        if (existingUser.isPresent()) {
            throw new RuntimeException("Username already exists");
        }

        // Encrypt password
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        return userRepository.save(user);
    }

    // LOGIN
    public User login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return user;
    }
}