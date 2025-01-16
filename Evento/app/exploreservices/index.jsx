import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Animated,
  ImageBackground,
} from "react-native";
import { Link } from "expo-router";
import Login from "./login"; // Import Login component

const { width, height } = Dimensions.get("window");
const cardWidth = width * 0.85;
const cardHeight = height * 0.15;

export default function ExploreServices() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <Login onLogin={setIsLoggedIn} />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Our Services</Text>
      <View style={styles.servicesContainer}>
        {/* Service Cards */}
        <Link href="/exploreservices/services/Photo-Videographer" style={styles.touchable}>
          <ImageBackground
            source={require("./photographer-videographer.png")}
            style={styles.serviceCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay} />
            <Text style={styles.serviceText}>Photo and Videographers</Text>
          </ImageBackground>
        </Link>

        <Link href="/exploreservices/services/decorators" style={styles.touchable}>
          <ImageBackground
            source={require("./decorator.png")}
            style={styles.serviceCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay} />
            <Text style={styles.serviceText}>Decorators</Text>
          </ImageBackground>
        </Link>

        <Link href="/exploreservices/services/rental-cars" style={styles.touchable}>
          <ImageBackground
            source={require("./rental-cars.png")}
            style={styles.serviceCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay} />
            <Text style={styles.serviceText}>Rental Cars</Text>
          </ImageBackground>
        </Link>

        <Link href="/exploreservices/services/Caterers" style={styles.touchable}>
          <ImageBackground
            source={require("./caterers.png")}
            style={styles.serviceCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay} />
            <Text style={styles.serviceText}>Caterers</Text>
          </ImageBackground>
        </Link>

        <Link href="/exploreservices/services/makeup-artists" style={styles.touchable}>
          <ImageBackground
            source={require("./makeup-artists.png")}
            style={styles.serviceCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay} />
            <Text style={styles.serviceText}>Makeup Artists</Text>
          </ImageBackground>
        </Link>

        <Link href="/exploreservices/services/Mehandi-Artist" style={styles.touchable}>
          <ImageBackground
            source={require("./mehandi-artists.png")}
            style={styles.serviceCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay} />
            <Text style={styles.serviceText}>Mehandi Artists</Text>
          </ImageBackground>
        </Link>

        <Link href="/exploreservices/services/invitation-cards" style={styles.touchable}>
          <ImageBackground
            source={require("./invitation-cards.png")}
            style={styles.serviceCard}
            imageStyle={{ borderRadius: 12 }}
          >
            <View style={styles.overlay} />
            <Text style={styles.serviceText}>Invitation Cards</Text>
          </ImageBackground>
        </Link>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    minHeight: "100%",
  },
  heading: {
    fontSize: 32,
    fontWeight: "700",
    color: "#763c3c", // Pinkish color
    marginBottom: 40,
    textAlign: "center",
    letterSpacing: 1.5,
    paddingHorizontal: 15,
    textShadowColor: "#ffe4e4", // Black shadow color
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  servicesContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  touchable: {
    marginVertical: 10,
    width: cardWidth,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
  },
  serviceCard: {
    borderRadius: 12,
    width: cardWidth,
    height: cardHeight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 12,
  },
  serviceText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    textAlign: "center",
    textShadowColor: "#ffe4e4", // Black shadow color
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
});
