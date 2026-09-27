import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  PanResponder,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ExplorePost } from "../data/repositories/PostRepository";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

interface MapPostFocusProps {
  post: ExplorePost;
  index: number;
  total: number;

  originX: number;
  originY: number;

  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
}

export default function MapPostFocus({
  post,
  index,
  total,
  originX,
  originY,
  onPrevious,
  onNext,
  onClose,
}: MapPostFocusProps) {
  /* =========================================================
     INITIAL MARKER POSITION

     Capture this ONLY once.

     When the user moves to another post, the new post must NOT
     animate from the original marker again.
     ========================================================= */

  const initialOrigin = useRef({
    x: originX,
    y: originY,
  }).current;

  const screenCenter = useMemo(
    () => ({
      x: SCREEN_WIDTH / 2,
      y: SCREEN_HEIGHT / 2,
    }),
    [],
  );

  const originOffset = useMemo(
    () => ({
      x: initialOrigin.x - screenCenter.x,
      y: initialOrigin.y - screenCenter.y,
    }),
    [initialOrigin.x, initialOrigin.y, screenCenter.x, screenCenter.y],
  );

  /* =========================================================
     OPENING ANIMATION
     ========================================================= */

  const openScale = useRef(new Animated.Value(0.08)).current;

  const openTranslateX = useRef(new Animated.Value(originOffset.x)).current;

  const openTranslateY = useRef(new Animated.Value(originOffset.y)).current;

  const overlayOpacity = useRef(new Animated.Value(0)).current;

  /* =========================================================
     SWIPE ANIMATION
     ========================================================= */

  const swipeX = useRef(new Animated.Value(0)).current;

  const isSwipingRef = useRef(false);

  /* =========================================================
     STATE
     ========================================================= */

  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [mapLoading, setMapLoading] = useState(true);

  /* =========================================================
     POST CHANGE / OPENING LIFECYCLE

     First post:
       marker -> post animation

     Later posts:
       instantly stay at final position
       swipe animation handles the transition
     ========================================================= */

  const firstPostRef = useRef(true);

  useEffect(() => {
    let mapTimer: ReturnType<typeof setTimeout> | undefined;

    setImageLoading(true);
    setImageError(false);
    setMapLoading(true);

    swipeX.setValue(0);
    isSwipingRef.current = false;

    /*
     * First post only:
     * animate the post out from the marker.
     */
    if (firstPostRef.current) {
      firstPostRef.current = false;

      openScale.setValue(0.08);

      openTranslateX.setValue(originOffset.x);

      openTranslateY.setValue(originOffset.y);

      overlayOpacity.setValue(0);

      Animated.parallel([
        Animated.timing(overlayOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),

        Animated.timing(openScale, {
          toValue: 1,
          duration: 430,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(openTranslateX, {
          toValue: 0,
          duration: 430,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),

        Animated.timing(openTranslateY, {
          toValue: 0,
          duration: 430,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      /*
       * Subsequent posts must already be in their final
       * position.
       */
      openScale.setValue(1);
      openTranslateX.setValue(0);
      openTranslateY.setValue(0);
      overlayOpacity.setValue(1);
    }

    /*
     * Map loading simulation.

     * Later replace this with the actual MapView onMapReady
     * callback.
     */
    mapTimer = setTimeout(() => {
      setMapLoading(false);
    }, 450);

    return () => {
      if (mapTimer) {
        clearTimeout(mapTimer);
      }
    };
  }, [
    post.id,
    originOffset.x,
    originOffset.y,
    openScale,
    openTranslateX,
    openTranslateY,
    overlayOpacity,
    swipeX,
  ]);

  /* =========================================================
     SWIPE COMPLETION
     ========================================================= */

  const completeSwipe = useCallback(
    (direction: "next" | "previous") => {
      if (isSwipingRef.current) {
        return;
      }

      isSwipingRef.current = true;

      const target = direction === "next" ? -SCREEN_WIDTH : SCREEN_WIDTH;

      Animated.timing(swipeX, {
        toValue: target,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) {
          isSwipingRef.current = false;
          swipeX.setValue(0);
          return;
        }

        /*
         * Reset before changing the post.
         *
         * The post.id effect will then load the next image
         * without replaying the marker animation.
         */
        swipeX.setValue(0);
        isSwipingRef.current = false;

        if (direction === "next") {
          onNext();
        } else {
          onPrevious();
        }
      });
    },
    [onNext, onPrevious, swipeX],
  );

  /* =========================================================
     CANCEL SWIPE
     ========================================================= */

  const cancelSwipe = useCallback(() => {
    if (isSwipingRef.current) {
      return;
    }

    Animated.spring(swipeX, {
      toValue: 0,
      tension: 80,
      friction: 10,
      useNativeDriver: true,
    }).start();
  }, [swipeX]);

  /* =========================================================
     PAN RESPONDER
     ========================================================= */

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) => {
          if (isSwipingRef.current) {
            return false;
          }

          return (
            Math.abs(gestureState.dx) > 8 &&
            Math.abs(gestureState.dx) > Math.abs(gestureState.dy)
          );
        },

        onPanResponderMove: (_, gestureState) => {
          if (isSwipingRef.current) {
            return;
          }

          const dx = gestureState.dx;

          /*
           * Resistance at boundaries.
           */
          if ((dx > 0 && index === 0) || (dx < 0 && index === total - 1)) {
            swipeX.setValue(dx * 0.2);
            return;
          }

          swipeX.setValue(dx);
        },

        onPanResponderRelease: (_, gestureState) => {
          if (isSwipingRef.current) {
            return;
          }

          const dx = gestureState.dx;
          const vx = gestureState.vx;

          const shouldSwipe = Math.abs(dx) > 80 || Math.abs(vx) > 0.7;

          if (!shouldSwipe) {
            cancelSwipe();
            return;
          }

          /*
           * Swipe left -> next
           */
          if (dx < 0) {
            if (index < total - 1) {
              completeSwipe("next");
            } else {
              cancelSwipe();
            }

            return;
          }

          /*
           * Swipe right -> previous
           */
          if (index > 0) {
            completeSwipe("previous");
          } else {
            cancelSwipe();
          }
        },

        onPanResponderTerminate: () => {
          cancelSwipe();
        },
      }),
    [cancelSwipe, completeSwipe, index, total],
  );

  /* =========================================================
     IMAGE HANDLERS
     ========================================================= */

  const handleImageLoad = useCallback(() => {
    setImageLoading(false);
  }, []);

  const handleImageError = useCallback(() => {
    setImageLoading(false);
    setImageError(true);
  }, []);

  /* =========================================================
     RENDER
     ========================================================= */

  return (
    <Animated.View
      style={[
        styles.overlay,
        {
          opacity: overlayOpacity,
        },
      ]}>
      {/* =====================================================
          MAIN FOCUS CONTAINER
         ===================================================== */}

      <View style={styles.focusContainer}>
        {/* ===================================================
            MINI MAP

            This remains stationary.

            Only the post expands from the marker.
           =================================================== */}

        <View style={styles.miniMapContainer}>
          {/* Map skeleton */}

          {mapLoading && (
            <View style={styles.mapSkeleton}>
              <View style={styles.skeletonRoadLarge} />
              <View style={styles.skeletonRoadSmall} />

              <View style={styles.skeletonBlockOne} />
              <View style={styles.skeletonBlockTwo} />
              <View style={styles.skeletonBlockThree} />
            </View>
          )}

          {/* Fake map */}

          <Animated.View
            style={[
              styles.fakeMap,
              {
                opacity: mapLoading ? 0 : 1,
              },
            ]}>
            {/* Roads */}

            <View style={[styles.fakeRoad, styles.roadOne]} />

            <View style={[styles.fakeRoad, styles.roadTwo]} />

            <View style={[styles.fakeRoad, styles.roadThree]} />

            <View style={[styles.fakeRoad, styles.roadFour]} />

            {/* Map blocks */}

            <View style={styles.mapBlockOne} />
            <View style={styles.mapBlockTwo} />
            <View style={styles.mapBlockThree} />
            <View style={styles.mapBlockFour} />

            {/* Other markers */}

            <View style={styles.smallMarkerOne} />
            <View style={styles.smallMarkerTwo} />
            <View style={styles.smallMarkerThree} />

            {/* Selected marker */}

            <View style={styles.selectedMarkerWrapper}>
              <View style={styles.selectedMarkerPulse} />

              <Image
                source={{ uri: post.image }}
                style={styles.selectedMarkerImage}
              />
            </View>

            {/* Location label */}

            <View style={styles.mapLabel}>
              <Text numberOfLines={1} style={styles.mapLabelText}>
                {post.location}
              </Text>
            </View>
          </Animated.View>
        </View>

        {/* ===================================================
            POST SLOT

            Reserves the final post position.
           =================================================== */}

        <View style={styles.postSlot} />
      </View>

      {/* =====================================================
          ANIMATED POST

          ONLY THIS ELEMENT expands from the marker.
         ===================================================== */}

      <Animated.View
        style={[
          styles.animatedPostLayer,
          {
            transform: [
              {
                translateX: openTranslateX,
              },
              {
                translateY: openTranslateY,
              },
              {
                scale: openScale,
              },
            ],
          },
        ]}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.postCard,
            {
              transform: [
                {
                  translateX: swipeX,
                },
              ],
            },
          ]}>
          {/* =================================================
              POST IMAGE
             ================================================= */}

          <View style={styles.imageContainer}>
            {/* Image skeleton */}

            {imageLoading && !imageError && (
              <View style={styles.imageSkeleton}>
                <View style={styles.imageSkeletonLine} />

                <View style={styles.imageSkeletonLineShort} />
              </View>
            )}

            {/* Image */}

            {!imageError && (
              <Image
                source={{ uri: post.image }}
                style={[
                  styles.postImage,
                  {
                    opacity: imageLoading ? 0 : 1,
                  },
                ]}
                resizeMode="cover"
                onLoad={handleImageLoad}
                onError={handleImageError}
              />
            )}

            {/* Image error */}

            {imageError && (
              <View style={styles.imageError}>
                <Text style={styles.imageErrorIcon}>!</Text>

                <Text style={styles.imageErrorText}>Image unavailable</Text>
              </View>
            )}

            {/* Image overlay */}

            {!imageLoading && !imageError && (
              <View style={styles.imageOverlay} />
            )}

            {/* =================================================
                USER
               ================================================= */}

            <View style={styles.userInfo}>
              {post.user.avatar ? (
                <Image
                  source={{ uri: post.user.avatar }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarFallbackText}>
                    {post.user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}

              <View>
                <Text style={styles.userName}>{post.user.name}</Text>

                <Text style={styles.location}>{post.location}</Text>
              </View>
            </View>

            {/* =================================================
                POST INFORMATION
               ================================================= */}

            <View style={styles.postInfo}>
              <Text style={styles.postTitle} numberOfLines={2}>
                {post.title}
              </Text>

              {!!post.description && (
                <Text style={styles.postDescription} numberOfLines={3}>
                  {post.description}
                </Text>
              )}

              <Text style={styles.likes}>♥ {post.likes}</Text>
            </View>
          </View>

          {/* =================================================
              COUNTER
             ================================================= */}

          <View style={styles.counter}>
            <Text style={styles.counterText}>
              {index + 1} / {total}
            </Text>
          </View>
        </Animated.View>
      </Animated.View>

      {/* =====================================================
          CLOSE BUTTON
         ===================================================== */}

      <Pressable onPress={onClose} style={styles.closeButton} hitSlop={12}>
        <Text style={styles.closeText}>×</Text>
      </Pressable>

      {/* =====================================================
          PREVIOUS
         ===================================================== */}

      {/* {index > 0 && (
        <Pressable
          onPress={onPrevious}
          style={[styles.navigationButton, styles.previousButton]}>
          <Text style={styles.navigationText}>‹</Text>
        </Pressable>
      )} */}

      {/* =====================================================
          NEXT
         ===================================================== */}

      {/* {index < total - 1 && (
        <Pressable
          onPress={onNext}
          style={[styles.navigationButton, styles.nextButton]}>
          <Text style={styles.navigationText}>›</Text>
        </Pressable>
      )} */}
    </Animated.View>
  );
}

/* ===========================================================
   STYLES
   =========================================================== */

const styles = StyleSheet.create({
  /* =========================================================
     OVERLAY
     ========================================================= */

  overlay: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    backgroundColor: "rgba(0, 0, 0, 0.58)",
  },

  /* =========================================================
     FOCUS CONTAINER
     ========================================================= */

  focusContainer: {
    position: "absolute",

    width: "94%",
    height: "91%",

    left: "3%",
    top: "4.5%",

    backgroundColor: "transparent",

    borderRadius: 22,

    padding: 0,

    overflow: "hidden",
  },

  /* =========================================================
     MINI MAP
     ========================================================= */

  miniMapContainer: {
    width: "100%",
    height: "25%",

    borderRadius: 17,

    overflow: "hidden",

    backgroundColor: "#E8E5E1",
  },

  fakeMap: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "#E8E5E1",
  },

  /* =========================================================
     MAP SKELETON
     ========================================================= */

  mapSkeleton: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "#E1DED9",
  },

  skeletonRoadLarge: {
    position: "absolute",

    width: "150%",
    height: 18,

    backgroundColor: "#D5D1CC",

    transform: [
      {
        rotate: "-20deg",
      },
    ],

    left: "-20%",
    top: "45%",
  },

  skeletonRoadSmall: {
    position: "absolute",

    width: "120%",
    height: 12,

    backgroundColor: "#D5D1CC",

    transform: [
      {
        rotate: "42deg",
      },
    ],

    left: "-10%",
    top: "20%",
  },

  skeletonBlockOne: {
    position: "absolute",

    width: 65,
    height: 40,

    borderRadius: 8,

    backgroundColor: "#DAD6D1",

    left: 20,
    top: 18,
  },

  skeletonBlockTwo: {
    position: "absolute",

    width: 80,
    height: 55,

    borderRadius: 8,

    backgroundColor: "#DAD6D1",

    right: 20,
    top: 25,
  },

  skeletonBlockThree: {
    position: "absolute",

    width: 55,
    height: 45,

    borderRadius: 8,

    backgroundColor: "#DAD6D1",

    left: "40%",
    bottom: 15,
  },

  /* =========================================================
     FAKE MAP ROADS
     ========================================================= */

  fakeRoad: {
    position: "absolute",

    backgroundColor: "#FFFFFF",

    borderRadius: 20,
  },

  roadOne: {
    width: "130%",
    height: 12,

    left: "-15%",
    top: "48%",

    transform: [
      {
        rotate: "-18deg",
      },
    ],
  },

  roadTwo: {
    width: "120%",
    height: 8,

    left: "-10%",
    top: "28%",

    transform: [
      {
        rotate: "35deg",
      },
    ],
  },

  roadThree: {
    width: "100%",
    height: 7,

    left: "10%",
    top: "65%",

    transform: [
      {
        rotate: "8deg",
      },
    ],
  },

  roadFour: {
    width: 7,
    height: "120%",

    left: "58%",
    top: "-10%",

    transform: [
      {
        rotate: "12deg",
      },
    ],
  },

  /* =========================================================
     MAP BLOCKS
     ========================================================= */

  mapBlockOne: {
    position: "absolute",

    width: 60,
    height: 35,

    borderRadius: 8,

    backgroundColor: "#D9D5CF",

    left: 20,
    top: 20,
  },

  mapBlockTwo: {
    position: "absolute",

    width: 75,
    height: 45,

    borderRadius: 8,

    backgroundColor: "#D9D5CF",

    right: 25,
    top: 30,
  },

  mapBlockThree: {
    position: "absolute",

    width: 50,
    height: 50,

    borderRadius: 8,

    backgroundColor: "#D9D5CF",

    left: 50,
    bottom: 15,
  },

  mapBlockFour: {
    position: "absolute",

    width: 70,
    height: 35,

    borderRadius: 8,

    backgroundColor: "#D9D5CF",

    right: 40,
    bottom: 20,
  },

  /* =========================================================
     MAP MARKERS
     ========================================================= */

  smallMarkerOne: {
    position: "absolute",

    width: 10,
    height: 10,

    borderRadius: 5,

    backgroundColor: "#7D7771",

    left: "24%",
    top: "35%",
  },

  smallMarkerTwo: {
    position: "absolute",

    width: 9,
    height: 9,

    borderRadius: 5,

    backgroundColor: "#7D7771",

    right: "25%",
    top: "58%",
  },

  smallMarkerThree: {
    position: "absolute",

    width: 8,
    height: 8,

    borderRadius: 4,

    backgroundColor: "#7D7771",

    left: "68%",
    top: "25%",
  },

  selectedMarkerWrapper: {
    position: "absolute",

    left: "50%",
    top: "50%",

    width: 44,
    height: 44,

    marginLeft: -22,
    marginTop: -22,

    alignItems: "center",
    justifyContent: "center",
  },

  selectedMarkerPulse: {
    position: "absolute",

    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },

  selectedMarkerImage: {
    width: 30,
    height: 30,

    borderRadius: 15,

    borderWidth: 3,
    borderColor: "#FFFFFF",
  },

  mapLabel: {
    position: "absolute",

    left: 12,
    bottom: 10,

    maxWidth: "70%",

    paddingHorizontal: 10,
    paddingVertical: 6,

    borderRadius: 10,

    backgroundColor: "rgba(255,255,255,0.92)",
  },

  mapLabelText: {
    fontSize: 11,
    fontWeight: "600",

    color: "#393532",
  },

  /* =========================================================
     POST SLOT
     ========================================================= */

  postSlot: {
    flex: 1,

    marginTop: 0,

    borderRadius: 18,

    backgroundColor: "transparent",
  },

  /* =========================================================
     ANIMATED POST
     ========================================================= */

  animatedPostLayer: {
    position: "absolute",

    left: "3.7%",
    right: "3.7%",

    top: "28%",
    bottom: "10%",
  },

  postCard: {
    flex: 1,

    borderRadius: 18,

    overflow: "hidden",

    backgroundColor: "#151515",

    elevation: 8,

    shadowOpacity: 0.25,
    shadowRadius: 15,

    shadowOffset: {
      width: 0,
      height: 10,
    },
  },

  /* =========================================================
     IMAGE
     ========================================================= */

  imageContainer: {
    flex: 1,

    position: "relative",

    backgroundColor: "#DDD9D5",
  },

  postImage: {
    ...StyleSheet.absoluteFillObject,

    width: "100%",
    height: "100%",
  },

  imageSkeleton: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "#D8D4D0",

    justifyContent: "flex-end",

    padding: 20,
  },

  imageSkeletonLine: {
    width: "65%",
    height: 14,

    borderRadius: 8,

    backgroundColor: "#C8C3BE",

    marginBottom: 10,
  },

  imageSkeletonLineShort: {
    width: "40%",
    height: 10,

    borderRadius: 8,

    backgroundColor: "#C8C3BE",
  },

  imageError: {
    ...StyleSheet.absoluteFillObject,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#E2DEDA",
  },

  imageErrorIcon: {
    width: 34,
    height: 34,

    borderRadius: 17,

    textAlign: "center",
    lineHeight: 34,

    backgroundColor: "#B9B3AE",

    color: "#FFFFFF",

    fontSize: 20,
    fontWeight: "800",

    marginBottom: 8,
  },

  imageErrorText: {
    color: "#5B5652",

    fontSize: 13,
    fontWeight: "600",
  },

  imageOverlay: {
    ...StyleSheet.absoluteFillObject,

    backgroundColor: "rgba(0,0,0,0.20)",
  },

  /* =========================================================
     USER
     ========================================================= */

  userInfo: {
    position: "absolute",

    left: 18,
    top: 18,

    flexDirection: "row",

    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,

    borderRadius: 20,

    borderWidth: 2,
    borderColor: "#FFFFFF",

    marginRight: 10,
  },

  avatarFallback: {
    width: 40,
    height: 40,

    borderRadius: 20,

    backgroundColor: "#FFFFFF",

    alignItems: "center",
    justifyContent: "center",

    marginRight: 10,
  },

  avatarFallbackText: {
    fontSize: 16,
    fontWeight: "700",

    color: "#4B4642",
  },

  userName: {
    color: "#FFFFFF",

    fontSize: 14,
    fontWeight: "700",
  },

  location: {
    color: "rgba(255,255,255,0.85)",

    fontSize: 11,

    marginTop: 2,
  },

  /* =========================================================
     POST INFO
     ========================================================= */

  postInfo: {
    position: "absolute",

    left: 18,
    right: 18,
    bottom: 20,
  },

  postTitle: {
    color: "#FFFFFF",

    fontSize: 25,
    lineHeight: 30,

    fontWeight: "800",

    marginBottom: 7,
  },

  postDescription: {
    color: "rgba(255,255,255,0.90)",

    fontSize: 13,
    lineHeight: 18,

    marginBottom: 8,
  },

  likes: {
    color: "#FFFFFF",

    fontSize: 13,
    fontWeight: "700",
  },

  /* =========================================================
     COUNTER
     ========================================================= */

  counter: {
    position: "absolute",

    right: 12,
    top: 12,

    paddingHorizontal: 9,
    paddingVertical: 5,

    borderRadius: 10,

    backgroundColor: "rgba(0,0,0,0.45)",
  },

  counterText: {
    color: "#FFFFFF",

    fontSize: 11,
    fontWeight: "700",
  },

  /* =========================================================
     CLOSE
     ========================================================= */

  closeButton: {
    position: "absolute",

    right: 18,
    top: 45,

    width: 42,
    height: 42,

    borderRadius: 21,

    backgroundColor: "rgba(0,0,0,0.55)",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 20,
  },

  closeText: {
    color: "#FFFFFF",

    fontSize: 30,
    fontWeight: "300",

    lineHeight: 32,
  },

  /* =========================================================
     NAVIGATION
     ========================================================= */

  navigationButton: {
    position: "absolute",

    top: "52%",

    width: 44,
    height: 44,

    borderRadius: 22,

    backgroundColor: "rgba(0,0,0,0.55)",

    alignItems: "center",
    justifyContent: "center",

    zIndex: 20,
  },

  previousButton: {
    left: 12,
  },

  nextButton: {
    right: 12,
  },

  navigationText: {
    color: "#FFFFFF",

    fontSize: 35,
    fontWeight: "300",

    lineHeight: 38,
  },
});
