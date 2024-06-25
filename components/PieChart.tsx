import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

type GraphData = {
  value: number;
  color: string;
  text: string;
};

type Props = {
  graphData: GraphData[];
  total: number;
};

export default function PieChart({ graphData, total }: Props) {
  const radius = 70;
  const circleCircumference = 2 * Math.PI * radius;

  const calculateStrokeDashoffset = (percentage: number) => {
    return circleCircumference - (circleCircumference * percentage) / 100;
  };

  const calculatePercentage = (value: number) => {
    return (value / total) * 100;
  };

  let cumulativeAngle = 0;

  return (
    <View style={styles.container}>
      <View style={styles.graphWrapper}>
        <Svg height="160" width="160" viewBox="0 0 180 180">
          <G rotation={-90} originX="90" originY="90">
            {total === 0 ? (
              <Circle
                cx="50%"
                cy="50%"
                r={radius}
                stroke="#F1F6F9"
                fill="transparent"
                strokeWidth="40"
              />
            ) : (
              graphData.map((data, index) => {
                const percentage = calculatePercentage(data.value);
                const strokeDashoffset = calculateStrokeDashoffset(percentage);
                const angle = cumulativeAngle;
                cumulativeAngle += (data.value / total) * 360;

                return (
                  <Circle
                    key={index}
                    cx="50%"
                    cy="50%"
                    r={radius}
                    stroke={data.color}
                    fill="transparent"
                    strokeWidth="40"
                    strokeDasharray={circleCircumference}
                    strokeDashoffset={strokeDashoffset}
                    rotation={angle}
                    originX="90"
                    originY="90"
                    strokeLinecap="round"
                  />
                );
              })
            )}
          </G>
        </Svg>
        <Text style={styles.label}>{total}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    gap: 10,
  },
  button: {
    flex: 1,
    paddingHorizontal: 18,
  },
  buttonText: {
    textAlign: 'center',
  },
  studyButtonsContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingBottom: 10,
    marginTop: 10,
  },
  studyButton: {
    flex: 1,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  graphWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    position: 'absolute',
    fontSize: 35,
    fontWeight: 'bold',
  },
});
