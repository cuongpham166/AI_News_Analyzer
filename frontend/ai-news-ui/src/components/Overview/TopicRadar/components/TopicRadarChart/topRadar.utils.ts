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
