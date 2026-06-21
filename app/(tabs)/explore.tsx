import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MapView, { Marker } from "react-native-maps";

import * as Location from "expo-location";

import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";

const FOOD_POSTS = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836",
    title: "Momos near Matabari",
    description: "Hot momos just outside the temple area.",
    latitude: 23.5335,
    longitude: 91.4845,
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    title: "Pizza Point",
    description: "Small pizza shop near Chandrapur.",
    latitude: 23.5298,
    longitude: 91.4888,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349",
    title: "Burger Hub",
    description: "Popular burger stall near Rajarbag.",
    latitude: 23.5242,
    longitude: 91.4932,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    title: "Hidden Café",
    description: "Quiet café overlooking the lake.",
    latitude: 23.5368,
    longitude: 91.4901,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591",
    title: "Late Night Pizza",
    description: "Open till late near the market.",
    latitude: 23.5273,
    longitude: 91.4824,
  },
];

export default function HomeScreen() {
  const [region, setRegion] = useState<any>(null);

  const [selectedPost, setSelectedPost] = useState<any>(null);

  const [userPosts, setUserPosts] = useState<any[]>([]);

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
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        showsUserLocation
        showsCompass={false}
        showsScale={false}
        showsBuildings={true}
        showsTraffic={false}
        showsIndoors={false}
        toolbarEnabled={false}
        mapType={Platform.OS === "ios" ? "mutedStandard" : "standard"}
        moveOnMarkerPress={false}>
        {[...FOOD_POSTS, ...userPosts].map((post) => (
          <Marker
            key={post.id}
            coordinate={{
              latitude: post.latitude,
              longitude: post.longitude,
            }}>
            <Pressable onPress={() => setSelectedPost(post)}>
              <Image source={{ uri: post.image }} style={styles.markerImage} />
            </Pressable>
          </Marker>
        ))}
      </MapView>

      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#777" />

        <Text style={styles.searchText}>Discover food nearby</Text>
      </View>

      <Pressable style={styles.fab} onPress={pickImage}>
        <Ionicons name="add" size={32} color="#fff" />
      </Pressable>

      <Modal visible={!!selectedPost} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.handle} />

            <Image
              source={{ uri: selectedPost?.image }}
              style={styles.modalImage}
            />

            <Text style={styles.title}>{selectedPost?.title}</Text>

            <Text style={styles.description}>{selectedPost?.description}</Text>

            <Pressable
              style={styles.closeButton}
              onPress={() => setSelectedPost(null)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    backgroundColor: "#fff",
  },

  searchBar: {
    position: "absolute",
    top: 70,
    left: 20,
    right: 20,

    flexDirection: "row",
    alignItems: "center",
    gap: 10,

    backgroundColor: "rgba(255,255,255,0.92)",

    paddingHorizontal: 18,
    paddingVertical: 16,

    borderRadius: 100,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  searchText: {
    color: "#777",
    fontSize: 15,
  },

  markerImage: {
    width: 64,
    height: 64,
    borderRadius: 100,

    borderWidth: 4,
    borderColor: "#fff",

    backgroundColor: "#eee",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.18,
    shadowRadius: 10,

    elevation: 10,
  },

  fab: {
    position: "absolute",
    bottom: 40,
    right: 24,

    width: 68,
    height: 68,
    borderRadius: 100,

    backgroundColor: "#111",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 12,

    elevation: 10,
  },

  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.35)",
  },

  modalContent: {
    backgroundColor: "#FAFAFA",

    padding: 20,
    paddingBottom: 35,

    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
  },

  handle: {
    width: 50,
    height: 5,
    borderRadius: 100,
    backgroundColor: "#DDD",

    alignSelf: "center",
    marginBottom: 18,
  },

  modalImage: {
    width: "100%",
    height: 260,
    borderRadius: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    color: "#111",
  },

  description: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },

  closeButton: {
    marginTop: 24,
    backgroundColor: "#111",
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
  },

  closeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
