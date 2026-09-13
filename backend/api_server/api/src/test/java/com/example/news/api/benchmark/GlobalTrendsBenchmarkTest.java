package com.example.news.api.benchmark;

import com.example.news.api.dto.response.analysis.index.GlobalTrendsResponse;
import com.example.news.api.repository.analysis.AnalyticsRepository;
import com.example.news.api.repository.analysis.IndexAnalysisRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestConstructor;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@TestConstructor(
        autowireMode = TestConstructor.AutowireMode.ALL
)
public class GlobalTrendsBenchmarkTest {
    private static final int WARMUP_RUNS = 5;
    private static final int MEASURED_RUNS = 20;

    @Autowired
    private final AnalyticsRepository analyticsRepository;

    @Autowired
    private final IndexAnalysisRepository indexAnalysisRepository;

    GlobalTrendsBenchmarkTest(
            AnalyticsRepository analyticsRepository,
            IndexAnalysisRepository indexAnalysisRepository
    ) {
        this.analyticsRepository = analyticsRepository;
        this.indexAnalysisRepository = indexAnalysisRepository;
    }

    private long nanosToMillis(long nanos) {
        return Math.round(nanos / 1_000_000.0);
    }

    @Test
    void benchmarkGlobalTrends() {
        String intervalUnit = "month";
        int amount = 12;
        String calendarInterval = "day";

        Supplier<GlobalTrendsResponse> elastic =
                () -> {
                    try {
                        return indexAnalysisRepository.getGlobalTrendsWithRelativeInterval(
                                intervalUnit,
                                amount,
                                calendarInterval
                        );
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
                };

        Supplier<GlobalTrendsResponse> clickHouse =
                () -> analyticsRepository.getAnalyticsGlobalTrendsWithRelativeInterval(
                        intervalUnit,
                        amount,
                        calendarInterval
                );


        System.out.println();
        System.out.println("========================================");
        System.out.println(" GLOBAL TRENDS BENCHMARK");
        System.out.println("========================================");
        System.out.println("Interval unit:     " + intervalUnit);
        System.out.println("Amount:            " + amount);
        System.out.println("Calendar interval: " + calendarInterval);
        System.out.println("Warmup runs:       " + WARMUP_RUNS);
        System.out.println("Measured runs:     " + MEASURED_RUNS);

        System.out.println();
        System.out.println("Warming up...");
        for (int i = 0; i < WARMUP_RUNS; i++) {
            elastic.get();
            clickHouse.get();
            System.out.println( "Warmup " + (i + 1) +"/" + WARMUP_RUNS);
        }

        List<Long> elasticTimes = new ArrayList<>();
        List<Long> clickHouseTimes =new ArrayList<>();

        System.out.println();
        System.out.println("Starting benchmark...");

        for (int i = 0; i < MEASURED_RUNS; i++) {
            if (i % 2 == 0) {
                long start = System.nanoTime();
                GlobalTrendsResponse elasticResult = elastic.get();
                long elapsed = System.nanoTime() - start;
                assertNotNull(elasticResult);
                elasticTimes.add(nanosToMillis(elapsed));

                start = System.nanoTime();
                GlobalTrendsResponse clickHouseResult = clickHouse.get();
                elapsed = System.nanoTime() - start;
                assertNotNull(clickHouseResult);
                clickHouseTimes.add(nanosToMillis(elapsed));

            } else {
                long start = System.nanoTime();
                GlobalTrendsResponse clickHouseResult = clickHouse.get();
                long elapsed = System.nanoTime() - start;
                assertNotNull(clickHouseResult);
                clickHouseTimes.add(nanosToMillis(elapsed));

                start = System.nanoTime();
                GlobalTrendsResponse elasticResult = elastic.get();
                elapsed = System.nanoTime() - start;
                assertNotNull(elasticResult);
                elasticTimes.add(nanosToMillis(elapsed));
            }

            System.out.println("Run " + (i + 1) +
                    "/" + MEASURED_RUNS +
                    " completed"
            );
        }

        BenchmarkResult elasticResult = new BenchmarkResult("Elasticsearch", elasticTimes);
        BenchmarkResult clickHouseResult = new BenchmarkResult("ClickHouse", clickHouseTimes);
        elasticResult.print();
        clickHouseResult.print();
    }
}
