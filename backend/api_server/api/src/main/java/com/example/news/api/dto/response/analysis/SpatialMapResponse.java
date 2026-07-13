package com.example.news.api.dto.response.analysis;

public class SpatialMapResponse {
    private String location;
    private int count;


    public SpatialMapResponse() {
    }

    public SpatialMapResponse(String location, int count) {
        this.location = location;
        this.count = count;
    }

    public String getLocation() {
        return this.location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public int getCount() {
        return this.count;
    }

    public void setCount(int count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "{" +
            " location='" + getLocation() + "'" +
            ", count='" + getCount() + "'" +
            "}";
    }

}
