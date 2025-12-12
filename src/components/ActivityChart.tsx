import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { Win } from '../types';

interface ActivityChartProps {
  data: Win[];
  color: string;
}

const COLORS = ['#FF8C42', '#4CAF50', '#2196F3', '#FFC107', '#9C27B0', '#E91E63', '#795548'];

export const ActivityChart = ({ data, color }: ActivityChartProps) => {
  const screenWidth = Dimensions.get('window').width;

  // Group by category to show composition
  const processData = () => {
    const counts: Record<string, number> = {};
    let total = 0;
    
    data.forEach(win => {
      const key = win.category || 'Uncategorized';
      counts[key] = (counts[key] || 0) + 1;
      total++;
    });

    // Convert to array and sort
    let chartData = Object.keys(counts).map((name, index) => ({
      name,
      value: counts[name],
      percent: ((counts[name] / total) * 100).toFixed(0),
      color: COLORS[index % COLORS.length],
      legendFontColor: '#333',
      legendFontSize: 12,
    })).sort((a, b) => b.value - a.value);

    return chartData;
  };

  const chartData = processData();

  if (data.length === 0) {
    return (
      <View className="h-48 flex items-center justify-center">
        <Text className="text-gray-400 text-xs italic">
          No activity recorded yet.
        </Text>
      </View>
    );
  }

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  };

  return (
    <View className="mt-2">
      <PieChart
        data={chartData}
        width={screenWidth - 40}
        height={220}
        chartConfig={chartConfig}
        accessor="value"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute={false}
      />
      
      {/* Custom Legend */}
      <View className="mt-4 px-4">
        {chartData.map((item, index) => (
          <View key={index} className="flex-row items-center mb-2">
            <View 
              style={{ backgroundColor: item.color }}
              className="w-3 h-3 rounded-full mr-2"
            />
            <Text className="text-xs text-gray-700 flex-1">
              {item.name}
            </Text>
            <Text className="text-xs text-gray-500">
              {item.value} ({item.percent}%)
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};
