import React, { useEffect, useRef, useState } from "react";
import { Text, View, StyleSheet, ImageBackground, Dimensions, Animated } from "react-native";
import { Link } from "expo-router"; // Ensure Link is imported correctly
import bg1 from "../assets/images/bg1.png"; // Ensure the image exists at this path

const { width } = Dimensions.get("window"); // Get device width

export default function Index() {
  const slideAnim = useRef(new Animated.Value(0)).current; // Initial value for Y position
  const buttonAnim = useRef(new Animated.Value(0)).current; // Initial value for button scale
  const [buttonVisible, setButtonVisible] = useState(false); // State to control button visibility

  useEffect(() => {
    // Start the animation for the bottom div
    Animated.timing(slideAnim, {
      toValue: 1, // Slide up to 1
      duration: 500, // Duration of the animation
      useNativeDriver: true, // Use native driver for better performance
    }).start(() => {
      // Callback function to set button visibility after animation completes
      setButtonVisible(true);
      // Start the button pop-up animation
      Animated.spring(buttonAnim, {
        toValue: 1, // Scale to 1
        friction: 3, // Control the bounciness
        useNativeDriver: true, // Use native driver for better performance
      }).start();
    });
  }, [slideAnim, buttonAnim]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Dimensions.get("window").height * 0.35, 0], // Slide from 35% of height to 0
  });

  const buttonScale = buttonAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1], // Scale from 0 to 1
  });

  return (
    <ImageBackground
      source={bg1} // Ensure this is the correct path to the image
      style={styles.container}
    >
      <Animated.View
        style={[
          styles.bottomDiv,
          {
            transform: [{ translateY }], // Slide animation
            opacity: 0.9, // Make bottom div semi-transparent
          },
        ]}
      >
        {buttonVisible && ( // Render button only if buttonVisible is true
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <Link href="/secondscreen" style={styles.buttonLink}>
                  <Text style={styles.buttonText}>Get Started</Text>
                </Link>
              </View>
            </View>
          </Animated.View>
        )}
      </Animated.View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Center the content vertically
    alignItems: "center", // Center the content horizontally
    width: "100%", // Full width
  },
  bottomDiv: {
    backgroundColor: "#ffe4e4",
    height: "20%",
    position: "absolute", // Position it absolutely at the bottom
    bottom: 0, // Align at the bottom of the screen
    transform: [{ translateX: -width * 0.45 }], // Offset by half of the width of bottomDiv
    width: width * 0.9, // 90% width of the device
    justifyContent: "flex-start", // Align content at the top of the div
    alignItems: "center", // Center horizontally
    borderTopLeftRadius: 30, // Adjust the curve
    borderTopRightRadius: 30, // Adjust the curve
    paddingTop: 20, // Space between the div's top and button
    opacity: 0.9, // Semi-transparent effect
  },
  buttonContainer: {
    width: "100%", // Full width of the container
    alignItems: "center", // Center the button horizontally
  },
  buttonWrapper: {
    width: "80%", // Set the desired button width
    backgroundColor: "#763c3c",
    borderRadius: 8,
    overflow: "hidden", // Ensure rounded corners
  },
  buttonLink: {
    display: "flex", // Flex to allow layout properties
    justifyContent: "center", // Center content vertically
    alignItems: "center", // Center content horizontally
    paddingVertical: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
