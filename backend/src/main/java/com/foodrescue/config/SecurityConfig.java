package com.foodrescue.config;

import com.foodrescue.security.JwtAuthFilter;
import com.foodrescue.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private JwtAuthFilter jwtAuthFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            .csrf(csrf -> csrf.disable())
            .headers(headers -> headers.frameOptions(frame -> frame.disable()))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Public auth endpoints & H2 console
                .requestMatchers("/api/auth/**", "/h2-console/**", "/error").permitAll()
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                // Donor endpoints
                .requestMatchers(HttpMethod.POST, "/api/donations").hasRole("DONOR")
                .requestMatchers(HttpMethod.PUT, "/api/donations/**").hasRole("DONOR")
                .requestMatchers(HttpMethod.DELETE, "/api/donations/**").hasRole("DONOR")
                .requestMatchers("/api/donations/my").hasRole("DONOR")
                // NGO endpoints
                .requestMatchers("/api/donations/*/accept").hasRole("NGO")
                .requestMatchers("/api/pickups/*/complete").hasRole("NGO")
                // Volunteer endpoints
                .requestMatchers("/api/pickups/open").hasAnyRole("VOLUNTEER", "ADMIN")
                .requestMatchers("/api/pickups/*/accept").hasRole("VOLUNTEER")
                .requestMatchers("/api/pickups/*/collected").hasRole("VOLUNTEER")
                .requestMatchers("/api/pickups/*/delivered").hasRole("VOLUNTEER")
                // Shared / Authenticated endpoints
                .requestMatchers("/api/donations/available").hasAnyRole("NGO", "VOLUNTEER", "ADMIN")
                .requestMatchers("/api/pickups/my").hasAnyRole("NGO", "VOLUNTEER")
                .requestMatchers("/api/donations/**").authenticated()
                .requestMatchers("/api/notifications/**").authenticated()
                .anyRequest().authenticated()
            );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
