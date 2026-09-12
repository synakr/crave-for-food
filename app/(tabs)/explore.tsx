import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  View
} from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";

import { Ionicons } from "@expo/vector-icons";

import CategoryChips from "@/components/CategoryChips";
import FoodPostModal from "@/components/FoodPostModal";
import mapStyle from "@/constants/mapStyle";
import { FOOD_POSTS } from "@/data/FoodPost";

export default function HomeScreen() {
  const [region, setRegion] = useState<any>(null);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [userPosts, setUserPosts] = useState<any[]>([]);

  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const { uploadedImage, uploadId } = useLocalSearchParams<{
    uploadedImage?: string;
    uploadId?: string;
  }>();

  /* ================================
     LOCATION
  ================================= */

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

  /* ================================
     HANDLE UPLOAD FROM TAB BAR
  ================================= */

  useEffect(() => {
    if (!uploadedImage || !region) return;

    const newPost = {
      id: uploadId ?? Date.now().toString(),
      image: uploadedImage,
      title: "New Food Spot",
      description: "Freshly uploaded from this location.",
      latitude: region.latitude,
      longitude: region.longitude,
    };

    setUserPosts((prev) => {
      // Prevent duplicate post when navigation params
      // are processed more than once.
      if (prev.some((post) => String(post.id) === String(newPost.id))) {
        return prev;
      }

      return [...prev, newPost];
    });
  }, [uploadedImage, uploadId, region]);

  /* ================================
     RECENTER
  ================================= */

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

  /* ================================
     LOADING
  ================================= */

  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /* ================================
     RENDER
  ================================= */

  return (
    <View style={styles.container}>
      {/* MAP */}

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
        rotateEnabled
        pitchEnabled
        showsMyLocationButton={false}
        onMapReady={() => setMapReady(true)}
        loadingIndicatorColor="#C89B9B"
        loadingBackgroundColor="#F8F4F2">
        {/* FOOD POSTS */}

        {[...FOOD_POSTS, ...userPosts].map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            anchor={{
              x: 0.5,
              y: 1.25,
            }}
            onPress={() => setSelectedPost(post)}>
            <Image
              source={{
                uri: post.image,
              }}
              style={styles.markerImage}
            />
          </Marker>
        ))}
      </MapView>

      {/* SEARCH */}

      {/* <View style={styles.searchContainer}>
        <Pressable style={styles.circleButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </Pressable>

        <Pressable style={styles.searchBar}>
          <View style={styles.searchLeft}>
            <Ionicons name="search" size={18} color="#999" />

            <Text style={styles.searchText}>Search food or place</Text>
          </View>

          <View style={styles.divider} />

          <Ionicons name="options-outline" size={22} color="#F06B6B" />
        </Pressable>
      </View> */}

      {/* CATEGORIES */}

      <View style={styles.categories}>
        <CategoryChips />
      </View>

      {/* NAVIGATION */}

      {/* <Pressable
        style={styles.navigationButton}
        onPress={() => {
          // TODO: Open navigation
        }}>
        <Ionicons name="navigate" size={22} color="#F06B6B" />
      </Pressable> */}

      {/* RECENTER */}

      <Pressable style={styles.recenterButton} onPress={recenterMap}>
        <Ionicons name="locate" size={22} color="#8F6F6F" />
      </Pressable>

      {/* POST MODAL */}

      {selectedPost && (
        <FoodPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}
    </View>
  );
}

/* ================================
   STYLES
================================= */

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

  /* MAP MARKER */

  markerImage: {
    width: 56,
    height: 56,

    borderRadius: 10,

    borderWidth: 3,
    borderColor: "#fff",

    backgroundColor: "#fff",
  },

  /* SEARCH */

  searchContainer: {
    position: "absolute",

    top: 60,
    left: 16,
    right: 16,

    flexDirection: "row",
    alignItems: "center",

    zIndex: 100,
  },

  circleButton: {
    width: 56,
    height: 56,

    borderRadius: 28,

    backgroundColor: "#FFF",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  searchBar: {
    flex: 1,

    height: 56,

    marginHorizontal: 12,

    borderRadius: 28,

    backgroundColor: "#FFF",

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 18,

    justifyContent: "space-between",

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  searchLeft: {
    flexDirection: "row",
    alignItems: "center",

    flex: 1,
  },

  searchText: {
    marginLeft: 10,

    fontSize: 16,

    color: "#7A7A7A",

    fontWeight: "500",
  },

  divider: {
    width: 1,
    height: 24,

    backgroundColor: "#ECECEC",

    marginHorizontal: 14,
  },

  /* CATEGORIES */

  categories: {
    position: "absolute",

    top: 128,

    left: 0,
    right: 0,
  },

  /* NAVIGATION */

  navigationButton: {
    position: "absolute",

    right: 22,
    bottom: 242,

    width: 54,
    height: 54,

    borderRadius: 27,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,248,246,0.92)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",

    shadowColor: "#B88A8A",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.12,
    shadowRadius: 18,

    elevation: 10,
  },

  /* RECENTER */

  recenterButton: {
    position: "absolute",

    right: 22,
    bottom: 178,

    width: 54,
    height: 54,

    borderRadius: 27,

    justifyContent: "center",
    alignItems: "center",

    backgroundColor: "rgba(255,248,246,0.92)",

    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.6)",

    shadowColor: "#B88A8A",

    shadowOffset: {
      width: 0,
      height: 8,
    },

    shadowOpacity: 0.12,
    shadowRadius: 18,

    elevation: 10,
  },
});
