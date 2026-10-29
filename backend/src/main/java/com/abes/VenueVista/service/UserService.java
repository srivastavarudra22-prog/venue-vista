package com.abes.VenueVista.service;

import com.abes.VenueVista.dto.LoginRequest;
import com.abes.VenueVista.dto.LoginResponse;
import com.abes.VenueVista.entity.User;
import com.abes.VenueVista.repository.UserRepository;
import com.abes.VenueVista.util.JwtUtil;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    private final BCryptPasswordEncoder passwordEncoder =
            new BCryptPasswordEncoder();

    public UserService(
            UserRepository userRepository,
            JwtUtil jwtUtil
    ) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    public User registerUser(User user) {

        if (user.getRole() == null || user.getRole().trim().isEmpty()) {
            user.setRole("CUSTOMER");
        }

        // Check if an account already exists with the same email and compatible role
        List<User> existingUsers = userRepository.findAllByEmailOrderByIdAsc(user.getEmail());
        for (User existing : existingUsers) {
            String existingRole = existing.getRole() != null ? existing.getRole().toUpperCase() : "CUSTOMER";
            String newRole = user.getRole().toUpperCase();
            boolean rolesMatch = existingRole.equals(newRole)
                    || ((existingRole.equals("USER") || existingRole.equals("CUSTOMER"))
                    && (newRole.equals("USER") || newRole.equals("CUSTOMER")));

            if (rolesMatch) {
                // Update credentials on existing account to prevent duplicate record explosion
                String hashedPassword = passwordEncoder.encode(user.getPassword());
                existing.setPassword(hashedPassword);
                if (user.getName() != null && !user.getName().trim().isEmpty()) {
                    existing.setName(user.getName());
                }
                if (user.getPhone() != null && !user.getPhone().trim().isEmpty()) {
                    existing.setPhone(user.getPhone());
                }
                return userRepository.save(existing);
            }
        }

        // Hash password before storing it
        String hashedPassword =
                passwordEncoder.encode(user.getPassword());

        user.setPassword(hashedPassword);

        return userRepository.save(user);
    }

    public LoginResponse loginUser(LoginRequest request) {

        // Find user(s) using email (handles multiple accounts if any exist)
        List<User> users = userRepository.findAllByEmailOrderByIdAsc(request.getEmail());
        if (users == null || users.isEmpty()) {
            throw new RuntimeException("Invalid email or password");
        }

        User matchedUser = null;

        // 1. If role is specified, prioritize matching role and password
        if (request.getRole() != null && !request.getRole().trim().isEmpty()) {
            String targetRole = request.getRole().trim().toUpperCase();
            for (User user : users) {
                String role = (user.getRole() != null ? user.getRole() : "").toUpperCase();
                boolean roleMatches = false;
                if (targetRole.equals("CUSTOMER") || targetRole.equals("USER")) {
                    roleMatches = role.equals("CUSTOMER") || role.equals("USER");
                } else {
                    roleMatches = role.equals(targetRole);
                }

                if (roleMatches && passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    matchedUser = user;
                    break;
                }
            }
        }

        // 2. If no role-specific match was found, verify password against all matching email accounts
        if (matchedUser == null) {
            for (User user : users) {
                if (passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                    matchedUser = user;
                    break;
                }
            }
        }

        if (matchedUser == null) {
            throw new RuntimeException("Invalid email or password");
        }

        // Generate JWT token
        String token = jwtUtil.generateToken(
                matchedUser.getEmail(),
                matchedUser.getRole()
        );

        // Return token + basic user information
        return new LoginResponse(
                token,
                matchedUser.getId(),
                matchedUser.getName(),
                matchedUser.getEmail(),
                matchedUser.getRole()
        );
    }

    public void resetPassword(String email, String newPassword) {
        List<User> users = userRepository.findAllByEmailOrderByIdAsc(email);
        if (users == null || users.isEmpty()) {
            throw new RuntimeException("No user found with email: " + email);
        }
        String encoded = passwordEncoder.encode(newPassword);
        for (User user : users) {
            user.setPassword(encoded);
            userRepository.save(user);
        }
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}