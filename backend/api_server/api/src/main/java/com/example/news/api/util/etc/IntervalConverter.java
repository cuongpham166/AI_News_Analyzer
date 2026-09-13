package com.example.news.api.util.etc;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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

    public Instant[] computeDateRangeRelative(String intervalUnit,int amount) {
        Instant end = Instant.now();

        ZonedDateTime start =
                end.atZone(ZoneOffset.UTC);

        int negativeAmount = -Math.abs(amount);

        switch (intervalUnit.trim().toLowerCase()) {
            case "day":
                start = start.plusDays(negativeAmount);
                break;

            case "week":
                start = start.plusWeeks(negativeAmount);
                break;

            case "month":
                start = start.plusMonths(negativeAmount);
                break;

            case "year":
                start = start.plusYears(negativeAmount);
                break;

            default:
                throw new IllegalArgumentException(
                        "Unsupported interval unit: " + intervalUnit
                );
        }

        return new Instant[]{start.toInstant(),end};
    }


}
