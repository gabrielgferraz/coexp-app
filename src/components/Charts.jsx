/**
 * Charts.jsx — loaded on iOS/Android by Metro's platform resolution.
 * Uses react-native-chart-kit (native modules, works on mobile only).
 */
import React from 'react';
import { Dimensions } from 'react-native';
import { BarChart as RNBarChart, PieChart as RNPieChart } from 'react-native-chart-kit';
import { colors, spacing } from '../theme';

const SCREEN_WIDTH = Dimensions.get('window').width;
const CHART_WIDTH  = SCREEN_WIDTH - spacing.md * 2 - 2;
const PIE_COLORS   = ['#1A3A2A', '#4CAF50', '#81C784', '#FF8F00', '#42A5F5'];

const chartConfig = {
  backgroundGradientFrom: colors.surface,
  backgroundGradientTo:   colors.surface,
  color: (opacity = 1) => `rgba(26, 58, 42, ${opacity})`,
  labelColor: () => colors.textSecondary,
  barPercentage: 0.6,
  decimalPlaces: 0,
  propsForBackgroundLines: { stroke: colors.borderLight, strokeDasharray: '' },
};

export function BarChartComp({ data }) {
  return (
    <RNBarChart
      data={{
        labels:   data.map(i => i.nome?.slice(0, 6) ?? ''),
        datasets: [{ data: data.map(i => i.qtd ?? 0) }],
      }}
      width={CHART_WIDTH}
      height={200}
      chartConfig={chartConfig}
      fromZero
      showValuesOnTopOfBars
      withInnerLines
    />
  );
}

export function PieChartComp({ data }) {
  const pieData = data.map((d, idx) => ({
    name:            d.name,
    population:      d.value,
    color:           PIE_COLORS[idx % PIE_COLORS.length],
    legendFontColor: colors.text,
    legendFontSize:  13,
  }));

  return (
    <RNPieChart
      data={pieData}
      width={CHART_WIDTH}
      height={180}
      chartConfig={chartConfig}
      accessor="population"
      backgroundColor="transparent"
      paddingLeft="16"
    />
  );
}
