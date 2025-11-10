package com.carrental.bookingservice.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.env.Environment;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

/**
 * Global exception handler for the application.
 * Provides centralized error handling and logging for all exceptions.
 * Implements security best practices by sanitizing sensitive data in production.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);
    private final Environment environment;
    private static final String[] SENSITIVE_PARAM_NAMES = {
        "password", "passwd", "pwd", "secret", "token", "key", "apiKey", 
        "apikey", "auth", "authorization", "credential", "creditCard", 
        "cardNumber", "cvv", "ssn", "socialSecurityNumber"
    };

    public GlobalExceptionHandler(Environment environment) {
        this.environment = environment;
    }

    /**
     * Check if the application is running in production mode.
     */
    private boolean isProduction() {
        String[] activeProfiles = environment.getActiveProfiles();
        return Arrays.asList(activeProfiles).contains("prod") || 
               (activeProfiles.length == 0 && !Arrays.asList(environment.getDefaultProfiles()).contains("dev"));
    }

    /**
     * Sanitize request parameters to remove sensitive data before logging.
     */
    private Map<String, String[]> sanitizeParameters(Map<String, String[]> parameters) {
        if (parameters == null || parameters.isEmpty()) {
            return parameters;
        }
        
        Map<String, String[]> sanitized = new HashMap<>();
        for (Map.Entry<String, String[]> entry : parameters.entrySet()) {
            String key = entry.getKey().toLowerCase();
            boolean isSensitive = Arrays.stream(SENSITIVE_PARAM_NAMES)
                .anyMatch(sensitive -> key.contains(sensitive.toLowerCase()));
            
            if (isSensitive) {
                sanitized.put(entry.getKey(), new String[]{"[REDACTED]"});
            } else {
                sanitized.put(entry.getKey(), entry.getValue());
            }
        }
        return sanitized;
    }

    /**
     * Sanitize error message for client response based on environment.
     * Returns generic message in production to prevent information leakage.
     */
    private String sanitizeErrorMessage(String message, Exception ex) {
        if (isProduction()) {
            return "An unexpected error occurred. Please try again later.";
        } else {
            return message != null && !message.isEmpty() 
                ? message 
                : "An unexpected error occurred. Please try again later.";
        }
    }

    /**
     * Handles all exceptions and provides a standardized error response.
     * Logs the error with appropriate detail level based on environment.
     * Sanitizes sensitive data in logs and responses.
     *
     * @param ex The exception that was thrown
     * @param request The web request that caused the exception
     * @return ResponseEntity with error details
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleException(Exception ex, WebRequest request) {
        boolean isProd = isProduction();
        String requestUri = request.getDescription(false).replace("uri=", "");
        
        // Log with environment-appropriate detail level
        if (isProd) {
            logger.error("Unhandled exception [{}]: {} - URI: {}", 
                ex.getClass().getSimpleName(), 
                ex.getMessage(), 
                requestUri);
        } else {
            logger.error("Unhandled exception occurred: {}", ex.getMessage(), ex);
        }
        
        // Log request details with sanitization in production
        Map<String, String[]> params = request.getParameterMap();
        if (!params.isEmpty()) {
            Map<String, String[]> sanitizedParams = sanitizeParameters(params);
            if (isProd) {
                logger.error("Request URI: {}, Method: {}, Parameter names: {}", 
                    requestUri,
                    request.getHeader("Request-Method"),
                    sanitizedParams.keySet());
            } else {
                logger.error("Request URI: {}, Method: {}, Parameters: {}", 
                    requestUri,
                    request.getHeader("Request-Method"),
                    sanitizedParams);
            }
        } else {
            logger.error("Request URI: {}, Method: {}", 
                requestUri,
                request.getHeader("Request-Method"));
        }

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", sanitizeErrorMessage(ex.getMessage(), ex));
        errorResponse.put("path", requestUri);

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(errorResponse);
    }

    /**
     * Handles IllegalArgumentException (validation errors).
     * Validation errors are safe to expose to clients.
     *
     * @param ex The exception
     * @param request The web request
     * @return ResponseEntity with error details
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(
            IllegalArgumentException ex, WebRequest request) {
        String requestUri = request.getDescription(false).replace("uri=", "");
        logger.warn("Validation error: {} - Request: {}", ex.getMessage(), requestUri);
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.BAD_REQUEST.value());
        errorResponse.put("error", "Bad Request");
        errorResponse.put("message", ex.getMessage() != null ? ex.getMessage() : "Invalid request parameters");
        errorResponse.put("path", requestUri);

        return ResponseEntity
            .status(HttpStatus.BAD_REQUEST)
            .body(errorResponse);
    }

    /**
     * Handles NullPointerException.
     * Always returns generic message to avoid exposing internal implementation details.
     *
     * @param ex The exception
     * @param request The web request
     * @return ResponseEntity with error details
     */
    @ExceptionHandler(NullPointerException.class)
    public ResponseEntity<Map<String, Object>> handleNullPointerException(
            NullPointerException ex, WebRequest request) {
        boolean isProd = isProduction();
        String requestUri = request.getDescription(false).replace("uri=", "");
        
        if (isProd) {
            logger.error("NullPointerException occurred - URI: {}", requestUri);
        } else {
            logger.error("NullPointerException occurred at: {} - Request: {}", 
                ex.getStackTrace().length > 0 ? ex.getStackTrace()[0] : "unknown", 
                requestUri, ex);
        }
        
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        errorResponse.put("error", "Internal Server Error");
        errorResponse.put("message", "An unexpected error occurred. Please try again later.");
        errorResponse.put("path", requestUri);

        return ResponseEntity
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(errorResponse);
    }
}

