package com.example.news.api.benchmark;

import java.util.List;

public class BenchmarkResult {
    private final String database;
    private final List<Long> timesMs;

    public BenchmarkResult(
            String database,
            List<Long> timesMs
    ){
        this.database = database;
        this.timesMs = timesMs;
    }

    public String getDatabase() {
        return database;
    }

    public List<Long> getTimesMs() {
        return timesMs;
    }

    public double getAverage() {
        return timesMs
                .stream()
                .mapToLong(Long::longValue)
                .average()
                .orElse(0);
    }

    public long getMin() {
        return timesMs
                .stream()
                .mapToLong(Long::longValue)
                .min()
                .orElse(0);
    }

    public long getMax() {
        return timesMs
                .stream()
                .mapToLong(Long::longValue)
                .max()
                .orElse(0);
    }

    public double getMedian() {
        List<Long> sorted = timesMs
                .stream()
                .sorted()
                .toList();

        int size = sorted.size();

        if (size % 2 == 0) {
            return (sorted.get(size / 2 - 1)+ sorted.get(size / 2)) / 2.0;
        }

        return sorted.get(size / 2);
    }

    public double getPercentile(double percentile) {

        List<Long> sorted =timesMs
                .stream()
                .sorted()
                .toList();

        if (sorted.isEmpty()) {
            return 0;
        }

        double index =
                percentile * (sorted.size() - 1);

        int lower = (int) Math.floor(index);
        int upper = (int) Math.ceil(index);

        if (lower == upper) {
            return sorted.get(lower);
        }

        double weight = index - lower;

        return sorted.get(lower)
                + weight *
                (sorted.get(upper) - sorted.get(lower));
    }

    public double getStandardDeviation() {

        double average = getAverage();

        double variance =
                timesMs.stream()
                        .mapToDouble(
                                time -> Math.pow(
                                        time - average,
                                        2
                                )
                        )
                        .average()
                        .orElse(0);

        return Math.sqrt(variance);
    }

    public void print() {
        System.out.println();
        System.out.println("========== " +database +" ==========");
        System.out.println("Runs:    " + timesMs.size());
        System.out.printf("Min:     %.2f ms%n",(double) getMin());
        System.out.printf("Median:  %.2f ms%n",getMedian());
        System.out.printf("Average: %.2f ms%n",getAverage());
        System.out.printf("P95:     %.2f ms%n",getPercentile(0.95));
        System.out.printf("Max:     %.2f ms%n", (double) getMax());
        System.out.printf("Std Dev: %.2f ms%n", getStandardDeviation());
    }
}
