import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Image, Platform, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

import ExploreSearchBar from "@/components/ExploreSearchBar";
import MapPostFocus from "@/components/MapPostFocus";
import NavigationDrawer from "@/components/NavigationDrawer";
import FoodPostModal from "@/components/PostModal";
import { seedMockDatabase } from "@/data/mock/seed";
import { postRepository } from "@/data/repositories";
import type { ExplorePost } from "@/data/repositories/PostRepository";

interface MapRegion {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

const FALLBACK_REGION: MapRegion = {
  latitude: 23.5335,
  longitude: 91.4845,
  latitudeDelta: 0.03,
  longitudeDelta: 0.03,
};

export default function HomeScreen() {
  const [region, setRegion] = useState<MapRegion>(FALLBACK_REGION);
  const [selectedPost, setSelectedPost] = useState<ExplorePost | null>(null);

  // Focused post for long-press interaction
  const [focusedPost, setFocusedPost] = useState<ExplorePost | null>(null);

  // Screen position where the focus animation should originate
  const [focusOrigin, setFocusOrigin] = useState({
    x: 0,
    y: 0,
  });

  const [posts, setPosts] = useState<ExplorePost[]>([]);
  const [mapReady, setMapReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [loadedMarkers, setLoadedMarkers] = useState<Set<string>>(new Set());

  const mapRef = useRef<MapView>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  /*
   * Get the index of the currently focused post.
   */
  const getPostIndexById = useCallback(
    (postId: string) => posts.findIndex((post) => post.id === postId),
    [posts],
  );

  const focusedIndex = useMemo(() => {
    if (!focusedPost) {
      return -1;
    }

    return getPostIndexById(focusedPost.id);
  }, [focusedPost, getPostIndexById]);

  /*
   * Navigate between focused posts.
   */
  const navigateFocusedPost = useCallback(
    (direction: "previous" | "next") => {
      if (!focusedPost || focusedIndex < 0) {
        return;
      }

      const nextIndex =
        direction === "next" ? focusedIndex + 1 : focusedIndex - 1;

      if (nextIndex >= 0 && nextIndex < posts.length) {
        setFocusedPost(posts[nextIndex]);
      }
    },
    [focusedIndex, focusedPost, posts],
  );

  /* =========================
     LOAD POSTS
  ========================= */

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

  /* =========================
     LOCATION
  ========================= */

  const getLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});

      const userRegion: MapRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      };

      setRegion(userRegion);
      mapRef.current?.animateToRegion(userRegion, 600);
    } catch (error) {
      console.log("Failed to get location:", error);
    }
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  /* =========================
     MARKER IMAGE LOADED
  ========================= */

  const handleMarkerImageLoad = useCallback((postId: string) => {
    const delay = Platform.OS === "android" ? 250 : 0;

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

  /* =========================
     MARKER PRESS
  ========================= */

  const handleMarkerPress = useCallback((post: ExplorePost) => {
    Image.prefetch(post.image);
    setSelectedPost(post);
  }, []);

  const focusPost = useCallback(async (post: ExplorePost) => {
    if (!mapRef.current) {
      return;
    }

    try {
      const point = await mapRef.current.pointForCoordinate({
        latitude: post.latitude,
        longitude: post.longitude,
      });

      setFocusOrigin({
        x: point.x,
        y: point.y,
      });
    } catch (error) {
      console.log("Failed to calculate marker position:", error);

      setFocusOrigin({
        x: 0,
        y: 0,
      });
    }

    setFocusedPost(post);
  }, []);

  /* =========================
     RECENTER
  ========================= */

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

  /* =========================
     LONG PRESS
  ========================= */

  const handleMapLongPress = useCallback(
    async (latitude: number, longitude: number) => {
      if (!posts.length || !mapRef.current) {
        return;
      }

      const nearbyPost = posts.reduce<{
        post: ExplorePost;
        distance: number;
      } | null>((closest, post) => {
        const latDiff = post.latitude - latitude;
        const lonDiff = post.longitude - longitude;

        const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);

        if (!closest || distance < closest.distance) {
          return {
            post,
            distance,
          };
        }

        return closest;
      }, null);

      if (!nearbyPost) {
        return;
      }

      await focusPost(nearbyPost.post);
    },
    [focusPost, posts],
  );

  /* =========================
     LOCATION SEARCH
  ========================= */

  const handleSearch = useCallback(async () => {
    const query = searchQuery.trim();

    if (!query) {
      return;
    }

    try {
      const results = await Location.geocodeAsync(query);

      if (!results.length) {
        console.log("Location not found:", query);
        return;
      }

      const { latitude, longitude } = results[0];

      const newRegion: MapRegion = {
        latitude,
        longitude,
        latitudeDelta: 0.08,
        longitudeDelta: 0.08,
      };

      setRegion(newRegion);

      mapRef.current?.animateToRegion(newRegion, 800);
    } catch (error) {
      console.error("Location search failed:", error);
    }
  }, [searchQuery]);

  /* =========================
     LOADING
  ========================= */

  return (
    <View style={styles.container}>
      {/* =========================
          MAP
      ========================= */}

      <MapView
        ref={mapRef}
        // provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFill}
        initialRegion={region}
        mapType="standard"
        showsUserLocation
        showsCompass={false}
        showsScale={false}
        // customMapStyle={mapStyle}
        showsBuildings
        showsTraffic={false}
        showsIndoors={false}
        toolbarEnabled={false}
        moveOnMarkerPress={false}
        rotateEnabled
        pitchEnabled
        showsMyLocationButton={false}
        onMapReady={() => setMapReady(true)}
        onLongPress={(event) => {
          const { latitude, longitude } = event.nativeEvent.coordinate;

          handleMapLongPress(latitude, longitude);
        }}
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
            onPress={() => handleMarkerPress(post)}>
            <Pressable onLongPress={() => focusPost(post)} delayLongPress={500}>
              <Image
                source={{
                  uri: post.image,
                }}
                style={styles.markerImage}
                resizeMode="cover"
                fadeDuration={0}
                onLoad={() => handleMarkerImageLoad(post.id)}
              />
            </Pressable>
          </Marker>
        ))}
      </MapView>

      {/* =========================
          SEARCH + CATEGORIES
      ========================= */}

      <ExploreSearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearch={handleSearch}
        onFilterPress={() => {}}
        onMenuPress={() => setDrawerOpen(true)}
      />

      <NavigationDrawer
        visible={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        onChallengePress={() => {
          // TODO: navigate to Challenge
        }}
      />

      {/* =========================
          RECENTER
      ========================= */}

      <Pressable
        style={styles.recenterButton}
        onPress={recenterMap}
        accessibilityRole="button"
        accessibilityLabel="Recenter map">
        <Ionicons name="locate" size={22} color="#8F6F6F" />
      </Pressable>

      {/* =========================
          POST MODAL
      ========================= */}

      {selectedPost && (
        <FoodPostModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
        />
      )}

      {/* =========================
          MAP POST FOCUS
      ========================= */}

      {focusedPost && (
        <MapPostFocus
          post={focusedPost}
          posts={posts}
          index={focusedIndex}
          total={posts.length}
          originX={focusOrigin.x}
          originY={focusOrigin.y}
          onPrevious={() => navigateFocusedPost("previous")}
          onNext={() => navigateFocusedPost("next")}
          onClose={() => setFocusedPost(null)}
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
