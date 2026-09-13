import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const { width } = Dimensions.get("window");
const GRID_SIZE = width / 3;

const PROFILE_IMAGE = "https://i.pravatar.cc/300?img=12";

const POSTS = [
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80",
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=600&q=80",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&q=80",
  "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80",
  "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600&q=80",
  "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=600&q=80",
  "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=600&q=80",
];

const STORIES = [
  { title: "New", image: null },
  {
    title: "📸 ✧",
    image:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?w=300&q=80",
  },
  {
    title: "☁️°☆",
    image:
      "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=300&q=80",
  },
];

const VIEWS = ["3,095", "1,832", "1,628", "982", "764", "621", "513", "402"];

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.username}>
            <Text style={styles.usernameText}>mr.kun.__</Text>
            <Ionicons name="chevron-down" size={18} color="#fff" />
          </Pressable>

          <Pressable style={styles.headerButton}>
            <Ionicons name="menu-outline" size={32} color="#fff" />
          </Pressable>
        </View>

        {/* Profile */}
        <View style={styles.profile}>
          <View>
            <Image source={{ uri: PROFILE_IMAGE }} style={styles.avatar} />
            <Pressable style={styles.addAvatar}>
              <Ionicons name="add" size={19} color="#111318" />
            </Pressable>
          </View>

          <View style={styles.stats}>
            {[
              ["8", "posts"],
              ["78", "followers"],
              ["63", "following"],
            ].map(([number, label]) => (
              <View style={styles.stat} key={label}>
                <Text style={styles.statNumber}>{number}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bio */}
        <View style={styles.bio}>
          <Text style={styles.name}>Sayan 🌿</Text>
          <Text style={styles.bioText}>NIT CSE’27 💻🐙</Text>
          <Text style={styles.bioText}>Cuts and chaos, in sync 🎥✨</Text>
        </View>

        {/* Stories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stories}>
          {STORIES.map((story, index) => (
            <View style={styles.storyItem} key={index}>
              <Pressable
                style={[styles.storyCircle, !story.image && styles.newStory]}>
                {story.image ? (
                  <Image
                    source={{ uri: story.image }}
                    style={styles.storyImage}
                  />
                ) : (
                  <Ionicons name="add" size={38} color="#fff" />
                )}
              </Pressable>

              <Text style={styles.storyTitle} numberOfLines={1}>
                {story.title}
              </Text>
            </View>
          ))}
        </ScrollView>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable style={styles.tab}>
            <Ionicons name="grid" size={27} color="#fff" />
          </Pressable>

          <Pressable style={styles.tab}>
            <Ionicons name="play-outline" size={29} color="#9CA3B3" />
          </Pressable>
        </View>

        {/* Posts */}
        <View style={styles.grid}>
          {POSTS.map((image, index) => (
            <Pressable style={styles.gridItem} key={index}>
              <Image source={{ uri: image }} style={styles.gridImage} />

              <View style={styles.overlay}>
                <Ionicons
                  name={index % 3 === 0 ? "play" : "eye"}
                  size={15}
                  color="#fff"
                />
                <Text style={styles.views}>{VIEWS[index]}</Text>
              </View>

              {index % 4 === 0 && (
                <Ionicons
                  name="copy-outline"
                  size={18}
                  color="#fff"
                  style={styles.multiple}
                />
              )}
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#090C12",
  },

  content: {
    paddingTop: 42,
    paddingBottom: 120,
  },

  /* Header */
  header: {
    height: 64,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  username: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  usernameText: {
    color: "#fff",
    fontSize: 25,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  headerButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Profile */
  profile: {
    marginTop: 8,
    paddingHorizontal: 28,
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 102,
    height: 102,
    borderRadius: 51,
    backgroundColor: "#20242C",
    borderWidth: 1,
    borderColor: "#343945",
  },

  addAvatar: {
    position: "absolute",
    right: -1,
    bottom: 2,
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#090C12",
  },

  stats: {
    flex: 1,
    marginLeft: 20,
    flexDirection: "row",
    justifyContent: "space-around",
  },

  stat: {
    alignItems: "center",
  },

  statNumber: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "700",
  },

  statLabel: {
    marginTop: 3,
    color: "#F0F1F4",
    fontSize: 15,
  },

  /* Bio */
  bio: {
    marginTop: 18,
    paddingHorizontal: 30,
  },

  name: {
    color: "#fff",
    fontSize: 19,
    fontWeight: "700",
    marginBottom: 12,
  },

  bioText: {
    color: "#F1F2F5",
    fontSize: 17,
    lineHeight: 23,
  },

  /* Stories */
  stories: {
    paddingHorizontal: 27,
    paddingTop: 27,
    paddingBottom: 22,
    gap: 20,
  },

  storyItem: {
    width: 74,
    alignItems: "center",
  },

  storyCircle: {
    width: 70,
    height: 70,
    padding: 5,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#303641",
    alignItems: "center",
    justifyContent: "center",
  },

  newStory: {
    borderColor: "#20252E",
  },

  storyImage: {
    width: "100%",
    height: "100%",
    borderRadius: 31,
  },

  storyTitle: {
    width: 74,
    marginTop: 8,
    color: "#E9EBF0",
    fontSize: 13,
    textAlign: "center",
  },

  /* Tabs */
  tabs: {
    height: 58,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#171B22",
  },

  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  /* Grid */
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },

  gridItem: {
    width: GRID_SIZE,
    height: GRID_SIZE,
    position: "relative",
    borderWidth: 2,
    borderColor: "#090C12",
  },

  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },

  overlay: {
    position: "absolute",
    left: 8,
    bottom: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  views: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    textShadowColor: "#000",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },

  multiple: {
    position: "absolute",
    top: 9,
    right: 9,
  },
});
