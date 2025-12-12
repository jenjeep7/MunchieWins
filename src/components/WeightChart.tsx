import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { WeightEntry } from '../types';

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
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(255, 140, 66, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(156, 163, 175, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '0',
      stroke: '#FF8C42',
    },
  };

  return (
    <View className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-sm font-semibold text-gray-500">Weight Trend</Text>
        <View className="flex-row bg-gray-100 rounded-lg p-0.5">
          {(['1W', '1M', 'ALL'] as TimeRange[]).map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRange(r)}
              className={`px-3 py-1 rounded-md ${
                range === r ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text className={`text-xs font-bold ${
                range === r ? 'text-gray-800' : 'text-gray-400'
              }`}>
                {r}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      <View className="h-64 w-full">
        {chartData.length > 0 ? (
          <LineChart
            data={{
              labels: labels,
              datasets: [
                {
                  data: weights,
                },
              ],
            }}
            width={screenWidth - 40}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
            withInnerLines={false}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withDots={true}
            withShadow={false}
            fromZero={false}
          />
        ) : (
          <View className="h-full flex items-center justify-center">
            <Text className="text-gray-400 text-xs">
              No data for this period
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
