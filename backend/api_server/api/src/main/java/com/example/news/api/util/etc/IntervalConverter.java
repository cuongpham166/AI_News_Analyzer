package com.example.news.api.util.etc;

import java.util.Calendar;
import java.util.TimeZone;

import org.springframework.stereotype.Component;

import co.elastic.clients.elasticsearch._types.aggregations.*;

@Component
public class IntervalConverter {
    public long[] computeEpochRangeRelative(String intervalUnit, int amount) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeZone(TimeZone.getTimeZone("UTC"));

        long end = cal.getTimeInMillis() / 1000;

        int negativeAmount = -Math.abs(amount);

        switch (intervalUnit.toLowerCase()) {
            case "day":   cal.add(Calendar.DAY_OF_MONTH, negativeAmount); break;
            case "week":  cal.add(Calendar.WEEK_OF_YEAR, negativeAmount); break;
            case "month": cal.add(Calendar.MONTH, negativeAmount); break;
            default: throw new IllegalArgumentException("Unsupported: " + intervalUnit);
        }

        long start = cal.getTimeInMillis() / 1000; // Convert to seconds
        return new long[]{start, end};
    }

    public CalendarInterval mapInterval(String intervalUnit) {
        return switch (intervalUnit.toLowerCase()) {
            case "day" -> CalendarInterval.Day;
            case "week" -> CalendarInterval.Week;
            case "month" -> CalendarInterval.Month;
            default -> throw new IllegalArgumentException("Unsupported interval: " + intervalUnit);
        };
    }


    public long[] computeEpochRangeRelativeForNeo4j(String intervalUnit, int amount) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeZone(TimeZone.getTimeZone("UTC"));
        long end = cal.getTimeInMillis();
        int negativeAmount = -Math.abs(amount);
        switch (intervalUnit.toLowerCase()) {
            case "day":   cal.add(Calendar.DAY_OF_MONTH, negativeAmount); break;
            case "week":  cal.add(Calendar.WEEK_OF_YEAR, negativeAmount); break;
            case "month": cal.add(Calendar.MONTH, negativeAmount); break;
            default: throw new IllegalArgumentException("Unsupported: " + intervalUnit);
        }
        long start = cal.getTimeInMillis();
        return new long[]{start, end};
    }

}
