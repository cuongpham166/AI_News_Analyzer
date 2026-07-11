package com.example.news.api.shared;

public class UserSearchRequest {
    private String value;
    private boolean exact;

    public UserSearchRequest() {
    }

    public UserSearchRequest(String value, boolean exact) {
        this.value = value;
        this.exact = exact;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public boolean isExact() {
        return exact;
    }

    public void setExact(boolean exact) {
        this.exact = exact;
    }
}
