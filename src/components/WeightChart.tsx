import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeightEntry } from '../types';
import { colors, spacing, borderRadius, shadows } from '../styles/theme';

interface WeightChartProps {
  data: WeightEntry[];
}

type TimeRange = '1W' | '1M' | 'ALL';

export const WeightChart = ({ data }: WeightChartProps) => {
  const [range, setRange] = useState<TimeRange>('ALL');
  const screenWidth = Dimensions.get('window').width;

  // Filter and process data based on range
  const chartData = useMemo(() => {
    const now = new Date();
    let filteredData = [...data];

    if (range === '1W') {
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      filteredData = filteredData.filter(d => new Date(d.date) >= oneWeekAgo);
    } else if (range === '1M') {
      const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      filteredData = filteredData.filter(d => new Date(d.date) >= oneMonthAgo);
    }

    return filteredData
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: new Date(entry.date).toLocaleDateString(),
        weight: entry.weight
      }));
  }, [data, range]);

  if (data.length === 0) {
    return (
      <View className="h-48 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-gray-100">
        <Text className="text-gray-400 text-sm">
          Log your weight to see the graph!
        </Text>
      </View>
    );
  }

  const weights = chartData.map(d => d.weight);
  const labels = chartData.map(d => d.date);

  const chartConfig = {
    backgroundColor: colors.surface,
    backgroundGradientFrom: colors.surface,
    backgroundGradientTo: colors.surface,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
      fill: colors.surface,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Weight Trend</Text>
        <View style={styles.rangeSelector}>
          {(['1W', '1M', 'ALL'] as TimeRange[]).map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRange(r)}
              style={[
                styles.rangeButton,
                range === r && styles.rangeButtonActive
              ]}
            >
              <Text style={[
                styles.rangeButtonText,
                range === r && styles.rangeButtonTextActive
              ]}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View style={styles.chartContainer}>
        {chartData.length > 0 ? (
          <LineChart
            data={{
              labels: labels.length > 7 ? labels.filter((_, i) => i % 2 === 0) : labels,
              datasets: [
                {
                  data: weights,
                },
              ],
            }}
            width={screenWidth - 80}
            height={240}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            fromZero={false}
            segments={4}
            yAxisSuffix=" lbs"
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>
              No data for this period
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    borderColor: colors.gray[100],
    ...shadows.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray[800],
  },
  rangeSelector: {
    flexDirection: 'row',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.md,
    padding: 2,
  },
  rangeButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  rangeButtonActive: {
    backgroundColor: colors.surface,
    ...shadows.sm,
  },
  rangeButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.gray[400],
  },
  rangeButtonTextActive: {
    color: colors.gray[800],
  },
  chartContainer: {
    height: 240,
    width: '100%',
    alignItems: 'center',
  },
  chart: {
    marginVertical: 0,
    borderRadius: borderRadius.md,
  },
  emptyState: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: colors.gray[400],
    fontSize: 14,
  },
});
