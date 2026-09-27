import React, { useEffect, useRef, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import mapStyleRedesign from "../constants/mapStyleRedesign";
import { ExplorePost } from "../data/repositories/PostRepository";

interface FocusedMiniMapProps {
  post: ExplorePost;
  posts: ExplorePost[];
}

const MAP_PADDING = 0.01;

const MAP_ZOOM = 15;
const MAP_PITCH = 45;

export default function FocusedMiniMap({ post, posts }: FocusedMiniMapProps) {
  const mapRef = useRef<MapView>(null);

  const [mapReady, setMapReady] = useState(false);
  const [selectedMarkerLoaded, setSelectedMarkerLoaded] = useState(false);
  const [loadedNearbyMarkers, setLoadedNearbyMarkers] = useState<Set<string>>(
    new Set(),
  );

  /*
   * Reset marker image state whenever
   * the focused post changes.
   */
  useEffect(() => {
    setSelectedMarkerLoaded(false);
  }, [post.id]);

  /*
   * Recenter + zoom + tilt whenever
   * the focused post changes.
   */
  useEffect(() => {
    if (!mapReady) return;

    mapRef.current?.animateCamera(
      {
        center: {
          latitude: post.latitude,
          longitude: post.longitude,
        },
        zoom: MAP_ZOOM,
        pitch: MAP_PITCH,
        heading: 0,
      },
      {
        duration: 500,
      },
    );
  }, [post.id, post.latitude, post.longitude, mapReady]);

  /*
   * Find posts near the focused post.
   */
  const nearbyPosts = posts.filter((item) => {
    if (item.id === post.id) return false;

    const latitudeDistance = Math.abs(item.latitude - post.latitude);

    const longitudeDistance = Math.abs(item.longitude - post.longitude);

    return latitudeDistance <= MAP_PADDING && longitudeDistance <= MAP_PADDING;
  });

  /*
   * Marker image finished loading.
   * Freeze the marker after that to
   * prevent continuous native re-rendering.
   */
  const handleSelectedMarkerLoad = () => {
    setSelectedMarkerLoaded(true);
  };

  const handleNearbyMarkerLoad = (id: string) => {
    setLoadedNearbyMarkers((previous) => {
      if (previous.has(id)) {
        return previous;
      }

      const next = new Set(previous);
      next.add(id);

      return next;
    });
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={StyleSheet.absoluteFillObject}
        customMapStyle={mapStyleRedesign}
        onMapReady={() => {
          setMapReady(true);
        }}
        showsUserLocation={false}
        showsMyLocationButton={false}
        showsCompass={false}
        showsScale={false}
        toolbarEnabled={false}
        rotateEnabled={false}
        pitchEnabled
        scrollEnabled={false}
        zoomEnabled={false}
        zoomControlEnabled={false}
        loadingEnabled>
        {/* =================================
            NEARBY POSTS
        ================================== */}

        {nearbyPosts.map((item) => {
          const imageLoaded = loadedNearbyMarkers.has(item.id);

          return (
            <Marker
              key={`nearby-${item.id}`}
              coordinate={{
                latitude: item.latitude,
                longitude: item.longitude,
              }}
              tracksViewChanges={!imageLoaded}>
              <View style={styles.smallMarker}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.smallMarkerImage}
                  resizeMode="cover"
                  onLoadEnd={() => handleNearbyMarkerLoad(item.id)}
                />
              </View>
            </Marker>
          );
        })}

        {/* =================================
            CURRENT / SELECTED POST
        ================================== */}

        <Marker
          key={`selected-${post.id}`}
          coordinate={{
            latitude: post.latitude,
            longitude: post.longitude,
          }}
          tracksViewChanges={!selectedMarkerLoaded}
          zIndex={999}>
          <View style={styles.selectedMarker}>
            <Image
              source={{ uri: post.image }}
              style={styles.selectedMarkerImage}
              resizeMode="cover"
              onLoadEnd={handleSelectedMarkerLoad}
            />
          </View>
        </Marker>
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: "hidden",
  },

  /* =================================
     SELECTED MARKER
  ================================== */

  selectedMarker: {
    width: 60,
    height: 60,

    borderRadius: 32,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 4,
    borderColor: "#111111",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,

    elevation: 10,
  },

  selectedMarkerImage: {
    width: 52,
    height: 52,

    borderRadius: 26,
  },

  /* =================================
     NEARBY MARKERS
  ================================== */

  smallMarker: {
    width: 32,
    height: 32,

    borderRadius: 16,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#FFFFFF",

    borderWidth: 2,
    borderColor: "#FFFFFF",

    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,

    elevation: 3,
  },

  smallMarkerImage: {
    width: 26,
    height: 26,

    borderRadius: 13,
  },
});
