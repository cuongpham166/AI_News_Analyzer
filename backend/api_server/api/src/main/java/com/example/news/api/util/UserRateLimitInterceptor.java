package com.example.news.api.util;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class UserRateLimitInterceptor implements HandlerInterceptor {
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    //the limit: 5 tokens max, refills 5 tokens every 1 minute
    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(5, Refill.intervally(5, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String method = request.getMethod();
        if (!"POST".equals(method) && !"DELETE".equals(method)) {
            return true;
        }
        String userId = getUserIdFromSecurityContext();
        if (userId == null) {
            return true;
        }

        // Get or create the bucket for this specific user
        Bucket bucket = cache.computeIfAbsent(userId, k -> createNewBucket());

        if(bucket.tryConsume(1)){
            return true;
        }else{
            response.setStatus(429);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Too many reactions. Please wait a minute.\"}");
            return false;
        }
    }

    private String getUserIdFromSecurityContext() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof Jwt jwt) {
                return jwt.getSubject();
            }
        } catch (Exception e) {

        }
        return null;
    }

}
