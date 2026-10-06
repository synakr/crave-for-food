import React, { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import Svg, { Defs, LinearGradient, Polygon, Stop } from "react-native-svg";

type BadgeShape = "hexagon" | "circle" | "square" | "diamond";

interface BadgeProps {
  shape?: BadgeShape;
  color?: string;
  size?: number;
  children?: React.ReactNode;
  description?: string;
}

const Badge = memo(function Badge({
  shape = "hexagon",
  color = "#E8B28F",
  size = 82,
  children,
  description,
}: BadgeProps) {
  return (
    <View style={styles.wrapper}>
      {/* ============================================================ */}
      {/* BADGE                                                        */}
      {/* ============================================================ */}

      <View
        style={[
          styles.badgeContainer,
          {
            width: size,
            height: size,
          },
        ]}>
        {shape === "hexagon" ? (
          <Svg width={size} height={size} viewBox="0 0 100 100">
            <Defs>
              {/* Main badge gradient */}
              <LinearGradient id="badgeGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={lightenColor(color, 0.12)} />

                <Stop offset="0.55" stopColor={color} />

                <Stop offset="1" stopColor={darkenColor(color, 0.12)} />
              </LinearGradient>

              {/* Lower glass/shadow */}
              <LinearGradient id="lowerGradient" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor="rgba(255,255,255,0.06)" />

                <Stop offset="1" stopColor="rgba(45,45,45,0.38)" />
              </LinearGradient>
            </Defs>

            {/* ====================================================== */}
            {/* OUTER HEXAGON                                          */}
            {/* ====================================================== */}

            <Polygon
              points="50,2 93,26 93,74 50,98 7,74 7,26"
              fill="url(#badgeGradient)"
            />

            {/* ====================================================== */}
            {/* INNER BORDER                                            */}
            {/* ====================================================== */}

            <Polygon
              points="50,10 85,30 85,70 50,90 15,70 15,30"
              fill="none"
              stroke="rgba(90,60,45,0.42)"
              strokeWidth="1.6"
            />

            {/* ====================================================== */}
            {/* INNER SURFACE                                           */}
            {/* ====================================================== */}

            <Polygon
              points="50,14 81,32 81,68 50,86 19,68 19,32"
              fill="rgba(255,255,255,0.055)"
            />

            {/* ====================================================== */}
            {/* LOWER DARK GLASS AREA                                  */}
            {/* ====================================================== */}

            <Polygon
              points="19,56 50,74 81,56 81,68 50,86 19,68"
              fill="url(#lowerGradient)"
            />

            {/* ====================================================== */}
            {/* TOP HIGHLIGHT                                           */}
            {/* ====================================================== */}

            <Polygon
              points="19,32 50,14 81,32 81,43 50,58 19,43"
              fill="rgba(255,255,255,0.035)"
            />

            {/* ====================================================== */}
            {/* INNER OUTLINE                                           */}
            {/* ====================================================== */}

            <Polygon
              points="50,14 81,32 81,68 50,86 19,68 19,32"
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          </Svg>
        ) : (
          <View
            style={[
              styles.genericShape,
              {
                width: size * 0.82,
                height: size * 0.82,
                backgroundColor: color,

                borderRadius:
                  shape === "circle" ? size : shape === "square" ? 16 : 8,

                transform:
                  shape === "diamond" ? [{ rotate: "45deg" }] : undefined,
              },
            ]}
          />
        )}

        {/* ========================================================== */}
        {/* CONTENT                                                    */}
        {/* ========================================================== */}

        <View style={styles.content}>
          {typeof children === "string" || typeof children === "number" ? (
            <Text
              style={[
                styles.number,
                {
                  color: darkenColor(color, 0.42),
                  fontSize: size * 0.48,
                },
              ]}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      </View>

      {/* ============================================================ */}
      {/* DESCRIPTION                                                  */}
      {/* ============================================================ */}

      {description && <Text style={styles.description}>{description}</Text>}
    </View>
  );
});

export default Badge;

/* -------------------------------------------------------------------------- */
/* Color helpers                                                              */
/* -------------------------------------------------------------------------- */

function hexToRgb(hex: string) {
  const clean = hex.replace("#", "");

  const value =
    clean.length === 3
      ? clean
          .split("")
          .map((char) => char + char)
          .join("")
      : clean;

  return {
    r: parseInt(value.substring(0, 2), 16),
    g: parseInt(value.substring(2, 4), 16),
    b: parseInt(value.substring(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number) {
  return (
    "#" +
    [r, g, b]
      .map((value) =>
        Math.max(0, Math.min(255, Math.round(value)))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}

function lightenColor(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHex(
    r + (255 - r) * amount,
    g + (255 - g) * amount,
    b + (255 - b) * amount,
  );
}

function darkenColor(hex: string, amount: number) {
  const { r, g, b } = hexToRgb(hex);

  return rgbToHex(r * (1 - amount), g * (1 - amount), b * (1 - amount));
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
  },

  badgeContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  genericShape: {
    position: "absolute",
  },

  content: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },

  number: {
    fontWeight: "500",
    letterSpacing: -1,
  },

  description: {
    marginTop: 10,
    color: "#777C83",
    fontSize: 12,
    lineHeight: 17,
    textAlign: "center",
    fontWeight: "500",
    maxWidth: 190,
  },
});
