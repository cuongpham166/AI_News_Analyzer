package com.example.news.api.dto.internal;

public class TopicDistribution {
    private String name;
    private long count;


    public TopicDistribution() {
    }

    public TopicDistribution(String name, long count) {
        this.name = name;
        this.count = count;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public long getCount() {
        return this.count;
    }

    public void setCount(long count) {
        this.count = count;
    }

    @Override
    public String toString() {
        return "{" +
            " name='" + getName() + "'" +
            ", count='" + getCount() + "'" +
            "}";
    }

}
