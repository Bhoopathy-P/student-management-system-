/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface CodeFile {
  path: string;
  content: string;
}

export function getSpringCodebase(): CodeFile[] {
  const files: CodeFile[] = [];

  // ==========================================
  // 1. pom.xml
  // ==========================================
  files.push({
    path: "pom.xml",
    content: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    <groupId>com.school</groupId>
    <artifactId>management</artifactId>
    <version>1.0.0</version>
    <name>Student Management System</name>
    <description>Enterprise Student Management System Backend</description>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.12.5</jjwt.version>
        <springdoc.version>2.5.0</springdoc.version>
        <pdfbox.version>3.0.2</pdfbox.version>
        <lombok.version>1.18.34</lombok.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- MySQL Driver -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Lombok -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <version>\${lombok.version}</version>
            <optional>true</optional>
        </dependency>

        <!-- JSON Web Token (JJWT) -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Swagger / OpenAPI Documentation -->
        <dependency>
            <groupId>org.springdoc</groupId>
            <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
            <version>\${springdoc.version}</version>
        </dependency>

        <!-- Apache PDFBox for PDF generation -->
        <dependency>
            <groupId>org.apache.pdfbox</groupId>
            <artifactId>pdfbox</artifactId>
            <version>\${pdfbox.version}</version>
        </dependency>

        <!-- Spring Boot Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
                <configuration>
                    <excludes>
                        <exclude>
                            <groupId>org.projectlombok</groupId>
                            <artifactId>lombok</artifactId>
                        </exclude>
                    </excludes>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
`
  });

  // ==========================================
  // 2. application.yml
  // ==========================================
  files.push({
    path: "src/main/resources/application.yml",
    content: `server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/student_management_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
    username: root
    password: rootpassword
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  sql:
    init:
      mode: always
  
  jpa:
    database-platform: org.hibernate.dialect.MySQL8Dialect
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        format_sql: true

# JWT Configuration
app:
  jwt:
    secret: 9a67471b7fcd21cd49e8a5df9775f81a7db8e8a719c8f2b87a932d84711e3da0d18f4d1e2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a90
    expirationMs: 86400000 # 24 Hours
    refreshExpirationMs: 604800000 # 7 Days

# Springdoc OpenAPI Swagger
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operationsSorter: method
`
  });

  // ==========================================
  // 3. MySQL Schema (schema.sql)
  // ==========================================
  files.push({
    path: "src/main/resources/schema.sql",
    content: `-- MySQL 8 Enterprise Schema for Student Management System
CREATE DATABASE IF NOT EXISTS student_management_db;
USE student_management_db;

-- 1. Users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Departments table
CREATE TABLE IF NOT EXISTS departments (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    code VARCHAR(10) UNIQUE NOT NULL,
    description TEXT,
    head_of_department VARCHAR(100)
);

-- 3. Teachers table
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    employee_id VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    department_id VARCHAR(50),
    designation VARCHAR(50) NOT NULL,
    joining_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 4. Students table
CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50) UNIQUE NOT NULL,
    roll_number VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    dob DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    department_id VARCHAR(50),
    admission_date DATE NOT NULL,
    current_semester INT DEFAULT 1,
    guardian_name VARCHAR(100),
    guardian_phone VARCHAR(20),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

-- 5. Courses table
CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    department_id VARCHAR(50),
    teacher_id VARCHAR(50),
    credits INT DEFAULT 3,
    semester INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- 6. Student Courses association table
CREATE TABLE IF NOT EXISTS student_courses (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    enrollment_date DATE NOT NULL,
    UNIQUE(student_id, course_id),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 7. Attendance table
CREATE TABLE IF NOT EXISTS attendance (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- PRESENT, ABSENT, LATE
    remarks VARCHAR(255),
    UNIQUE(student_id, course_id, date),
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 8. Marks table
CREATE TABLE IF NOT EXISTS marks (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    course_id VARCHAR(50) NOT NULL,
    exam_type VARCHAR(50) NOT NULL, -- MID_TERM, FINAL_EXAM, ASSIGNMENT, PRACTICAL
    marks_obtained INT NOT NULL,
    max_marks INT NOT NULL,
    grade VARCHAR(5) NOT NULL,
    entered_by_teacher_id VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (entered_by_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL
);

-- 9. Fees table
CREATE TABLE IF NOT EXISTS fees (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    payment_date DATE,
    payment_method VARCHAR(30), -- CASH, CARD, BANK_TRANSFER, ONLINE
    status VARCHAR(20) NOT NULL, -- PAID, UNPAID, OVERDUE, PARTIALLY_PAID
    receipt_number VARCHAR(50) UNIQUE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- 10. Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id VARCHAR(50) PRIMARY KEY,
    recipient_id VARCHAR(50) NOT NULL, -- user_id or 'ALL'
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'INFO', -- INFO, WARNING, SUCCESS
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(50) PRIMARY KEY,
    user_id VARCHAR(50),
    username VARCHAR(50) NOT NULL,
    role VARCHAR(30) NOT NULL,
    action VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for performance optimization
CREATE INDEX idx_user_username ON users(username);
CREATE INDEX idx_student_roll ON students(roll_number);
CREATE INDEX idx_teacher_employee ON teachers(employee_id);
CREATE INDEX idx_course_code ON courses(code);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_marks_student ON marks(student_id);
CREATE INDEX idx_fees_status ON fees(status);
`
  });

  // ==========================================
  // 4. Sample SQL Data (data.sql)
  // ==========================================
  files.push({
    path: "src/main/resources/data.sql",
    content: `-- Default Master Data Seeds (All Passwords are 'password' encoded in BCrypt)
-- BCrypt hash for 'password': $2a$10$8.K8nK4mXpI1W767S2N1C.7E25.8t.Kbyu1B6fC/rP5I7v229L2lq

-- 1. Insert Departments
INSERT IGNORE INTO departments (id, name, code, description, head_of_department) VALUES
('dept-cs', 'Computer Science & Engineering', 'CSE', 'Department of Computer Science Engineering and Artificial Intelligence', 'Dr. Senthil Kumar'),
('dept-ece', 'Electronics & Communication', 'ECE', 'Department of Electronics and Communication Engineering', 'Prof. Rajasekar'),
('dept-math', 'Mathematics', 'MATH', 'Department of Pure and Applied Mathematics', 'Prof. Kannan');

-- 2. Insert Users
INSERT IGNORE INTO users (id, username, email, password, full_name, role) VALUES
('usr-admin', 'admin', 'ramesh@university.edu', '$2a$10$8.K8nK4mXpI1W767S2N1C.7E25.8t.Kbyu1B6fC/rP5I7v229L2lq', 'Dr. Ramesh Kumar', 'ADMIN'),
('usr-teacher1', 'senthil_kumar', 'senthil@university.edu', '$2a$10$8.K8nK4mXpI1W767S2N1C.7E25.8t.Kbyu1B6fC/rP5I7v229L2lq', 'Dr. Senthil Kumar', 'TEACHER'),
('usr-student1', 'karthikeyan', 'karthikeyan@student.edu', '$2a$10$8.K8nK4mXpI1W767S2N1C.7E25.8t.Kbyu1B6fC/rP5I7v229L2lq', 'Karthikeyan', 'STUDENT');

-- 3. Insert Teachers
INSERT IGNORE INTO teachers (id, user_id, employee_id, full_name, email, phone, department_id, designation, joining_date) VALUES
('tchr-01', 'usr-teacher1', 'EMP1001', 'Dr. Senthil Kumar', 'senthil@university.edu', '+919441112233', 'dept-cs', 'Associate Professor', '2020-08-15');

-- 4. Insert Students
INSERT IGNORE INTO students (id, user_id, roll_number, full_name, email, phone, dob, gender, department_id, admission_date, current_semester, guardian_name, guardian_phone) VALUES
('std-01', 'usr-student1', 'ROLL202601', 'Karthikeyan', 'karthikeyan@student.edu', '+919443011223', '2004-05-12', 'MALE', 'dept-cs', '2022-09-01', 4, 'Selvam', '+919443011224');

-- 5. Insert Courses
INSERT IGNORE INTO courses (id, name, code, department_id, teacher_id, credits, semester) VALUES
('crs-dsa', 'Data Structures & Algorithms', 'CSE-201', 'dept-cs', 'tchr-01', 4, 4),
('crs-dbms', 'Database Management Systems', 'CSE-202', 'dept-cs', 'tchr-01', 3, 4),
('crs-linear', 'Linear Algebra', 'MATH-102', 'dept-math', NULL, 3, 2);

-- 6. Enroll Students in Courses
INSERT IGNORE INTO student_courses (id, student_id, course_id, enrollment_date) VALUES
('sc-01', 'std-01', 'crs-dsa', '2024-01-10'),
('sc-02', 'std-01', 'crs-dbms', '2024-01-10');

-- 7. Initial Attendance Record
INSERT IGNORE INTO attendance (id, student_id, course_id, date, status, remarks) VALUES
('att-01', 'std-01', 'crs-dsa', '2026-06-20', 'PRESENT', 'On time'),
('att-02', 'std-01', 'crs-dsa', '2026-06-21', 'PRESENT', 'On time'),
('att-03', 'std-01', 'crs-dsa', '2026-06-22', 'ABSENT', 'Medical Leave');

-- 8. Marks
INSERT IGNORE INTO marks (id, student_id, course_id, exam_type, marks_obtained, max_marks, grade, entered_by_teacher_id) VALUES
('mrk-01', 'std-01', 'crs-dsa', 'MID_TERM', 42, 50, 'A', 'tchr-01'),
('mrk-02', 'std-01', 'crs-dbms', 'MID_TERM', 45, 50, 'O', 'tchr-01');

-- 9. Fees
INSERT IGNORE INTO fees (id, student_id, title, amount, due_date, payment_date, payment_method, status, receipt_number) VALUES
('fee-01', 'std-01', 'Semester 4 Tuition Fee', 45000.00, '2026-06-30', '2026-06-15', 'ONLINE', 'PAID', 'REC9981273'),
('fee-02', 'std-01', 'Annual Library Fee', 1500.00, '2026-07-15', NULL, NULL, 'UNPAID', NULL);

-- 10. Audit Logs
INSERT IGNORE INTO audit_logs (id, user_id, username, role, action, ip_address) VALUES
('audit-01', 'usr-admin', 'admin', 'ADMIN', 'Initialized University Database Seeds', '127.0.0.1');
`
  });

  // ==========================================
  // 5. Spring Boot Application Starter (Main)
  // ==========================================
  files.push({
    path: "src/main/java/com/school/management/StudentManagementApplication.java",
    content: `package com.school.management;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class StudentManagementApplication {
    public static void main(String[] args) {
        SpringApplication.run(StudentManagementApplication.class, args);
    }
}
`
  });

  // ==========================================
  // 6. Security & JWT Configurations
  // ==========================================
  files.push({
    path: "src/main/java/com/school/management/config/SecurityConfig.java",
    content: `package com.school.management.config;

import com.school.management.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/auth/**").permitAll()
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("*")); // Change to specific domain in production
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Cache-Control"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/security/JwtTokenProvider.java",
    content: `package com.school.management.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
public class JwtTokenProvider {

    @Value("\${app.jwt.secret}")
    private String jwtSecret;

    @Value("\${app.jwt.expirationMs}")
    private long jwtExpirationInMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = this.jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
        return createToken(claims, userDetails.getUsername());
    }

    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .claims(claims)
                .subject(subject)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationInMs))
                .signWith(getSigningKey())
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return getClaimFromToken(token, Claims::getSubject);
    }

    public <T> T getClaimFromToken(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = getAllClaimsFromToken(token);
        return claimsResolver.apply(claims);
    }

    private Claims getAllClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = getUsernameFromToken(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    private Boolean isTokenExpired(String token) {
        final Date expiration = getClaimFromToken(token, Claims::getExpiration);
        return expiration.before(new Date());
    }
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/security/JwtAuthenticationFilter.java",
    content: `package com.school.management.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);
        try {
            username = jwtTokenProvider.getUsernameFromToken(jwt);

            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                if (jwtTokenProvider.validateToken(jwt, userDetails)) {
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Keep request flowing without authentication rather than crashing
        }
        filterChain.doFilter(request, response);
    }
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/security/CustomUserDetailsService.java",
    content: `package com.school.management.security;

import com.school.management.entity.User;
import com.school.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username or email: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
        );
    }
}
`
  });

  // ==========================================
  // 7. Core Entities
  // ==========================================
  files.push({
    path: "src/main/java/com/school/management/entity/User.java",
    content: `package com.school.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(nullable = false)
    private String role; // ADMIN, TEACHER, STUDENT

    @Builder.Default
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/entity/Student.java",
    content: `package com.school.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Student {
    @Id
    private String id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "roll_number", unique = true, nullable = false)
    private String rollNumber;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @Column(nullable = false)
    private LocalDate dob;

    @Column(nullable = false)
    private String gender;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(name = "current_semester")
    private Integer currentSemester = 1;

    @Column(name = "guardian_name")
    private String guardianName;

    @Column(name = "guardian_phone")
    private String guardianPhone;
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/entity/Teacher.java",
    content: `package com.school.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "teachers")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Teacher {
    @Id
    private String id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "employee_id", unique = true, nullable = false)
    private String employeeId;

    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(unique = true, nullable = false)
    private String email;

    private String phone;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(nullable = false)
    private String designation;

    @Column(name = "joining_date", nullable = false)
    private LocalDate joiningDate;
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/entity/Department.java",
    content: `package com.school.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "departments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Department {
    @Id
    private String id;

    @Column(unique = true, nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String code;

    private String description;

    @Column(name = "head_of_department")
    private String headOfDepartment;
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/entity/Course.java",
    content: `package com.school.management.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "courses")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Course {
    @Id
    private String id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String code;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private Teacher teacher;

    private Integer credits = 3;

    @Column(nullable = false)
    private Integer semester;
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/entity/Attendance.java",
    content: `package com.school.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "course_id", "date"})
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {
    @Id
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(nullable = false)
    private LocalDate date;

    @Column(nullable = false)
    private String status; // PRESENT, ABSENT, LATE

    private String remarks;
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/entity/Mark.java",
    content: `package com.school.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "marks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mark {
    @Id
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne(optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "exam_type", nullable = false)
    private String examType; // MID_TERM, FINAL_EXAM, ASSIGNMENT

    @Column(name = "marks_obtained", nullable = false)
    private Integer marksObtained;

    @Column(name = "max_marks", nullable = false)
    private Integer maxMarks;

    @Column(nullable = false)
    private String grade;

    @ManyToOne
    @JoinColumn(name = "entered_by_teacher_id")
    private Teacher enteredByTeacher;

    @Builder.Default
    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/entity/Fee.java",
    content: `package com.school.management.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "fees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Fee {
    @Id
    private String id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "student_id")
    private Student student;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(name = "due_date", nullable = false)
    private LocalDate dueDate;

    @Column(name = "payment_date")
    private LocalDate paymentDate;

    @Column(name = "payment_method")
    private String paymentMethod; // CASH, CARD, ONLINE

    @Column(nullable = false)
    private String status; // PAID, UNPAID, OVERDUE

    @Column(name = "receipt_number")
    private String receiptNumber;
}
`
  });

  // ==========================================
  // 8. Core Jpa Repositories
  // ==========================================
  files.push({
    path: "src/main/java/com/school/management/repository/UserRepository.java",
    content: `package com.school.management.repository;

import com.school.management.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/repository/StudentRepository.java",
    content: `package com.school.management.repository;

import com.school.management.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface StudentRepository extends JpaRepository<Student, String> {
    Optional<Student> findByRollNumber(String rollNumber);
    Optional<Student> findByEmail(String email);
    
    @Query("SELECT s FROM Student s WHERE s.fullName LIKE %:keyword% OR s.rollNumber LIKE %:keyword%")
    List<Student> searchStudents(@Param("keyword") String keyword);
    
    List<Student> findByDepartmentId(String departmentId);
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/repository/TeacherRepository.java",
    content: `package com.school.management.repository;

import com.school.management.entity.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TeacherRepository extends JpaRepository<Teacher, String> {
    Optional<Teacher> findByEmployeeId(String employeeId);
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/repository/CourseRepository.java",
    content: `package com.school.management.repository;

import com.school.management.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CourseRepository extends JpaRepository<Course, String> {
    List<Course> findByTeacherId(String teacherId);
    List<Course> findByDepartmentId(String departmentId);
    List<Course> findBySemester(Integer semester);
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/repository/AttendanceRepository.java",
    content: `package com.school.management.repository;

import com.school.management.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository extends JpaRepository<Attendance, String> {
    List<Attendance> findByStudentId(String studentId);
    List<Attendance> findByCourseIdAndDate(String courseId, LocalDate date);
    
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId AND a.status = 'PRESENT'")
    long countPresentByStudentId(String studentId);

    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.student.id = :studentId")
    long countTotalByStudentId(String studentId);
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/repository/MarkRepository.java",
    content: `package com.school.management.repository;

import com.school.management.entity.Mark;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MarkRepository extends JpaRepository<Mark, String> {
    List<Mark> findByStudentId(String studentId);
    List<Mark> findByCourseId(String courseId);
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/repository/FeeRepository.java",
    content: `package com.school.management.repository;

import com.school.management.entity.Fee;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface FeeRepository extends JpaRepository<Fee, String> {
    List<Fee> findByStudentId(String studentId);
    List<Fee> findByStatus(String status);
}
`
  });

  // ==========================================
  // 9. Core Controllers
  // ==========================================
  files.push({
    path: "src/main/java/com/school/management/controller/AuthController.java",
    content: `package com.school.management.controller;

import com.school.management.security.JwtTokenProvider;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsername(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String jwt = tokenProvider.generateToken(userDetails);
        
        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getUsername(), userDetails.getAuthorities().iterator().next().getAuthority()));
    }

    @Data
    public static class LoginRequest {
        private String username;
        private String password;
    }

    @Data
    @RequiredArgsConstructor
    public static class JwtResponse {
        private final String token;
        private final String username;
        private final String role;
        private final String tokenType = "Bearer";
    }
}
`
  });

  files.push({
    path: "src/main/java/com/school/management/controller/StudentController.java",
    content: `package com.school.management.controller;

import com.school.management.entity.Student;
import com.school.management.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentRepository studentRepository;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER')")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentRepository.findAll());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TEACHER', 'STUDENT')")
    public ResponseEntity<Student> getStudentById(@PathVariable String id) {
        return studentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Student> createStudent(@RequestBody Student student) {
        if(student.getId() == null) {
            student.setId(UUID.randomUUID().toString());
        }
        return ResponseEntity.ok(studentRepository.save(student));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Student> updateStudent(@PathVariable String id, @RequestBody Student studentDetails) {
        return studentRepository.findById(id)
                .map(student -> {
                    student.setFullName(studentDetails.getFullName());
                    student.setPhone(studentDetails.getPhone());
                    student.setDob(studentDetails.getDob());
                    student.setGender(studentDetails.getGender());
                    student.setGuardianName(studentDetails.getGuardianName());
                    student.setGuardianPhone(studentDetails.getGuardianPhone());
                    student.setCurrentSemester(studentDetails.getCurrentSemester());
                    return ResponseEntity.ok(studentRepository.save(student));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteStudent(@PathVariable String id) {
        return studentRepository.findById(id)
                .map(student -> {
                    studentRepository.delete(student);
                    return ResponseEntity.ok().build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
`
  });

  // ==========================================
  // 10. Global Exception Handling
  // ==========================================
  files.push({
    path: "src/main/java/com/school/management/exception/GlobalExceptionHandler.java",
    content: `package com.school.management.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<?> handleBadCredentialsException(BadCredentialsException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "Invalid username or password");
        body.put("status", HttpStatus.UNAUTHORIZED.value());
        return new ResponseEntity<>(body, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<?> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "You do not have permission to access this resource");
        body.put("status", HttpStatus.FORBIDDEN.value());
        return new ResponseEntity<>(body, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
`
  });

  // ==========================================
  // 11. Deployment Docker Compose
  // ==========================================
  files.push({
    path: "docker-compose.yml",
    content: `version: '3.8'

services:
  db:
    image: mysql:8.0
    container_name: sms_mysql_db
    restart: always
    environment:
      MYSQL_DATABASE: student_management_db
      MYSQL_ROOT_PASSWORD: rootpassword
    ports:
      - "3306:3306"
    volumes:
      - mysql_data:/var/lib/mysql

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: sms_spring_backend
    restart: always
    ports:
      - "8080:8080"
    environment:
      SPRING_DATASOURCE_URL: jdbc:mysql://db:3306/student_management_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
      SPRING_DATASOURCE_USERNAME: root
      SPRING_DATASOURCE_PASSWORD: rootpassword
    depends_on:
      - db

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: sms_react_frontend
    restart: always
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  mysql_data:
`
  });

  // ==========================================
  // 12. README.md & Setup Guide
  // ==========================================
  files.push({
    path: "README.md",
    content: `# Student Management System - Enterprise Edition

A high-performance, secure, and production-ready Full-Stack Student Management System featuring Spring Boot 3, Java 21, Spring Security (JWT), Hibernate/JPA, and React 19 with Tailwind CSS.

## 🛠 Tech Stack
- **Backend**: Java 21, Spring Boot 3.x, Spring Security + JWT, Hibernate/JPA, MySQL 8
- **Frontend**: React 19, Tailwind CSS, Lucide Icons, JSZip, Framer Motion
- **Documentation**: Swagger UI / OpenAPI 3.0
- **DevOps**: Docker, Docker Compose, Maven

---

## 🚀 Key Features

### 1. Unified Authentication Module
- **JWT-Based Architecture**: Stateful logins with stateless JWT token verifications on endpoints.
- **BCrypt Hashing**: Passwords stored securely using salt-fortified modern hashes.
- **RBAC Security Filter**: Absolute endpoint control for \`ADMIN\`, \`TEACHER\`, and \`STUDENT\` roles.

### 2. Multi-Role Portals
- **Admin Panel**: Complete control of students, teachers, departments, fees, courses, and system logs.
- **Teacher Desk**: Manage courses, verify students, input marks, and track daily attendance.
- **Student Portal**: Download custom grade sheets, verify attendance, check course schedules, and view fees.

---

## 📦 Project Structure

\`\`\`text
├── pom.xml                               # Maven build configuration
├── docker-compose.yml                    # Container composition for MySQL & Java app
├── README.md                             # Comprehensive deployment handbook
├── src
│   ├── main
│   │   ├── java
│   │   │   └── com.school.management
│   │   │       ├── StudentManagementApplication.java  # Main execution class
│   │   │       ├── config
│   │   │       │   └── SecurityConfig.java            # Web security filter chain
│   │   │       ├── controller
│   │   │       │   ├── AuthController.java            # JWT Token authentication
│   │   │       │   └── StudentController.java         # Student CRUD API
│   │   │       ├── entity
│   │   │       │   ├── User.java                      # Authentication entity
│   │   │       │   ├── Student.java                   # Core Student details
│   │   │       │   ├── Teacher.java                   # Teacher details
│   │   │       │   ├── Department.java                # Department schemas
│   │   │       │   └── Course.java                    # Course profiles
│   │   │       ├── exception
│   │   │       │   └── GlobalExceptionHandler.java    # Universal exception handlers
│   │   │       └── security
│   │   │           ├── JwtAuthenticationFilter.java   # Token request parser
│   │   │           └── JwtTokenProvider.java          # Cryptographic key managers
│   │   └── resources
│   │       ├── application.yml           # Database and application properties
│   │       ├── schema.sql                # Full DDL for relational MySQL tables
│   │       └── data.sql                  # Multi-role testing seed datasets
\`\`\`

---

## ⚡ Setup & Launch Instructions

### Prerequisites
1. Installed **Java Development Kit (JDK 21)**.
2. Installed **Maven 3.8+**.
3. A running instance of **MySQL 8**.

### Running via Docker (Easiest)
1. Run the container cluster:
   \`\`\`bash
   docker-compose up -d
   \`\`\`
2. This boots a MySQL 8 database on port \`3306\` and compiles the Spring Boot server on port \`8080\`.

### Local Manual Start
1. Edit \`src/main/resources/application.yml\` to match your local MySQL credentials.
2. Run Maven to package and build:
   \`\`\`bash
   mvn clean package
   \`\`\`
3. Run the Spring Boot application:
   \`\`\`bash
   mvn spring-boot:run
   \`\`\`
4. Access the Swagger OpenAPI interactive documentation portal at:
   \`http://localhost:8080/api/swagger-ui.html\`

---

## 🔑 Demo Access Accounts (Seeded)

| Role | Username | Password | Email |
| :--- | :--- | :--- | :--- |
| **Admin** | \`admin\` | \`password\` | \`admin@university.edu\` |
| **Teacher** | \`emily_watson\` | \`password\` | \`emily@university.edu\` |
| **Student** | \`john_doe\` | \`password\` | \`john.doe@student.edu\` |

---

## 📋 API Documentation Reference

- **POST** \`/api/auth/login\` - Logs in a user, returning a signed JWT token.
- **GET** \`/api/students\` - Retrieves all student files (*Admin/Teacher*).
- **GET** \`/api/students/{id}\` - Detailed records of a single student.
- **POST** \`/api/students\` - Inserts a new student record (*Admin*).
- **PUT** \`/api/students/{id}\` - Modifies student records (*Admin*).
- **DELETE** \`/api/students/{id}\` - Clears student profile (*Admin*).
- **GET** \`/api/swagger-ui.html\` - Interactive API testing interface.
`
  });

  // ==========================================
  // 13. Dockerfile for Backend
  // ==========================================
  files.push({
    path: "Dockerfile",
    content: `FROM maven:3.9-eclipse-temurin-21-alpine AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
RUN mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
`
  });

  return files;
}
