package com.abes.VenueVista.controller;

import com.abes.VenueVista.dto.LoginRequest;
import com.abes.VenueVista.dto.LoginResponse;
import com.abes.VenueVista.entity.User;
import com.abes.VenueVista.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register")
    public User registerUser(@Valid @RequestBody User user) {
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public LoginResponse loginUser(@Valid @RequestBody LoginRequest request) {
        return userService.loginUser(request);
    }

    @PostMapping("/reset-password")
    public java.util.Map<String, String> resetPassword(@RequestBody java.util.Map<String, String> request) {
        String email = request.get("email");
        String newPassword = request.get("newPassword");
        if (email == null || newPassword == null || newPassword.trim().isEmpty()) {
            throw new RuntimeException("Email and newPassword are required");
        }
        userService.resetPassword(email, newPassword);
        java.util.Map<String, String> response = new java.util.HashMap<>();
        response.put("message", "Password reset successfully");
        return response;
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }
}