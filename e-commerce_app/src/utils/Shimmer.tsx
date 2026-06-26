import React, { useEffect, useRef } from "react";
import { Animated, StyleSheet, View, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors, Radius } from "../types/theme";

interface ShimmerProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const Shimmer = ({
  width,
  height,
  borderRadius = Radius.sm,
  style,
}: ShimmerProps) => {
  const translateX = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(translateX, {
        toValue: width as number,
        duration: 900,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => {
      animation.stop();
    };
  }, []);

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: Colors.border,
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={{
          ...StyleSheet.absoluteFillObject,
          transform: [{ translateX }],
        }}
      >
        <LinearGradient
          colors={[
            "transparent",
            "rgba(255,255,255,0.4)",
            "rgba(255,255,255,0.8)",
            "rgba(255,255,255,0.4)",
            "transparent",
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFillObject}
        />
      </Animated.View>
    </View>
  );
};

export const ProductCardSkeleton = () => (
  <View style={skStyles.card}>
    <Shimmer width="100%" height={168} borderRadius={0} />
    <View style={skStyles.body}>
      <Shimmer width="85%" height={12} style={{ marginBottom: 6 }} />
      <Shimmer width="60%" height={12} style={{ marginBottom: 14 }} />
      <View style={skStyles.footer}>
        <Shimmer width={60} height={18} borderRadius={Radius.sm} />
        <Shimmer width={36} height={36} borderRadius={Radius.full} />
      </View>
    </View>
  </View>
);

export const ReviewCardSkeleton = () => (
  <View style={skStyles.reviewCard}>
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
      }}
    >
      <Shimmer width={42} height={42} borderRadius={Radius.full} />
      <View style={{ flex: 1, gap: 6 }}>
        <Shimmer width="40%" height={12} />
        <Shimmer width="25%" height={10} />
      </View>
      <Shimmer width={40} height={24} borderRadius={Radius.sm} />
    </View>
    <Shimmer width="100%" height={10} style={{ marginBottom: 5 }} />
    <Shimmer width="80%" height={10} style={{ marginBottom: 12 }} />
    <Shimmer width={80} height={20} borderRadius={Radius.full} />
  </View>
);

const skStyles = StyleSheet.create({
  card: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: "hidden",
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  body: { padding: 12 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#1A1A2E",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
});
