import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";

import ExploreSearchBar from "@/components/ExploreSearchBar";
import MapPostFocus from "@/components/MapPostFocus";
import NavigationDrawer from "@/components/NavigationDrawer";
import FoodPostModal from "@/components/PostModal";
import CreatedEventPostModal from "@/components/PostUi/EventPostModal";
import { seedMockDatabase } from "@/data/mock/seed";
import { postRepository } from "@/data/repositories";
import type { ExplorePost } from "@/data/repositories/PostRepository";

import CaptionPostModal from "@/components/PostUi/CaptionPostModal";
import type { CreatedEventPost } from "@/data/mock/eventPostStore";
import {
  getCreatedPosts,
  subscribeToCreatedPosts,
} from "@/data/mock/eventPostStore";
import type { TextPost } from "@/data/mock/textPostStore";
import { getTextPosts, subscribeToTextPosts } from "@/data/mock/textPostStore";

import ArticlePostModal from "@/components/PostUi/ArticlePostModal";
import GigPostModal from "@/components/PostUi/GigPostModal";
import type { ArticlePost } from "@/data/mock/articlePostStore";
import {
  getArticlePosts,
  subscribeToArticlePosts,
} from "@/data/mock/articlePostStore";
import type { GigPost } from "@/data/mock/gigPostStore";
import { getGigPosts, subscribeToGigPosts } from "@/data/mock/gigPostStore";

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

  // for caption post
  const [textPosts, setTextPosts] = useState(getTextPosts());

  useEffect(() => {
    const unsubscribe = subscribeToTextPosts(() => {
      setTextPosts(getTextPosts());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const [selectedTextPost, setSelectedTextPost] = useState<TextPost | null>(
    null,
  );

  // For event post
  const [createdPosts, setCreatedPosts] =
    useState<CreatedEventPost[]>(getCreatedPosts());

  const [selectedCreatedPost, setSelectedCreatedPost] =
    useState<CreatedEventPost | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToCreatedPosts(() => {
      setCreatedPosts(getCreatedPosts());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // For Article based posts:
  const [articlePosts, setArticlePosts] = useState(getArticlePosts());
  const [selectedArticlePost, setSelectedArticlePost] =
    useState<ArticlePost | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToArticlePosts(() => {
      setArticlePosts(getArticlePosts());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // for gig post
  const [gigPosts, setGigPosts] = useState(getGigPosts());
  const [selectedGigPost, setSelectedGigPost] = useState<GigPost | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToGigPosts(() => {
      setGigPosts(getGigPosts());
    });

    return () => {
      unsubscribe();
    };
  }, []);

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

        {/* event post marker */}
        {createdPosts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            anchor={{
              x: 0.5,
              y: 1,
            }}
            onPress={() => setSelectedCreatedPost(post)}>
            <View style={styles.createdMarker}>
              <Text style={styles.createdMarkerText} numberOfLines={2}>
                {post.title}
              </Text>
            </View>
          </Marker>
        ))}

        {/* Text/Caption post markers */}

        {/* Text/Caption post markers */}
        {textPosts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            onPress={() => setSelectedTextPost(post)}>
            <View style={styles.textPostMarkerContainer}>
              {post.emoji ? (
                <View style={styles.textPostMarkerEmoji}>
                  <Text style={styles.textPostMarkerEmojiText}>
                    {post.emoji}
                  </Text>
                </View>
              ) : null}

              <View style={styles.textPostMarker}>
                <Text style={styles.textPostMarkerText} numberOfLines={3}>
                  {post.text}
                </Text>
              </View>
            </View>
          </Marker>
        ))}

        {/* Article based markers */}
        {articlePosts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            onPress={() => setSelectedArticlePost(post)}>
            <View style={styles.articleMarker}>
              <Ionicons name="book-outline" size={16} color="#FFFFFF" />
              <Text style={styles.articleMarkerText} numberOfLines={2}>
                {post.title}
              </Text>
            </View>
          </Marker>
        ))}

        {/* Gig based marker */}
        {gigPosts.map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}
            anchor={{ x: 0.5, y: 1 }}
            onPress={() => setSelectedGigPost(post)}>
            <View style={styles.gigMarker}>
              <Ionicons name="briefcase-outline" size={16} color="#FFFFFF" />
              <Text style={styles.gigMarkerText} numberOfLines={2}>
                {post.title}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Caption post modal */}
      {selectedTextPost && (
        <CaptionPostModal
          post={selectedTextPost}
          onClose={() => setSelectedTextPost(null)}
        />
      )}

      {/* Article modal */}
      {selectedArticlePost && (
        <ArticlePostModal
          post={selectedArticlePost}
          onClose={() => setSelectedArticlePost(null)}
        />
      )}

      {/* Gig based modal */}
      {selectedGigPost && (
        <GigPostModal
          post={selectedGigPost}
          onClose={() => setSelectedGigPost(null)}
        />
      )}

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

      {selectedCreatedPost && (
        <CreatedEventPostModal
          post={selectedCreatedPost}
          onClose={() => setSelectedCreatedPost(null)}
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

  // event marker
  createdMarker: {
    maxWidth: 170,
    minWidth: 90,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#111111",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.18,
    shadowRadius: 5,
    elevation: 5,
  },

  createdMarkerText: {
    fontSize: 13,
    lineHeight: 17,
    fontWeight: "700",
    color: "#111111",
    textAlign: "center",
  },

  // caption based post
  textPostMarker: {
    maxWidth: 190,
    minWidth: 90,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: "#FFF0F5",
    borderWidth: 1.5,
    borderColor: "#FFFFFF",
    shadowColor: "#9D5575",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 6,
  },

  textPostMarkerText: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "700",
    color: "#743B55",
    textAlign: "center",
  },

  textPostMarkerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  textPostMarkerEmoji: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#FFF0F5",
    elevation: 5,
    shadowColor: "#9D5575",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 5,
  },

  textPostMarkerEmojiText: {
    fontSize: 22,
    textAlign: "center",
  },

  // caption post modal
  textPostModalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  textPostModal: {
    backgroundColor: "#F8F6F3",
    padding: 16,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  textPostModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  textPostModalTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#202020",
  },

  // For styling article based post
  articleMarker: {
    maxWidth: 190,
    minWidth: 110,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#725B4D",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 6,
  },
  articleMarkerText: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // gig marker style
  gigMarker: {
    maxWidth: 190,
    minWidth: 100,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#477B69",
    borderWidth: 2,
    borderColor: "#FFFFFF",
    elevation: 6,
  },
  gigMarkerText: {
    flexShrink: 1,
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
