package com.example.news.api.util.etc;

import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.stereotype.Component;

import java.lang.reflect.Method;
import java.util.StringJoiner;

@Component("methodKeyGenerator")
public class MethodKeyGenerator implements KeyGenerator {
    @Override
    public Object generate(Object target, Method method, Object... params) {
        StringJoiner key = new StringJoiner(":");
        key.add(method.getName());

        for (Object param : params) {
            key.add(String.valueOf(param));
        }

        return key.toString();
    }
}