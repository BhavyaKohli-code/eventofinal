import React from "react";
import { StyleSheet, Image, ImageBackground, View, Text } from "react-native"; // Import Text component
import { Link } from "expo-router"; // Ensure expo-router is installed

export default function SecondScreen() {
  return (
    <ImageBackground
      source={require('./scndbg.png')} // Replace with your background image path
      style={styles.background}
      resizeMode="cover" // Ensures the image covers the entire background
    >
      <View style={styles.container}>
        {/* Logo Image */}
        <Image
          source={require('./logo.png')} // Replace with your logo image path
          style={styles.logoImage}
          resizeMode="contain" // Ensures the image scales properly within the container
        />

        
        <Text style={styles.welcomeText} numberOfLines={1}>WELCOME TO EVENTO EASY</Text>
        {/* Buttons */}
        <Link href="/admin" style={styles.button}>
          <Text style={styles.buttonText}>ADMIN</Text>
        </Link>

        <Link href="/vendor" style={styles.button}>
          <Text style={styles.buttonText}>VENDOR</Text>
        </Link>

        <Link href="/exploreservices" style={styles.button}>
          <Text style={styles.buttonText}>EXPLORE SERVICES</Text>
        </Link>

        <Link href="/vendorpackagemanager" style={styles.button}>
          <Text style={styles.buttonText}>VENDOR/PACKAGE MANAGER</Text>
        </Link>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    height: "100%", // Full height
    width: "100%", // Full width
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    width: "100%",
  },
  logoImage: {
    width: "90%", // 90% of the width
    height:"20%",
  
  },
  button: {
    backgroundColor: "#763c3c",
    borderWidth: 2,
    borderColor: "#ffe4e4",
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginVertical: 10,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
  },
  buttonText: {
    color: "#ffe4e4",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 25, // Set the font size
    fontWeight: "900", // Make the font weight thicker (use 900 for boldest)
    color: "#763c3c", // Pinkish color
    textShadowColor: "#ffe4e4", // Black shadow color
    textShadowOffset: { width: 1, height: 1 }, // Stronger shadow offset for more smudge
    textShadowRadius: 15, // Larger blur for the smudge effect
  },
});
