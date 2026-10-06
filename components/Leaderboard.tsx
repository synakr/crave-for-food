// app/leaderboard.tsx

import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Participant = {
  name: string;
  steps: string;
  avatar: string;
};

const TOP_PARTICIPANTS: Participant[] = [
  {
    name: "Mia",
    steps: "43.5k steps",
    avatar: "https://i.pravatar.cc/300?img=47",
  },
  {
    name: "Ava",
    steps: "45.2k steps",
    avatar: "https://i.pravatar.cc/300?img=44",
  },
  {
    name: "Noah",
    steps: "44.8k steps",
    avatar: "https://i.pravatar.cc/300?img=11",
  },
];

const OTHER_PARTICIPANTS: Participant[] = [
  {
    name: "Liam",
    steps: "40.5k steps",
    avatar: "https://i.pravatar.cc/300?img=12",
  },
  {
    name: "Ella",
    steps: "39.2k steps",
    avatar: "https://i.pravatar.cc/300?img=32",
  },
  {
    name: "Sofia",
    steps: "38.7k steps",
    avatar: "https://i.pravatar.cc/300?img=25",
  },
  {
    name: "Jackson",
    steps: "37.7k steps",
    avatar: "https://i.pravatar.cc/300?img=13",
  },
  {
    name: "Olivia",
    steps: "36.3k steps",
    avatar: "https://i.pravatar.cc/300?img=49",
  },
];

function ParticipantAvatar({
  participant,
  rank,
  featured = false,
}: {
  participant: Participant;
  rank: number;
  featured?: boolean;
}) {
  return (
    <View
      style={[
        styles.featuredAvatarWrapper,
        featured && styles.winnerAvatarWrapper,
      ]}>
      <Image
        source={{ uri: participant.avatar }}
        style={[styles.featuredAvatar, featured && styles.winnerAvatar]}
      />

      {featured && <View style={styles.winnerRing} />}
    </View>
  );
}

function Medal({ rank }: { rank: 1 | 2 | 3 }) {
  return (
    <View
      style={[
        styles.medal,
        rank === 1 && styles.goldMedal,
        rank === 2 && styles.silverMedal,
        rank === 3 && styles.bronzeMedal,
      ]}>
      <Text style={styles.medalNumber}>{rank}</Text>
    </View>
  );
}

function PodiumColumn({ rank }: { rank: 1 | 2 | 3 }) {
  const isFirst = rank === 1;
  const isSecond = rank === 2;

  return (
    <View
      style={[
        styles.podiumColumn,
        isFirst
          ? styles.firstPodium
          : isSecond
            ? styles.secondPodium
            : styles.thirdPodium,
      ]}>
      <LinearGradient
        colors={isFirst ? ["#FFF3B7", "#FFE49A"] : ["#FFFFFF", "#F8F8F6"]}
        style={StyleSheet.absoluteFill}
      />

      <Medal rank={rank} />
    </View>
  );
}

function FeaturedParticipant({
  participant,
  rank,
}: {
  participant: Participant;
  rank: 1 | 2 | 3;
}) {
  const winner = rank === 1;

  return (
    <View
      style={[
        styles.featuredParticipant,
        rank === 1 && styles.firstParticipant,
        rank === 2 && styles.secondParticipant,
        rank === 3 && styles.thirdParticipant,
      ]}>
      <ParticipantAvatar
        participant={participant}
        rank={rank}
        featured={winner}
      />

      <Text style={styles.featuredName}>{participant.name}</Text>

      <Text style={styles.featuredSteps}>{participant.steps}</Text>
    </View>
  );
}

function OtherParticipant({ participant }: { participant: Participant }) {
  return (
    <View style={styles.participantRow}>
      <Image source={{ uri: participant.avatar }} style={styles.smallAvatar} />

      <Text style={styles.participantName}>{participant.name}</Text>

      <Text style={styles.participantSteps}>{participant.steps}</Text>
    </View>
  );
}

export default function Leaderboard() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* ============================================================ */}
      {/* BACKGROUND                                                    */}
      {/* ============================================================ */}

      <LinearGradient
        colors={["#F8F0DB", "#FBF7EA", "#FFFFFF"]}
        locations={[0, 0.46, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* ============================================================ */}
      {/* HEADER                                                        */}
      {/* ============================================================ */}

      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
          },
        ]}>
        <Pressable onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={20} color="#272727" />
        </Pressable>

        <View style={styles.titleContainer}>
          <Text style={styles.title}>Race to 50K Steps</Text>

          <Pressable style={styles.subtitleRow}>
            <Text style={styles.subtitle}>October Challenge</Text>

            <Ionicons name="chevron-forward" size={14} color="#767676" />
          </Pressable>
        </View>

        <Pressable style={styles.headerButton}>
          <Ionicons name="add" size={24} color="#272727" />
        </Pressable>
      </View>

      {/* ============================================================ */}
      {/* TOP 3                                                        */}
      {/* ============================================================ */}

      <View style={styles.topSection}>
        <FeaturedParticipant participant={TOP_PARTICIPANTS[0]} rank={2} />

        <FeaturedParticipant participant={TOP_PARTICIPANTS[1]} rank={1} />

        <FeaturedParticipant participant={TOP_PARTICIPANTS[2]} rank={3} />
      </View>

      {/* ============================================================ */}
      {/* PODIUM                                                        */}
      {/* ============================================================ */}

      <View style={styles.podiumArea}>
        <PodiumColumn rank={2} />
        <PodiumColumn rank={1} />
        <PodiumColumn rank={3} />
      </View>

      {/* ============================================================ */}
      {/* HEALTH SYNC                                                   */}
      {/* ============================================================ */}

      <View style={styles.syncRow}>
        <Ionicons name="sync-outline" size={17} color="#B5B5B5" />

        <Text style={styles.syncText}>Updated 2h ago via Apple Health</Text>
      </View>

      {/* ============================================================ */}
      {/* OTHER PARTICIPANTS                                            */}
      {/* ============================================================ */}

      <View style={styles.participantsCard}>
        <Text style={styles.participantsTitle}>Other Participants</Text>

        <View style={styles.participantsList}>
          {OTHER_PARTICIPANTS.map((participant) => (
            <OtherParticipant
              key={participant.name}
              participant={participant}
            />
          ))}
        </View>
      </View>

      {/* ============================================================ */}
      {/* DAILY GOAL                                                    */}
      {/* ============================================================ */}

      <Pressable
        style={[
          styles.goalPill,
          {
            bottom: Math.max(insets.bottom + 10, 20),
          },
        ]}>
        <View style={styles.goalIconContainer}>
          <Ionicons name="flame-outline" size={17} color="#E65D68" />
        </View>

        <Text style={styles.goalText}>10K Daily Goal</Text>

        <View style={styles.goalDivider} />

        <Text style={styles.streakText}>Day 5 Streak</Text>

        <Ionicons name="chevron-forward" size={15} color="#E65D68" />
      </Pressable>
    </View>
  );
}

/* ========================================================================== */
/* STYLES                                                                     */
/* ========================================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  /* ---------------------------------------------------------------------- */
  /* HEADER                                                                 */
  /* ---------------------------------------------------------------------- */

  header: {
    height: 108,
    paddingHorizontal: 23,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerButton: {
    width: 47,
    height: 47,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(70,70,70,0.08)",
    backgroundColor: "rgba(255,255,255,0.34)",
  },

  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    color: "#282828",
    fontSize: 21,
    fontWeight: "800",
    letterSpacing: -0.5,
  },

  subtitleRow: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },

  subtitle: {
    color: "#777777",
    fontSize: 16,
    fontWeight: "500",
  },

  /* ---------------------------------------------------------------------- */
  /* TOP PARTICIPANTS                                                       */
  /* ---------------------------------------------------------------------- */

  topSection: {
    height: 194,
    paddingHorizontal: 35,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },

  featuredParticipant: {
    width: 100,
    alignItems: "center",
    justifyContent: "flex-start",
  },

  firstParticipant: {
    marginTop: -2,
  },

  secondParticipant: {
    marginTop: 31,
  },

  thirdParticipant: {
    marginTop: 31,
  },

  featuredAvatarWrapper: {
    width: 74,
    height: 74,
    borderRadius: 37,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#D9D9D9",
    borderWidth: 4,
    borderColor: "#E3DED0",
    overflow: "visible",
  },

  winnerAvatarWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 0,
    backgroundColor: "transparent",
  },

  featuredAvatar: {
    width: 66,
    height: 66,
    borderRadius: 33,
  },

  winnerAvatar: {
    width: 78,
    height: 78,
    borderRadius: 39,
  },

  winnerRing: {
    position: "absolute",
    width: 94,
    height: 94,
    borderRadius: 47,
    borderWidth: 4,
    borderColor: "#EFC11B",
  },

  featuredName: {
    marginTop: 5,
    color: "#292929",
    fontSize: 18,
    fontWeight: "800",
  },

  featuredSteps: {
    marginTop: 1,
    color: "#777777",
    fontSize: 16,
    fontWeight: "500",
  },

  /* ---------------------------------------------------------------------- */
  /* PODIUM                                                                 */
  /* ---------------------------------------------------------------------- */

  podiumArea: {
    height: 154,
    paddingHorizontal: 27,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },

  podiumColumn: {
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(210,210,210,0.22)",
  },

  firstPodium: {
    width: 164,
    height: 154,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    zIndex: 2,
  },

  secondPodium: {
    width: 139,
    height: 139,
    marginRight: -1,
  },

  thirdPodium: {
    width: 139,
    height: 139,
    marginLeft: -1,
  },

  medal: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
  },

  goldMedal: {
    backgroundColor: "#FFC400",
    borderColor: "#F4B800",
  },

  silverMedal: {
    backgroundColor: "#D6D8DA",
    borderColor: "#C3C5C8",
  },

  bronzeMedal: {
    backgroundColor: "#D8B178",
    borderColor: "#C79E62",
  },

  medalNumber: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "900",
  },

  /* ---------------------------------------------------------------------- */
  /* SYNC                                                                   */
  /* ---------------------------------------------------------------------- */

  syncRow: {
    height: 45,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  syncText: {
    color: "#B4B4B4",
    fontSize: 14,
    fontWeight: "500",
  },

  /* ---------------------------------------------------------------------- */
  /* PARTICIPANTS                                                           */
  /* ---------------------------------------------------------------------- */

  participantsCard: {
    flex: 1,
    minHeight: 0,
    marginHorizontal: 25,
    marginTop: 2,
    paddingHorizontal: 24,
    paddingTop: 19,
    borderRadius: 27,
    backgroundColor: "rgba(255,255,255,0.92)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 2,
  },

  participantsTitle: {
    textAlign: "center",
    color: "#707070",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  participantsList: {
    flex: 1,
  },

  participantRow: {
    flex: 1,
    minHeight: 42,
    flexDirection: "row",
    alignItems: "center",
  },

  smallAvatar: {
    width: 37,
    height: 37,
    borderRadius: 19,
  },

  participantName: {
    marginLeft: 11,
    color: "#252525",
    fontSize: 18,
    fontWeight: "600",
  },

  participantSteps: {
    marginLeft: "auto",
    color: "#777777",
    fontSize: 17,
    fontWeight: "500",
  },

  /* ---------------------------------------------------------------------- */
  /* GOAL PILL                                                              */
  /* ---------------------------------------------------------------------- */

  goalPill: {
    position: "absolute",
    alignSelf: "center",
    minHeight: 51,
    paddingLeft: 17,
    paddingRight: 13,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.96)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 18,
    elevation: 7,
  },

  goalIconContainer: {
    marginRight: 5,
  },

  goalText: {
    color: "#D85B67",
    fontSize: 14,
    fontWeight: "700",
  },

  goalDivider: {
    width: 1,
    height: 19,
    marginHorizontal: 11,
    backgroundColor: "#D8D8D8",
  },

  streakText: {
    color: "#2B2B2B",
    fontSize: 14,
    fontWeight: "700",
    marginRight: 7,
  },
});
