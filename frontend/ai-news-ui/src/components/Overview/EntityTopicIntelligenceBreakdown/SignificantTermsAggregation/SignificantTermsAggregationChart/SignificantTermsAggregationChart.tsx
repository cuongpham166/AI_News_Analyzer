import React, { useCallback, useMemo, useState } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import { Wordcloud } from '@visx/wordcloud';
import { ParentSize } from '@visx/responsive';
import type {
  SignificantTermsType,
  CloudWord,
  TooltipState,
} from '@/shared/interfaces/analysis/ExecutiveOverview/SignificantTermsType.ts';
import CustomChartLegendTooltip from '@/components/generic/CustomChart/CustomChartLegend/CustomChartLegendTooltip.tsx';
interface EntityPolarizationScatterProps {
  data: SignificantTermsType[];
}

const SignificantTermsAggregationChart = ({data}: EntityPolarizationScatterProps) =>  {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const words: CloudWord[] = useMemo(() => {
    return data
      .slice()
      .sort((a, b) => b.score - a.score)
      .slice(0, 40)
      .map((item) => ({
        text: item.term,
        value: item.score * Math.log1p(item.docCount),
      }));
  }, [data]);

  const wordLookup = useMemo(() => {
    return new Map(data.map((item) => [item.term, item]));
  }, [data]);

  const handleHover = useCallback(
    (word: CloudWord, event: React.MouseEvent) => {
      const item = wordLookup.get(word.text);

      if (!item) {
        return;
      }

      setTooltip({
        data: item,
        x: event.clientX,
        y: event.clientY,
      });
    },
    [wordLookup],
  );

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <ParentSize>
        {({ width, height }) => {
          if (width <= 0 || height <= 0 || words.length === 0) {
            return null;
          }

          const values = words.map((w) => w.value);

          const fontScale = scaleLog({
            domain: [Math.max(Math.min(...values), 0.01), Math.max(...values)],
            range: [16, Math.min(55, width / 8)],
          });

          return (
            <Wordcloud
              words={words}
              width={width}
              height={height}
              rotate={() => 0}
              fontSize={(word) => fontScale(word.value)}
              font='Arial'
              padding={8}
              spiral='archimedean'
              random={() => 0.5}
            >
              {(cloudWords) =>
                cloudWords.map((word, index) => (
                  <g
                    key={`${word.text}-${index}`}
                    transform={`translate(${word.x}, ${word.y})`}
                    onMouseMove={(event) => handleHover(word, event)}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      cursor: 'pointer',
                    }}
                  >
                    <Text
                      textAnchor='middle'
                      fontFamily='Arial, sans-serif'
                      fontSize={word.size}
                      fontWeight={600}
                      fill='#1971c2'
                    >
                      {word.text}
                    </Text>
                  </g>
                ))
              }
            </Wordcloud>
          );
        }}
      </ParentSize>

      {tooltip && (
        <div
          style={{
            position: 'fixed',
            left: tooltip.x + 12,
            top: tooltip.y + 12,
            background: '#fff',
            color: '#222',
            padding: '10px 12px',
            borderRadius: 8,
            boxShadow: '0 4px 16px rgba(0,0,0,.18)',
            fontSize: 13,
            lineHeight: 1.5,
            pointerEvents: 'none',
            zIndex: 1000,
          }}
        >
          <CustomChartLegendTooltip
            data={{
              title: tooltip.data.term,
              items: [
                { name: 'Score', value: tooltip.data.score.toFixed(3) },
                { name: 'Documents', value: tooltip.data.docCount },
                { name: 'Background', value: tooltip.data.bgCount },
                {
                  name: 'Historical share',
                  value: tooltip.data.historicalSharePercentage +"%",
                },
              ],
            }}
          />
        </div>
      )}
    </div>
  );
}

export default SignificantTermsAggregationChart;
