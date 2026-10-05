import { Link } from "expo-router";
import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

// SPIKE: dummy data for the chart test, not real data
// Only every second month gets a label, to keep the x-axis readable.
const data = [
  { label: "Jan", value: 12000 },
  { label: "", value: 13500 },
  { label: "Mar", value: 0 },
  { label: "", value: -4200 },
  { label: "May" }, // missing month: no value
  { label: "", value: 8000 },
  { label: "Jul", value: 40500 },
  { label: "", value: 11800 },
  { label: "Sep" }, // missing at the end
  { label: "", value: 4500 },
];

// Colours taken from the mockup (docs/assets/home.png)
const LINE = "#3B4A8C";
const GAP = "#9AA3C7";

export default function Home() {
  const { width } = useWindowDimensions();

  return (
    <View className="items-center justify-center flex-1 gap-4 bg-stone-50">
      <View>
        <LineChart
          data={data}
          // fill the screen width minus padding, no scrolling.
          // Equal spacing on both sides: with adjustToWidth the library defaults
          // to 20 left and 0 right. endSpacing is added outside `width`, so it is
          // subtracted here to keep the total at screen width minus 80.
          width={width - 80 - 12}
          initialSpacing={12}
          endSpacing={12}
          adjustToWidth
          disableScroll
          // missing months: draw the line across the gap
          interpolateMissingValues
          // Not extrapolateMissingValues={false}: it makes the library ignore
          // lineSegments. Both special pieces are described here instead.
          lineSegments={[
            // the gap in May: dashed and lighter, from April (3) to June (5)
            { startIndex: 3, endIndex: 5, strokeDashArray: [6, 4], color: GAP },
            { startIndex: 7, endIndex: 9, strokeDashArray: [6, 4], color: GAP },
          ]}
          // the line and its points
          color={LINE}
          thickness={2}
          dataPointsColor={LINE}
          dataPointsRadius={4}
          // no y-axis, no grid: the line carries the information
          hideYAxisText
          yAxisThickness={0}
          yAxisLabelWidth={0}
          hideRules
          // one thin, light x-axis with grey month labels
          xAxisColor="#D9D9D9"
          xAxisThickness={1}
          xAxisLabelTextStyle={{ color: "#6B7280" }}
        />
      </View>

      {/* Legend for the dashed gap */}
      <View className="flex-row items-center gap-2">
        <Text style={{ color: GAP }}>– – –</Text>
        <Text className="text-gray-500">Month was not entered</Text>
      </View>

      <Text className="text-2xl font-bold">Home</Text>

      <Link href="/entry" asChild>
        <Pressable className="px-4 py-2 bg-white rounded-lg">
          <Text>Entry</Text>
        </Pressable>
      </Link>

      <Link
        href={{ pathname: "/month/[month]", params: { month: "2026-08" } }}
        asChild
      >
        <Pressable className="px-4 py-2 bg-white rounded-lg">
          <Text>Month 2026-08</Text>
        </Pressable>
      </Link>

      <Link
        href={{ pathname: "/month/[month]", params: { month: "2026-09" } }}
        asChild
      >
        <Pressable className="px-4 py-2 bg-white rounded-lg">
          <Text>Month 2026-09</Text>
        </Pressable>
      </Link>

      <Link href="/settings" asChild>
        <Pressable className="px-4 py-2 bg-white rounded-lg">
          <Text>Settings</Text>
        </Pressable>
      </Link>
    </View>
  );
}
