import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image, Platform, Pressable,
  StyleSheet,
  View
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import FoodPostModal from "@/components/FoodPostModal";
import mapStyle from "@/constants/mapStyle";
import { FOOD_POSTS } from "@/data/FoodPost";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [region, setRegion] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") return;

      const location = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } catch (error) {
      setRegion({
        latitude: 23.5335,
        longitude: 91.4845,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    }
  };

  const recenterMap = async () => {
    if (!mapReady) return;
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 600);
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (result.canceled) return;

    const image = result.assets[0];

    const newPost = {
      id: Date.now(),
      image: image.uri,
      title: "New Food Spot",
      description: "Freshly uploaded from this location.",
      latitude: region.latitude,
      longitude: region.longitude,
    };

    setUserPosts((prev) => [...prev, newPost]);
  };

  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#FF3B7A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        customMapStyle={mapStyle}
        mapType="standard"
        showsUserLocation
        showsCompass={false}
        showsScale={false}
        showsBuildings
        showsTraffic={false}
        showsIndoors={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        rotateEnabled={true}
        pitchEnabled={true}
        showsMyLocationButton={false}
        onMapReady={() => setMapReady(true)}
        loadingIndicatorColor="#C89B9B"
        loadingBackgroundColor="#F8F4F2">
        {[...FOOD_POSTS, ...userPosts].map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            anchor={{ x: 0.5, y: 1.25 }}
            onPress={() => setSelectedPost(post)}>
            <Image source={{ uri: post.image }} style={styles.markerImage} />
          </Marker>
        ))}
      </MapView>

      {/* Top Right Floating Menu Button */}
      <Pressable
        style={[styles.circleButton, { top: insets.top + 10 }]}
        onPress={() => {
          // Open menu bubble
        }}>
        <Ionicons name="menu" size={24} color="#E6004C" />
      </Pressable>

      <Pressable style={styles.recenterButton} onPress={recenterMap}>
        <Ionicons name="locate" size={22} color="#FF1A66" />
      </Pressable>

      {!selectedPost && (
        <Pressable
          style={[styles.fab, { top: insets.top + 10 }]}
          onPress={pickImage}>
          <Ionicons name="add" size={28} color="#FF1A66" />
        </Pressable>
      )}

      {selectedPost && (
        <FoodPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F4F2",
  },
  markerImage: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#fff",
    backgroundColor: "#fff",
  },
  circleButton: {
    position: "absolute",
    right: 18,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    zIndex: 100,
    shadowColor: "#FF4D88",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 8,
  },
  fab: {
    position: "absolute",
    left: 18, // Placed on top-left matching the design mockup
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    zIndex: 100,

    // Soft ambient rose glow matching the top-right menu button
    shadowColor: "#FF4D88",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 8,
  },
  recenterButton: {
    position: "absolute",
    right: 18,
    top: 120, // Clean clearance below top menu button
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    zIndex: 100,

    // Matching ambient rose-glow drop shadow
    ...Platform.select({
      ios: {
        shadowColor: "#FF4D88",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.14,
        shadowRadius: 14,
      },
      android: {
        elevation: 6,
      },
    }),
  },
});
