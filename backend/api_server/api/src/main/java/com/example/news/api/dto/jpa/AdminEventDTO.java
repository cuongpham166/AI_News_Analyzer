package com.example.news.api.dto.jpa;

public class AdminEventDTO {
    private String operationType;
    private String resourceType;
    private String resourcePath;
    private String adminUserId;
    private Long timestamp;

    public AdminEventDTO() {
    }

    public AdminEventDTO(String operationType, Long timestamp, String adminUserId, String resourcePath, String resourceType) {
        this.operationType = operationType;
        this.timestamp = timestamp;
        this.adminUserId = adminUserId;
        this.resourcePath = resourcePath;
        this.resourceType = resourceType;
    }

    public String getOperationType() {
        return operationType;
    }

    public void setOperationType(String operationType) {
        this.operationType = operationType;
    }

    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Long timestamp) {
        this.timestamp = timestamp;
    }

    public String getAdminUserId() {
        return adminUserId;
    }

    public void setAdminUserId(String adminUserId) {
        this.adminUserId = adminUserId;
    }

    public String getResourcePath() {
        return resourcePath;
    }

    public void setResourcePath(String resourcePath) {
        this.resourcePath = resourcePath;
    }

    public String getResourceType() {
        return resourceType;
    }

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    @Override
    public String toString() {
        return "AdminEventDTO{" +
                "operationType='" + operationType + '\'' +
                ", resourceType='" + resourceType + '\'' +
                ", resourcePath='" + resourcePath + '\'' +
                ", adminUserId='" + adminUserId + '\'' +
                ", timestamp=" + timestamp +
                '}';
    }
}
