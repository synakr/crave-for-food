import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Svg, {
  Defs,
  Path,
  Stop,
  LinearGradient as SvgGradient,
} from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export interface QuickActionItem {
  id: string;
  label: string;
  renderIcon: () => React.ReactNode;
  onPress: () => void;
}

interface QuickActionsModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectAction?: (id: string) => void;
  actions?: QuickActionItem[];
}

export default function QuickActionsModal({
  visible,
  onClose,
  onSelectAction,
  actions,
}: QuickActionsModalProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const popupScale = useRef(new Animated.Value(0)).current;
  const popupOpacity = useRef(new Animated.Value(0)).current;
  const popupTranslateY = useRef(new Animated.Value(20)).current;
  const scrollViewRef = useRef<ScrollView>(null);

  // Extended default action pages (Page 1 + Page 2)
  const defaultActions: QuickActionItem[] = [
    // Page 1
    {
      id: "saved",
      label: "Saved Spots",
      renderIcon: () => <Feather name="bookmark" size={24} color="#FF1A66" />,
      onPress: () => onSelectAction?.("saved"),
    },
    {
      id: "random",
      label: "Random Pick",
      renderIcon: () => (
        <MaterialCommunityIcons name="cube-outline" size={26} color="#FF1A66" />
      ),
      onPress: () => onSelectAction?.("random"),
    },
    {
      id: "gems",
      label: "Nearby Gems",
      renderIcon: () => (
        <Ionicons name="diamond-outline" size={24} color="#FF1A66" />
      ),
      onPress: () => onSelectAction?.("gems"),
    },
    {
      id: "not_visited",
      label: "Haven't Visited",
      renderIcon: () => (
        <MaterialCommunityIcons name="cancel" size={26} color="#FF1A66" />
      ),
      onPress: () => onSelectAction?.("not_visited"),
    },
    {
      id: "trending",
      label: "Trending Now",
      renderIcon: () => (
        <Ionicons name="flame-outline" size={26} color="#FF1A66" />
      ),
      onPress: () => onSelectAction?.("trending"),
    },
    {
      id: "trails",
      label: "Food Trails",
      renderIcon: () => (
        <MaterialCommunityIcons
          name="weather-windy"
          size={26}
          color="#FF1A66"
        />
      ),
      onPress: () => onSelectAction?.("trails"),
    },
    // Page 2
    {
      id: "budget",
      label: "Budget Bites",
      renderIcon: () => (
        <MaterialCommunityIcons
          name="wallet-outline"
          size={26}
          color="#FF1A66"
        />
      ),
      onPress: () => onSelectAction?.("budget"),
    },
    {
      id: "late_night",
      label: "Late Night",
      renderIcon: () => (
        <Ionicons name="moon-outline" size={24} color="#FF1A66" />
      ),
      onPress: () => onSelectAction?.("late_night"),
    },
    {
      id: "top_rated",
      label: "Top Rated",
      renderIcon: () => (
        <Ionicons name="star-outline" size={25} color="#FF1A66" />
      ),
      onPress: () => onSelectAction?.("top_rated"),
    },
    {
      id: "cafes",
      label: "Cozy Cafes",
      renderIcon: () => (
        <Ionicons name="cafe-outline" size={25} color="#FF1A66" />
      ),
      onPress: () => onSelectAction?.("cafes"),
    },
    {
      id: "desserts",
      label: "Sweet Craves",
      renderIcon: () => (
        <MaterialCommunityIcons name="cupcake" size={26} color="#FF1A66" />
      ),
      onPress: () => onSelectAction?.("desserts"),
    },
    {
      id: "street_food",
      label: "Street Food",
      renderIcon: () => (
        <MaterialCommunityIcons
          name="food-drumstick-outline"
          size={26}
          color="#FF1A66"
        />
      ),
      onPress: () => onSelectAction?.("street_food"),
    },
  ];

  const actionItems = actions || defaultActions;

  // Chunk actions into pages of 6 items (2 rows x 3 columns)
  const PAGE_SIZE = 6;
  const pages: QuickActionItem[][] = [];
  for (let i = 0; i < actionItems.length; i += PAGE_SIZE) {
    pages.push(actionItems.slice(i, i + PAGE_SIZE));
  }

  useEffect(() => {
    if (visible) {
      setCurrentPage(0);
      scrollViewRef.current?.scrollTo({ x: 0, animated: false });
      Animated.parallel([
        Animated.spring(popupScale, {
          toValue: 1,
          friction: 7,
          tension: 90,
          useNativeDriver: true,
        }),
        Animated.timing(popupOpacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(popupTranslateY, {
          toValue: 0,
          friction: 8,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      popupScale.setValue(0);
      popupOpacity.setValue(0);
      popupTranslateY.setValue(20);
    }
  }, [visible]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(popupScale, {
        toValue: 0.85,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(popupOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(popupTranslateY, {
        toValue: 15,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const POPUP_W = Math.min(SCREEN_WIDTH - 32, 350);
  const POPUP_H = 340;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const pageIndex = Math.round(event.nativeEvent.contentOffset.x / POPUP_W);
    if (pageIndex !== currentPage) {
      setCurrentPage(pageIndex);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleDismiss}>
      <TouchableWithoutFeedback onPress={handleDismiss}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.popupContainer,
                {
                  width: POPUP_W,
                  height: POPUP_H,
                  opacity: popupOpacity,
                  transform: [
                    { translateY: popupTranslateY },
                    { scale: popupScale },
                  ],
                },
              ]}>
              {/* Background Bubble Surface with Bottom Beak */}
              <Svg
                width={POPUP_W}
                height={POPUP_H}
                viewBox={`0 0 ${POPUP_W} ${POPUP_H}`}
                style={StyleSheet.absoluteFill}>
                <Defs>
                  <SvgGradient id="popupGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.98" />
                    <Stop
                      offset="100%"
                      stopColor="#FFF2F6"
                      stopOpacity="0.96"
                    />
                  </SvgGradient>
                </Defs>
                <Path
                  d={`
                    M 36 2
                    L ${POPUP_W - 36} 2
                    A 34 34 0 0 1 ${POPUP_W - 2} 36
                    L ${POPUP_W - 2} ${POPUP_H - 46}
                    A 34 34 0 0 1 ${POPUP_W - 36} ${POPUP_H - 12}
                    L ${POPUP_W / 2 + 13} ${POPUP_H - 12}
                    Q ${POPUP_W / 2 + 5} ${POPUP_H - 12} ${POPUP_W / 2} ${POPUP_H - 2}
                    Q ${POPUP_W / 2 - 5} ${POPUP_H - 12} ${POPUP_W / 2 - 13} ${POPUP_H - 12}
                    L 36 ${POPUP_H - 12}
                    A 34 34 0 0 1 2 ${POPUP_H - 46}
                    L 2 36
                    A 34 34 0 0 1 36 2
                    Z
                  `}
                  fill="url(#popupGrad)"
                  stroke="rgba(255, 255, 255, 0.95)"
                  strokeWidth="1.5"
                />
              </Svg>

              {/* Horizontal Paging ScrollView */}
              <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={handleScroll}
                style={[styles.pagerScrollView, { width: POPUP_W }]}
                contentContainerStyle={{ width: POPUP_W * pages.length }}>
                {pages.map((pageItems, pageIdx) => (
                  <View
                    key={pageIdx}
                    style={[styles.pageContainer, { width: POPUP_W }]}>
                    <View style={styles.gridContainer}>
                      {pageItems.map((item) => (
                        <Pressable
                          key={item.id}
                          style={({ pressed }) => [
                            styles.gridItem,
                            pressed && {
                              opacity: 0.7,
                              transform: [{ scale: 0.94 }],
                            },
                          ]}
                          onPress={() => {
                            Haptics.impactAsync(
                              Haptics.ImpactFeedbackStyle.Light,
                            );
                            item.onPress();
                            handleDismiss();
                          }}>
                          <View style={styles.iconCircle}>
                            {item.renderIcon()}
                          </View>
                          <Text style={styles.itemLabel}>{item.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Interactive Pagination Indicator Dots */}
              {pages.length > 1 && (
                <View style={styles.paginationDots}>
                  {pages.map((_, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.dotBase,
                        idx === currentPage
                          ? styles.activeDot
                          : styles.inactiveDot,
                      ]}
                    />
                  ))}
                </View>
              )}
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.04)",
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 94,
  },
  popupContainer: {
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#FF6584",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.2,
        shadowRadius: 28,
      },
      android: {
        elevation: 14,
      },
    }),
  },
  pagerScrollView: {
    height: 250,
  },
  pageContainer: {
    paddingHorizontal: 16,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 8,
  },
  gridItem: {
    width: "31%",
    alignItems: "center",
    marginBottom: 20,
  },
  iconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 77, 136, 0.1)",
    ...Platform.select({
      ios: {
        shadowColor: "#FF4D88",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.12,
        shadowRadius: 10,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2C1E21",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 15,
  },
  paginationDots: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  dotBase: {
    height: 5,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    width: 16,
    backgroundColor: "#FF1A66",
  },
  inactiveDot: {
    width: 14,
    backgroundColor: "#D9CFD2",
  },
});
