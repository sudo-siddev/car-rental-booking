package com.carrental.bookingservice.config;

import org.springframework.core.env.Environment;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;

/**
 * Security configuration for API endpoints.
 * Configures CORS, authentication, and authorization rules.
 * API endpoints are open for mock data serving.
 * H2 console access is restricted based on environment profile.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CorsConfigurationSource corsConfigurationSource;
    private final Environment environment;

    public SecurityConfig(CorsConfigurationSource corsConfigurationSource, Environment environment) {
        this.corsConfigurationSource = corsConfigurationSource;
        this.environment = environment;
    }

    /**
     * Check if the application is running in production mode.
     */
    private boolean isProduction() {
        String[] activeProfiles = environment.getActiveProfiles();
        return Arrays.asList(activeProfiles).contains("prod");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        boolean isProd = isProduction();
        
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource));
        
        // Configure authorization based on environment
        if (isProd) {
            // Production configuration: restricted access, security headers enabled
            http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/h2-console/**").denyAll()
                .anyRequest().denyAll()
            )
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.deny())
                .contentSecurityPolicy(csp -> csp.policyDirectives("default-src 'self'"))
            );
        } else {
            // Development configuration: permissive access for development tools
            http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll()
                .requestMatchers("/h2-console/**").permitAll()
                .anyRequest().permitAll()
            )
            .headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.disable())
            );
        }
        
        return http.build();
    }
}

