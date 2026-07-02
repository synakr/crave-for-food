import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import * as Location from "expo-location";

import * as ImagePicker from "expo-image-picker";

import { Ionicons } from "@expo/vector-icons";
import mapStyle from "@/constants/mapStyle";
import { FOOD_POSTS } from "@/data/FoodPost";
import FoodPostModal from "@/components/FoodPostModal";
import CategoryChips from "@/components/CategoryChips";



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

  const mapRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

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
        <ActivityIndicator size="large" />
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
        loadingBackgroundColor="#F8F4F2"
      >

        {/* floating images */}
        {[...FOOD_POSTS, ...userPosts].map((post) => (
        <Marker
          key={post.id}
          coordinate={{
            latitude: post.latitude,
            longitude: post.longitude,
          }}
          anchor={{ x: 0.5, y: 1.25 }}
          onPress={() => setSelectedPost(post)}
        >
          <Image
            source={{ uri: post.image }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 10,
              borderWidth: 3,
              borderColor: "#fff",
              backgroundColor: "#fff",
            }}
          />
        </Marker>
      ))}
      </MapView>

      <View style={styles.searchContainer}>
        <Pressable style={styles.circleButton}>
          <Ionicons name="menu" size={24} color="#333" />
        </Pressable>

        <Pressable style={styles.searchBar}>
        <View style={styles.searchLeft}>
          <Ionicons
            name="search"
            size={18}
            color="#999"
          />

          <Text style={styles.searchText}>
            Search food or place
          </Text>
        </View>

        <View style={styles.divider} />

        <Ionicons
          name="options-outline"
          size={22}
          color="#F06B6B"
        />
      </Pressable>
      </View>

      <View style={styles.categories}>
        <CategoryChips />
      </View>

      <Pressable
        style={styles.navigationButton}
        onPress={() => {
          // TODO: Open navigation
        }}
      >
        <Ionicons
          name="navigate"
          size={22}
          color="#F06B6B"
        />
      </Pressable>

      <Pressable
        style={styles.recenterButton}
        onPress={recenterMap}
      >
        <Ionicons
          name="locate"
          size={22}
          color="#8F6F6F"
        />
      </Pressable>

      {!selectedPost && (
      <Pressable
        style={styles.fab}
        onPress={pickImage}
      >
        <Ionicons
          name="add"
          size={30}
          color="#fff"
        />
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

searchBar: {
  flex: 1,
  height: 56,

  marginHorizontal: 12,

  borderRadius: 28,
  backgroundColor: "#FFF",

  flexDirection: "row",
  alignItems: "center",

  paddingHorizontal: 18,

  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowRadius: 10,
  shadowOffset: {
    width: 0,
    height: 4,
  },

  elevation: 4,

  justifyContent: "space-between",

},

  // searchText: {
  //   marginLeft: 10,
  // fontSize: 16,
  // color: "#7A7A7A",
  // fontWeight: "500",
  // },

  fab: {
    position: "absolute",

    bottom: 105, // <-- moved above the floating tab bar
    right: 22,

    width: 64,
    height: 64,

    borderRadius: 32,

    backgroundColor: "#F06B6B",

    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#B88A8A",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.22,
    shadowRadius: 24,

    elevation: 20,

    zIndex: 9999,
  },

  modalContainer: {
    flex: 1,

    justifyContent: "flex-end",

    backgroundColor: "rgba(110,80,80,0.22)",
  },

  modalContent: {
    backgroundColor: "#FFF8F6",

    padding: 22,
    paddingBottom: 36,

    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  handle: {
    width: 56,
    height: 6,

    borderRadius: 999,

    backgroundColor: "#D9B8B8",

    alignSelf: "center",

    marginBottom: 22,
  },

  modalImage: {
    width: "100%",
    height: 260,
    borderRadius: 24,
  },

  title: {
    fontSize: 27,
    fontWeight: "700",

    marginTop: 18,

    color: "#352727",
  },

  description: {
    marginTop: 12,

    color: "#7D6666",

    fontSize: 16,

    lineHeight: 25,
  },

  closeButton: {
    marginTop: 28,

    backgroundColor: "#C89B9B",

    paddingVertical: 17,

    borderRadius: 18,

    alignItems: "center",
  },

  closeText: {
    color: "#FFF",

    fontSize: 16,

    fontWeight: "700",
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
categories: {
  position: "absolute",
  top: 128, // just below the search bar
  left: 0,
  right: 0,
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

});
