import { chartTooltipFormatter } from '@/shared/utils/chartTooltipFormatter.ts';

export const createChartTitle = (total: number) => ({
  text: total.toString(),
  subtext: 'Visible Articles',
  left: 'center',
  top: '42%',
  textStyle: {
    fontSize: 30,
    fontWeight: 700,
    color: '#333',
  },
  subtextStyle: {
    fontSize: 14,
    color: '#999',
  },
});


export const createTooltip = () => ({
  trigger: 'item',
  backgroundColor: '#fff',
  borderColor: '#e9ecef',
  borderWidth: 1,
  borderRadius: 4,
  padding: 12,
  textStyle: {
    fontFamily: 'inherit',
  },
  extraCssText: `
          min-width:180px;
          box-shadow:0 4px 12px rgba(0,0,0,0.12);
        `,
  formatter: chartTooltipFormatter,
});
