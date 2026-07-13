package com.example.news.api.dto.response.admin;

public class UserEventResponse {
    private String eventType;
    private String userId;
    private String clientId;
    private String ipAddress;
    private Long timestamp;

    public UserEventResponse() {
    }

    public UserEventResponse(String eventType, String userId, String clientId, String ipAddress, Long timestamp) {
        this.eventType = eventType;
        this.userId = userId;
        this.clientId = clientId;
        this.ipAddress = ipAddress;
        this.timestamp = timestamp;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public String toString() {
        return "UserEventDTO{" +
                "eventType='" + eventType + '\'' +
                ", userId='" + userId + '\'' +
                ", clientId='" + clientId + '\'' +
                ", ipAddress='" + ipAddress + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
