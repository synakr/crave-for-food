import { Ionicons } from "@expo/vector-icons";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    interpolateColor,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

const AnimatedIonicons = Animated.createAnimatedComponent(Ionicons);

const PLUS_SIZE = 58;
const MENU_ACTION_SIZE = 52;

const MIN_SELECTION_DISTANCE = 30;
const SELECTION_CONE_DEGREES = 40;
const SELECTION_CONE_RADIANS = (SELECTION_CONE_DEGREES * Math.PI) / 180;

const MENU_ACTIONS = [
  {
    label: "Placeholder",
    icon: "ellipsis-horizontal" as const,
    x: 0,
    y: -82,
  },
  {
    label: "Placeholder",
    icon: "ellipsis-horizontal" as const,
    x: -58,
    y: -58,
  },
  {
    label: "Caption Post",
    icon: "text" as const,
    x: -82,
    y: 0,
  },
] as const;

type CreateActionButtonProps = Pick<BottomTabBarProps, "navigation">;

export default function CreateActionButton({
  navigation,
}: CreateActionButtonProps) {
  const menuVisible = useSharedValue(0);
  const selectedAction = useSharedValue(-1);

  // Controls the radial expansion/collapse.
  // 0 = inside plus button
  // 1 = fully expanded
  const radialProgress = useSharedValue(0);

  /* -------------------------------------------------------------------------- */
  /* Actions                                                                    */
  /* -------------------------------------------------------------------------- */

  const handleUpload = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled) {
      return;
    }

    const image = result.assets[0];

    navigation.navigate("explore", {
      uploadedImage: image.uri,
      uploadId: Date.now().toString(),
    });
  };

  const handleCaptionPost = () => {
    router.push("/create-post");
  };

  const executeMenuAction = (actionIndex: number) => {
    if (actionIndex === 2) {
      handleCaptionPost();
    }
  };

  /* -------------------------------------------------------------------------- */
  /* Gestures                                                                   */
  /* -------------------------------------------------------------------------- */

  const tapGesture = Gesture.Tap()
    .maxDuration(450)
    .onEnd((_event, success) => {
      if (success) {
        scheduleOnRN(handleUpload);
      }
    });

  const radialGesture = Gesture.Pan()
    .minDistance(0)
    .activateAfterLongPress(450)

    .onStart(() => {
      menuVisible.value = withSpring(1, {
        damping: 16,
        stiffness: 240,
      });

      /*
       * Spring the actions outward from the plus button.
       */
      radialProgress.value = withSpring(1, {
        damping: 13,
        stiffness: 220,
        mass: 0.7,
      });

      selectedAction.value = -1;
    })

    .onUpdate((event) => {
      const distance = Math.hypot(event.translationX, event.translationY);

      /*
       * Ignore tiny movements around the plus button.
       */
      if (distance < MIN_SELECTION_DISTANCE) {
        selectedAction.value = -1;
        return;
      }

      const fingerAngle = Math.atan2(event.translationY, event.translationX);

      let closestAction = -1;
      let smallestAngleDifference = Number.POSITIVE_INFINITY;

      /*
       * Determine which radial direction the
       * user's finger is pointing toward.
       */
      MENU_ACTIONS.forEach((action, index) => {
        const actionAngle = Math.atan2(action.y, action.x);

        let angleDifference = Math.abs(fingerAngle - actionAngle);

        /*
         * Normalize angle difference.
         *
         * Example:
         * 359° and 1° => 2° apart
         */
        if (angleDifference > Math.PI) {
          angleDifference = 2 * Math.PI - angleDifference;
        }

        if (angleDifference < smallestAngleDifference) {
          smallestAngleDifference = angleDifference;

          closestAction = index;
        }
      });

      /*
       * Lock the closest action when the finger
       * enters its directional selection cone.
       */
      selectedAction.value =
        smallestAngleDifference <= SELECTION_CONE_RADIANS ? closestAction : -1;
    })

    .onEnd(() => {
      const actionIndex = selectedAction.value;

      /*
       * Immediately begin collapsing back into
       * the plus button.
       */
      radialProgress.value = withSpring(0, {
        damping: 15,
        stiffness: 260,
        mass: 0.5,
      });

      menuVisible.value = withSpring(0, {
        damping: 18,
        stiffness: 240,
      });

      selectedAction.value = -1;

      /*
       * Execute only after the finger is released.
       */
      if (actionIndex >= 0) {
        scheduleOnRN(executeMenuAction, actionIndex);
      }
    })

    .onFinalize(() => {
      /*
       * Safety reset if the gesture gets cancelled.
       */
      radialProgress.value = withSpring(0, {
        damping: 15,
        stiffness: 260,
        mass: 0.5,
      });

      menuVisible.value = withSpring(0);

      selectedAction.value = -1;
    });

  /*
   * Short tap → camera.
   * Long press → radial menu.
   */
  const buttonGesture = Gesture.Exclusive(tapGesture, radialGesture);

  /* -------------------------------------------------------------------------- */
  /* Menu animations                                                            */
  /* -------------------------------------------------------------------------- */

  const firstMenuActionStyle = useAnimatedStyle(() => {
    const selected = selectedAction.value === 0;

    return {
      opacity: menuVisible.value,

      backgroundColor: interpolateColor(
        selected ? 1 : 0,
        [0, 1],
        ["#FFFFFF", "#040404"],
      ),

      transform: [
        {
          translateX: MENU_ACTIONS[0].x * radialProgress.value,
        },
        {
          translateY: MENU_ACTIONS[0].y * radialProgress.value,
        },
        {
          scale: withSpring(selected ? 1.16 : 1, {
            damping: 14,
            stiffness: 220,
          }),
        },
      ],
    };
  });

  const secondMenuActionStyle = useAnimatedStyle(() => {
    const selected = selectedAction.value === 1;

    return {
      opacity: menuVisible.value,

      backgroundColor: interpolateColor(
        selected ? 1 : 0,
        [0, 1],
        ["#FFFFFF", "#040404"],
      ),

      transform: [
        {
          translateX: MENU_ACTIONS[1].x * radialProgress.value,
        },
        {
          translateY: MENU_ACTIONS[1].y * radialProgress.value,
        },
        {
          scale: withSpring(selected ? 1.16 : 1, {
            damping: 14,
            stiffness: 220,
          }),
        },
      ],
    };
  });

  const thirdMenuActionStyle = useAnimatedStyle(() => {
    const selected = selectedAction.value === 2;

    return {
      opacity: menuVisible.value,

      backgroundColor: interpolateColor(
        selected ? 1 : 0,
        [0, 1],
        ["#FFFFFF", "#040404"],
      ),

      transform: [
        {
          translateX: MENU_ACTIONS[2].x * radialProgress.value,
        },
        {
          translateY: MENU_ACTIONS[2].y * radialProgress.value,
        },
        {
          scale: withSpring(selected ? 1.16 : 1, {
            damping: 14,
            stiffness: 220,
          }),
        },
      ],
    };
  });

  /* -------------------------------------------------------------------------- */
  /* Icon animations                                                            */
  /* -------------------------------------------------------------------------- */

  const firstIconStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectedAction.value === 0 ? 1 : 0,
      [0, 1],
      ["#111111", "#FFFFFF"],
    ),
  }));

  const secondIconStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectedAction.value === 1 ? 1 : 0,
      [0, 1],
      ["#111111", "#FFFFFF"],
    ),
  }));

  const thirdIconStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      selectedAction.value === 2 ? 1 : 0,
      [0, 1],
      ["#111111", "#FFFFFF"],
    ),
  }));

  const menuActionStyles = [
    firstMenuActionStyle,
    secondMenuActionStyle,
    thirdMenuActionStyle,
  ];

  const iconStyles = [firstIconStyle, secondIconStyle, thirdIconStyle];

  /* -------------------------------------------------------------------------- */
  /* Render                                                                     */
  /* -------------------------------------------------------------------------- */

  return (
    <GestureDetector gesture={buttonGesture}>
      <View style={styles.plusButtonContainer}>
        <View pointerEvents="none" style={styles.menuLayer}>
          {MENU_ACTIONS.map((action, index) => (
            <Animated.View
              key={`${action.label}-${index}`}
              style={[styles.menuAction, menuActionStyles[index]]}>
              <AnimatedIonicons
                name={action.icon}
                size={22}
                style={iconStyles[index]}
              />
            </Animated.View>
          ))}
        </View>

        <View style={styles.plusButton}>
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </View>
      </View>
    </GestureDetector>
  );
}

/* -------------------------------------------------------------------------- */
/* Styles                                                                     */
/* -------------------------------------------------------------------------- */

const styles = StyleSheet.create({
  plusButtonContainer: {
    width: PLUS_SIZE,
    height: PLUS_SIZE,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  menuLayer: {
    position: "absolute",
    left: PLUS_SIZE / 2,
    top: PLUS_SIZE / 2,
    width: 1,
    height: 1,
    zIndex: 20,
  },

  menuAction: {
    position: "absolute",

    left: -MENU_ACTION_SIZE / 2,
    top: -MENU_ACTION_SIZE / 2,

    width: MENU_ACTION_SIZE,
    height: MENU_ACTION_SIZE,

    borderRadius: MENU_ACTION_SIZE / 2,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "rgba(17,17,17,0.12)",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.16,
    shadowRadius: 5,

    elevation: 4,
  },

  plusButton: {
    width: PLUS_SIZE,
    height: PLUS_SIZE,

    borderRadius: PLUS_SIZE / 2,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#040404",

    borderWidth: 2,
    borderColor: "#FFFFFF",

    ...(Platform.OS === "android"
      ? {
          elevation: 5,
        }
      : {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.18,
          shadowRadius: 6,
        }),
  },
});
