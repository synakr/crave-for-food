import {
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function ActivityScreen() {
  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" backgroundColor="#0B0E12" />

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* ROW 1 */}
        <View style={styles.row}>
          <View style={[styles.card, styles.weatherCard]}>
            <Text style={styles.weatherText}>
              It’s <Text style={styles.degree}>3°</Text> now
              {"\n"}in <Text style={styles.purpleText}>Tokyo.</Text>
              {"\n"}Will be rainy
              {"\n"}and cold.
            </Text>
          </View>

          <View style={[styles.card, styles.meetingCard]}>
            <View style={styles.meetingHeader}>
              <View style={styles.avatarSmall}>
                <Text style={styles.avatarEmoji}>👩🏻</Text>
              </View>
              <View style={styles.flex}>
                <Text style={styles.meetingTitle}>Meeting</Text>
                <Text style={styles.meetingSub}>
                  with <Text style={styles.redText}>@JackReed</Text>
                </Text>
              </View>
            </View>
            <View style={styles.meetingImage}>
              <Text style={styles.japaneseTitle}>SAITO</Text>
              <Text style={styles.japaneseText}>鮨さいとう</Text>
              <View style={styles.meetingFooter}>
                <Text style={styles.whiteSmall}>◷ 12 Jan, 20:00</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, styles.orangeCard]}>
            <View style={styles.timerHeader}>
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
              <View style={styles.timerPill}>
                <Text style={styles.timerText}>00:00:00</Text>
              </View>
            </View>
            <View style={styles.catContainer}>
              <Text style={styles.catEmoji}>🐈‍⬛</Text>
            </View>
          </View>
        </View>

        {/* ROW 2 */}
        <View style={styles.row}>
          <View style={[styles.card, styles.photoCard]}>
            <View style={styles.photoBadge}>
              <Text style={styles.photoBadgeText}>◉</Text>
            </View>
            <View style={styles.photoScene}>
              <Text style={styles.photoEmoji}>🏮</Text>
              <Text style={styles.peopleEmoji}>👥</Text>
            </View>
            <View style={styles.aiPill}>
              <Text style={styles.aiText}>✦ suggested by AI</Text>
            </View>
          </View>

          <View style={[styles.card, styles.profileCard]}>
            <View style={styles.basketballCircle}>
              <Text style={styles.basketball}>◉</Text>
              <View style={styles.ballLineOne} />
              <View style={styles.ballLineTwo} />
            </View>
            <Text style={styles.username}>
              Hiroto_98 <Text style={styles.verified}>●</Text>
            </Text>
            <View style={styles.statsRow}>
              <View style={styles.statPill}>
                <Text style={styles.statText}>♥ 8</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statText}>● 4</Text>
              </View>
              <View style={styles.statPill}>
                <Text style={styles.statText}>➤ 9</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, styles.contactCard]}>
            <View style={styles.contactAvatar}>
              <Text style={styles.contactEmoji}>👨🏿</Text>
            </View>
            <Text style={styles.contactName}>Zion Carter</Text>
            <Text style={styles.contactSub}>best dude</Text>
            <View style={styles.contactActions}>
              <View style={styles.contactButton}>
                <Text style={styles.phoneIcon}>☎</Text>
              </View>
              <View style={styles.contactButton}>
                <Text style={styles.chatIcon}>●</Text>
              </View>
              <View style={styles.contactButton}>
                <Text style={styles.videoIcon}>▣</Text>
              </View>
            </View>
          </View>
        </View>

        {/* ROW 3 */}
        <View style={styles.row}>
          <View style={[styles.card, styles.droneCard]}>
            <View style={styles.droneHeader}>
              <Text style={styles.droneIcon}>⌘</Text>
              <View style={styles.moreButton}>
                <Text style={styles.moreText}>•••</Text>
              </View>
            </View>
            <View style={styles.droneInfo}>
              <Text style={styles.droneName}>Dron DJI Neo</Text>
              <Text style={styles.mutedText}>1435 mAh</Text>
            </View>
            <View style={styles.batteryTrack}>
              <View style={styles.batteryFill} />
            </View>
            <Text style={styles.chargingText}>ϟ Charging...</Text>
          </View>

          <View style={[styles.card, styles.flightCard]}>
            <Text style={styles.flightTitle}>Next flight</Text>
            <Text style={styles.flightSub}>Tokyo - London</Text>
            <View style={styles.pixelGrid}>
              <Text style={styles.pixelText}>TOKYO</Text>
              <Text style={styles.pixelText}>HEATH</Text>
              <Text style={styles.pixelText}>16:35</Text>
            </View>
          </View>

          <View style={[styles.card, styles.balanceCard]}>
            <View style={styles.balanceInner}>
              <Text style={styles.balanceLabel}>Balance</Text>
              <View style={styles.mastercard}>
                <View style={styles.masterRed} />
                <View style={styles.masterYellow} />
              </View>
              <Text style={styles.balanceAmount}>$450,80</Text>
              <Text style={styles.balanceSub}>5294 •••• •••• 2468</Text>
            </View>
            <Text style={styles.balanceDots}>• • •</Text>
            <View style={styles.balanceActions}>
              <Text style={styles.balanceActionIcon}>▣</Text>
              <Text style={styles.balanceActionMuted}>↗</Text>
            </View>
          </View>
        </View>

        {/* ROW 4 */}
        <View style={styles.row}>
          <View style={[styles.card, styles.cryptoCard]}>
            <View style={styles.coinBadge}>
              <Text style={styles.coinIcon}>¢</Text>
            </View>
            <View style={styles.cryptoContent}>
              <Text style={styles.cryptoLabel}>USDC</Text>
              <Text style={styles.cryptoAmount}>987.86</Text>
              <Text style={styles.cryptoChange}>-99.56</Text>
            </View>
            <View style={styles.cryptoActions}>
              <Pressable style={styles.cryptoButton}>
                <Text style={styles.cryptoButtonText}>Send</Text>
              </Pressable>
              <Pressable style={styles.cryptoButton}>
                <Text style={styles.cryptoButtonText}>Swap</Text>
              </Pressable>
            </View>
          </View>

          <View style={[styles.card, styles.musicCard]}>
            <View style={styles.albumStack}>
              <View style={styles.albumBack} />
              <View style={styles.albumFront}>
                <Text style={styles.carEmoji}>🏎️</Text>
              </View>
            </View>
            <Text style={styles.musicTitle}>Drive - The Cars</Text>
            <View style={styles.musicPlayer}>
              <View style={styles.spotifyCircle}>
                <Text style={styles.spotifyIcon}>≋</Text>
              </View>
              <View style={styles.musicPlay}>
                <Text style={styles.musicPlayText}>▶</Text>
              </View>
              <View style={styles.musicProgress}>
                <Text style={styles.musicTrackTitle}>Drive - The Cars</Text>
                <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View>
                <Text style={styles.musicTime}>02:31　　　 03:34</Text>
              </View>
            </View>
          </View>

          <View style={[styles.card, styles.lampCard]}>
            <View style={styles.lampGlow} />
            <View style={styles.lampShade}>
              <View style={styles.lampInner} />
            </View>
            <View style={styles.lampStem} />
            <View style={styles.lampBase} />
            <View style={styles.lampActions}>
              <Text style={styles.lampDim}>♧</Text>
              <Text style={styles.lampOn}>☼</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#0B0E12",
    paddingTop: 100,
  },
  container: {
    paddingHorizontal: 12,
    paddingTop: 18,
    paddingBottom: 28,
    gap: 12,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  card: {
    flex: 1,
    aspectRatio: 0.91,
    borderRadius: 25,
    overflow: "hidden",
  },
  flex: {
    flex: 1,
  },

  // Weather
  weatherCard: {
    backgroundColor: "#222225",
    justifyContent: "center",
    padding: 12,
  },
  weatherText: {
    color: "#F5F3F6",
    fontSize: 15,
    lineHeight: 20,
    fontWeight: "600",
    letterSpacing: -0.5,
  },
  degree: {
    color: "#FFFFFF",
    fontWeight: "800",
  },
  purpleText: {
    color: "#F2A5F5",
    fontWeight: "800",
  },

  // Meeting
  meetingCard: {
    backgroundColor: "#F0A5F0",
    padding: 7,
  },
  meetingHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 2,
    gap: 5,
    height: "31%",
  },
  avatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E5D1BF",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarEmoji: {
    fontSize: 24,
  },
  meetingTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#242029",
  },
  meetingSub: {
    fontSize: 9,
    color: "#5C3D55",
    fontWeight: "600",
  },
  redText: {
    color: "#B84952",
  },
  meetingImage: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: "#684C42",
    overflow: "hidden",
    padding: 7,
    justifyContent: "flex-start",
  },
  japaneseTitle: {
    fontSize: 16,
    color: "#E7F5A1",
    fontWeight: "900",
  },
  japaneseText: {
    color: "#F2EBAE",
    fontWeight: "900",
    fontSize: 13,
  },
  meetingFooter: {
    marginTop: "auto",
    alignSelf: "center",
    backgroundColor: "#22222288",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  whiteSmall: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Timer
  orangeCard: {
    backgroundColor: "#F44320",
    padding: 8,
  },
  timerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  playButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F3A1F0",
    borderWidth: 4,
    borderColor: "#272125",
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    color: "#2C1828",
    fontSize: 12,
  },
  timerPill: {
    flex: 1,
    height: 28,
    backgroundColor: "#252327",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  timerText: {
    color: "#C7C3C5",
    fontSize: 10,
    fontWeight: "700",
  },
  catContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8,
  },
  catEmoji: {
    fontSize: 66,
  },

  // Photo
  photoCard: {
    backgroundColor: "#BCA38B",
    justifyContent: "center",
    alignItems: "center",
  },
  photoBadge: {
    position: "absolute",
    top: 9,
    left: 9,
    zIndex: 2,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F35A37",
    borderWidth: 3,
    borderColor: "#292326",
    alignItems: "center",
    justifyContent: "center",
  },
  photoBadgeText: {
    fontSize: 17,
    color: "#252024",
    fontWeight: "900",
  },
  photoScene: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#D8C6AA",
  },
  photoEmoji: {
    position: "absolute",
    top: 12,
    right: 10,
    fontSize: 22,
  },
  peopleEmoji: {
    fontSize: 45,
  },
  aiPill: {
    position: "absolute",
    bottom: 8,
    backgroundColor: "#282725CC",
    borderRadius: 15,
    paddingVertical: 5,
    paddingHorizontal: 8,
  },
  aiText: {
    fontSize: 9,
    color: "#FFFFFF",
    fontWeight: "700",
  },

  // Profile
  profileCard: {
    backgroundColor: "#F4B6D0",
    alignItems: "center",
    justifyContent: "center",
    padding: 6,
  },
  basketballCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#F5A4C2",
    borderWidth: 3,
    borderColor: "#E17EA4",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  basketball: {
    fontSize: 46,
    color: "#C65C88",
  },
  ballLineOne: {
    position: "absolute",
    width: 65,
    height: 3,
    backgroundColor: "#C65C88",
    transform: [{ rotate: "45deg" }],
  },
  ballLineTwo: {
    position: "absolute",
    width: 65,
    height: 3,
    backgroundColor: "#C65C88",
    transform: [{ rotate: "-45deg" }],
  },
  username: {
    marginTop: 12,
    color: "#40313A",
    fontWeight: "800",
    fontSize: 11,
  },
  verified: {
    color: "#E95743",
    fontSize: 9,
  },
  statsRow: {
    flexDirection: "row",
    gap: 4,
    marginTop: 12,
  },
  statPill: {
    backgroundColor: "#E45137",
    borderRadius: 12,
    paddingVertical: 5,
    paddingHorizontal: 7,
  },
  statText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "800",
  },

  // Contact
  contactCard: {
    backgroundColor: "#48494B",
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
  },
  contactAvatar: {
    width: 55,
    height: 55,
    backgroundColor: "#C9C9C9",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  contactEmoji: {
    fontSize: 35,
  },
  contactName: {
    color: "#F4F3F5",
    fontSize: 12,
    fontWeight: "800",
    marginTop: 8,
  },
  contactSub: {
    color: "#C0C0C1",
    fontSize: 10,
    marginTop: 2,
  },
  contactActions: {
    flexDirection: "row",
    gap: 5,
    marginTop: 9,
  },
  contactButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#292A2C",
    justifyContent: "center",
    alignItems: "center",
  },
  phoneIcon: {
    color: "#BCE86A",
    fontSize: 17,
  },
  chatIcon: {
    color: "#BCE86A",
    fontSize: 15,
  },
  videoIcon: {
    color: "#BCE86A",
    fontSize: 16,
  },

  // Drone
  droneCard: {
    backgroundColor: "#242529",
    padding: 10,
    justifyContent: "space-between",
  },
  droneHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  droneIcon: {
    color: "#73757A",
    fontSize: 37,
    fontWeight: "800",
  },
  moreButton: {
    width: 31,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#343538",
    justifyContent: "center",
    alignItems: "center",
  },
  moreText: {
    color: "#D4D4D5",
    fontSize: 12,
  },
  droneInfo: {
    alignItems: "flex-end",
  },
  droneName: {
    color: "#E6E6E7",
    fontSize: 10,
    fontWeight: "800",
  },
  mutedText: {
    color: "#8F9094",
    fontSize: 10,
    marginTop: 3,
  },
  batteryTrack: {
    height: 25,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#4B4D4D",
    backgroundColor: "#303133",
    padding: 4,
    justifyContent: "center",
  },
  batteryFill: {
    width: "58%",
    height: 16,
    backgroundColor: "#D0F779",
    borderRadius: 10,
  },
  chargingText: {
    color: "#85868A",
    textAlign: "center",
    fontSize: 11,
  },

  // Flight
  flightCard: {
    backgroundColor: "#242529",
    padding: 11,
  },
  flightTitle: {
    color: "#F0EFF1",
    fontSize: 14,
    fontWeight: "800",
  },
  flightSub: {
    color: "#A5A5A9",
    fontSize: 10,
    marginTop: 3,
  },
  pixelGrid: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
    overflow: "hidden",
  },
  pixelText: {
    color: "#D4D6C7",
    fontSize: 19,
    fontWeight: "900",
    letterSpacing: -1,
    textAlign: "center",
    includeFontPadding: false,
  },

  // Balance
  balanceCard: {
    backgroundColor: "#B8D77D",
    padding: 9,
    justifyContent: "space-between",
  },
  balanceInner: {
    backgroundColor: "#A5C95F",
    borderRadius: 17,
    padding: 10,
    minHeight: "58%",
    justifyContent: "center",
  },
  balanceLabel: {
    color: "#F1F5DE",
    fontSize: 10,
    fontWeight: "600",
  },
  mastercard: {
    position: "absolute",
    top: 11,
    right: 10,
    flexDirection: "row",
  },
  masterRed: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#F04432",
    marginRight: -5,
  },
  masterYellow: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#F9B52D",
  },
  balanceAmount: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
    marginTop: 13,
  },
  balanceSub: {
    color: "#E8F0D3",
    fontSize: 7,
    marginTop: 4,
  },
  balanceDots: {
    color: "#8EAA5B",
    textAlign: "center",
    fontSize: 11,
  },
  balanceActions: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#29282E",
    borderRadius: 25,
    padding: 6,
  },
  balanceActionIcon: {
    color: "#332B35",
    backgroundColor: "#EFA2F0",
    overflow: "hidden",
    borderRadius: 15,
    paddingHorizontal: 8,
    paddingVertical: 4,
    fontSize: 13,
  },
  balanceActionMuted: {
    color: "#8A8B91",
    fontSize: 16,
    paddingHorizontal: 3,
  },

  // Crypto
  cryptoCard: {
    backgroundColor: "#EAA7F0",
    padding: 10,
    justifyContent: "space-between",
  },
  coinBadge: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#D2F27B",
    borderWidth: 4,
    borderColor: "#29252E",
    alignItems: "center",
    justifyContent: "center",
  },
  coinIcon: {
    fontSize: 22,
    fontWeight: "900",
    color: "#25272B",
  },
  cryptoContent: {
    alignItems: "center",
    marginTop: -3,
  },
  cryptoLabel: {
    color: "#544253",
    fontSize: 10,
    fontWeight: "700",
  },
  cryptoAmount: {
    color: "#322438",
    fontSize: 27,
    fontWeight: "900",
    letterSpacing: -1,
  },
  cryptoChange: {
    color: "#C94D55",
    fontSize: 14,
    fontWeight: "900",
  },
  cryptoActions: {
    flexDirection: "row",
    gap: 5,
  },
  cryptoButton: {
    flex: 1,
    backgroundColor: "#29272E",
    borderRadius: 25,
    paddingVertical: 11,
    alignItems: "center",
  },
  cryptoButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 12,
  },

  // Music
  musicCard: {
    backgroundColor: "#393A3C",
    padding: 9,
    justifyContent: "flex-end",
  },
  albumStack: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  albumBack: {
    position: "absolute",
    width: "80%",
    height: "70%",
    borderRadius: 12,
    backgroundColor: "#18191B",
    transform: [{ rotate: "-7deg" }],
  },
  albumFront: {
    width: "83%",
    height: "85%",
    backgroundColor: "#B84728",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ rotate: "5deg" }],
  },
  carEmoji: {
    fontSize: 42,
  },
  musicTitle: {
    color: "#B9B9BA",
    fontSize: 10,
    fontWeight: "700",
    textAlign: "center",
    marginVertical: 7,
  },
  musicPlayer: {
    backgroundColor: "#242529",
    borderRadius: 24,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  spotifyCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D5F77A",
    alignItems: "center",
    justifyContent: "center",
  },
  spotifyIcon: {
    color: "#1C2416",
    fontSize: 22,
    fontWeight: "900",
  },
  musicPlay: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#E7A2EF",
    alignItems: "center",
    justifyContent: "center",
  },
  musicPlayText: {
    color: "#28232B",
    fontSize: 12,
  },
  musicProgress: {
    flex: 1,
    minWidth: 0,
  },
  musicTrackTitle: {
    color: "#F4F4F4",
    fontSize: 6,
    fontWeight: "700",
  },
  progressTrack: {
    height: 2,
    backgroundColor: "#5A5A5D",
    marginTop: 4,
  },
  progressFill: {
    height: 2,
    width: "65%",
    backgroundColor: "#E9A5F0",
  },
  musicTime: {
    color: "#A5A5A8",
    fontSize: 5,
    marginTop: 3,
  },

  // Lamp
  lampCard: {
    backgroundColor: "#202123",
    alignItems: "center",
    justifyContent: "center",
  },
  lampGlow: {
    position: "absolute",
    top: "15%",
    width: "90%",
    height: "60%",
    borderRadius: 100,
    backgroundColor: "#484044",
    opacity: 0.35,
  },
  lampShade: {
    width: 38,
    height: 51,
    backgroundColor: "#E6A1D9",
    borderTopLeftRadius: 17,
    borderTopRightRadius: 17,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 8,
    transform: [{ rotate: "-22deg" }],
    zIndex: 2,
    overflow: "hidden",
  },
  lampInner: {
    width: 19,
    height: 49,
    backgroundColor: "#F4BEA5",
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 20,
  },
  lampStem: {
    width: 7,
    height: 20,
    backgroundColor: "#D4A0D1",
    marginLeft: 12,
    marginTop: -2,
    transform: [{ rotate: "-12deg" }],
  },
  lampBase: {
    width: 35,
    height: 4,
    backgroundColor: "#A18A9C",
    borderRadius: 5,
    marginLeft: 12,
  },
  lampActions: {
    position: "absolute",
    bottom: 10,
    alignSelf: "center",
    flexDirection: "row",
    gap: 8,
    backgroundColor: "#303033",
    borderRadius: 25,
    padding: 6,
    alignItems: "center",
  },
  lampDim: {
    color: "#79797D",
    fontSize: 15,
    paddingHorizontal: 5,
  },
  lampOn: {
    color: "#25252B",
    backgroundColor: "#E9A5EE",
    borderRadius: 15,
    paddingHorizontal: 7,
    paddingVertical: 4,
    fontSize: 17,
    overflow: "hidden",
  },
});
