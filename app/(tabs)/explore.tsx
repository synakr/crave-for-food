import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import CategoryChips from "@/components/CategoryChips";
import FoodPostModal from "@/components/PostModal";
import mapStyleRedesign from "@/constants/mapStyleRedesign";
import { seedMockDatabase } from "@/data/mock/seed";
import { postRepository } from "@/data/repositories";
import type { ExplorePost } from "@/data/repositories/PostRepository";

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

export default function HomeScreen() {
  const [region, setRegion] = useState<MapRegion | null>(null);
  const [selectedPost, setSelectedPost] = useState<ExplorePost | null>(null);
  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [mapReady, setMapReady] = useState(false);

  const [loadedMarkers, setLoadedMarkers] = useState<Set<string>>(new Set());

  const mapRef = useRef<MapView>(null);

  /* LOAD POSTS */

  useEffect(() => {
    let mounted = true;

    const loadPosts = async () => {
      seedMockDatabase();

      const data = await postRepository.getExplorePosts();

      if (!mounted) return;

      await Promise.all(
        data.map((post) => Image.prefetch(post.image).catch(() => false)),
      );

      if (!mounted) return;

      setPosts(data);
    };

    loadPosts();

    return () => {
      mounted = false;
    };
  }, []);

  /* LOCATION */

  const getLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setRegion({
          latitude: 23.5335,
          longitude: 91.4845,
          latitudeDelta: 0.03,
          longitudeDelta: 0.03,
        });

        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
    } catch (error) {
      console.log("Failed to get location:", error);

      setRegion({
        latitude: 23.5335,
        longitude: 91.4845,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      });
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  /* MARKER IMAGE LOADED */

  const handleMarkerImageLoad = useCallback((postId: string) => {
    const delay = Platform.OS === "android" ? 120 : 0;

    setTimeout(() => {
      setLoadedMarkers((previous) => {
        if (previous.has(postId)) {
          return previous;
        }

        const next = new Set(previous);
        next.add(postId);

        return next;
      });
    }, delay);
  }, []);

  /* RECENTER */

  const recenterMap = useCallback(async () => {
    if (!mapReady) return;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const newRegion: MapRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(newRegion);

      mapRef.current?.animateToRegion(newRegion, 600);
    } catch (error) {
      console.log("Failed to recenter:", error);
    }
  }, [mapReady]);

  /* LOADING */

  if (!region) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* MAP */}

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        // buildingsEnabled={true}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        mapType="standard"
        showsUserLocation
        showsCompass={false}
        showsScale={false}
        customMapStyle={mapStyleRedesign}
        showsBuildings={true}
        // raisedBuildings={true}
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
        {posts.map((post) => (
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
            tracksViewChanges={!loadedMarkers.has(post.id)}
            onPress={() => {
              Image.prefetch(post.image);
              setSelectedPost(post);
            }}>
            <Image
              source={{
                uri: post.image,
              }}
              style={styles.markerImage}
              resizeMode="cover"
              fadeDuration={0}
              onLoadEnd={() => handleMarkerImageLoad(post.id)}
            />
          </Marker>
        ))}
      </MapView>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Pressable
          style={styles.circleButton}
          accessibilityRole="button"
          accessibilityLabel="Open menu">
          <Ionicons name="menu" size={24} color="#333" />
        </Pressable>

        <Pressable
          style={styles.searchBar}
          accessibilityRole="button"
          accessibilityLabel="Search food or place">
          <View style={styles.searchLeft}>
            <Ionicons name="search" size={18} color="#999" />

            <Text style={styles.searchText}>Search food or place</Text>
          </View>

          <View style={styles.divider} />

          <Ionicons name="options-outline" size={22} color="#F06B6B" />
        </Pressable>
      </View>

      {/* CATEGORIES */}

      <View style={styles.categories}>
        <CategoryChips />
      </View>

      {/* RECENTER */}

      <Pressable
        style={styles.recenterButton}
        onPress={recenterMap}
        accessibilityRole="button"
        accessibilityLabel="Recenter map">
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
    borderColor: "#FFFFFF",
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },

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
    backgroundColor: "#FFFFFF",
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
    backgroundColor: "#FFFFFF",
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

  categories: {
    position: "absolute",
    top: 128,
    left: 0,
    right: 0,
  },

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
