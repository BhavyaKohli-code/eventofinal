import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from 'expo-router';
import Login from "./login"; // Ensure this path is correct

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [newVendor, setNewVendor] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    password: "",
    category: "",
    location: "",
  });
  const router = useRouter();
  const [categories] = useState([
    "Photo and Videographers",
    "Decorators",
    "Rental Cars",
    "Caterers",
    "Makeup Artists",
    "Mehandi Artists",
    "Invitation Cards",
  ]);

  const [locations] = useState([
      "Bhatpara", "Ichapur", "Titagarh", "Khardaha", "Birati", "New Barrackpur", "Hridaypur", "Bamangachhi",
      "Barasat", "Madhyamgram", "Barrackpore", "Kolkata", "Dumdum", "Howrah", "Naihati", "Shyamnagar", 
      "Nadia", "Habra", "Jagatdal", "Chandannagar", "Chinsurah", "Bandel", "Kanchrapara", "Kalyani", 
      "Sonarpur", "Baruipur", "Gobardanga", "Bangaon", "Chakdaha", "Haringhata", "Jaguli"
    ]);

  useEffect(() => {
    if (isLoggedIn) {
      fetch("http://65.0.135.159:5000/vendors")
        .then((response) => response.json())
        .then((data) => setVendors(data))
        .catch((error) => console.error("Error fetching vendors:", error));
    }
  }, [isLoggedIn]);

  const addVendor = () => {
    if (!newVendor.name || !newVendor.username || !newVendor.category || !newVendor.email || !newVendor.password || !newVendor.location) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }

    fetch("http://65.0.135.159:5000/vendors", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newVendor),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setVendors((prevVendors) => [
          ...prevVendors,
          { id: Date.now(), ...newVendor },
        ]);
        setNewVendor({ name: "", username: "", phone: "", email: "", password: "", category: "", location: "" });
        Alert.alert("Success", "Vendor added successfully");
      })
      .catch((error) => console.error("Error adding vendor:", error));
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {isLoggedIn ? (
          <>
            <Text style={styles.heading}>Welcome to the Package Manager</Text>

            <TextInput
              style={styles.input}
              placeholder="Company Name"
              value={newVendor.name}
              onChangeText={(text) => setNewVendor({ ...newVendor, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={newVendor.username}
              onChangeText={(text) => setNewVendor({ ...newVendor, username: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={newVendor.phone}
              onChangeText={(text) => setNewVendor({ ...newVendor, phone: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={newVendor.email}
              onChangeText={(text) => setNewVendor({ ...newVendor, email: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={newVendor.password}
              onChangeText={(text) => setNewVendor({ ...newVendor, password: text })}
            />

            <Picker
              selectedValue={newVendor.category}
              onValueChange={(itemValue ) => setNewVendor({ ...newVendor, category: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Select a Category" value="" />
              {categories.map((category, index) => (
                <Picker.Item key={index} label={category} value={category} />
              ))}
            </Picker>

            <Picker
              selectedValue={newVendor.location}
              onValueChange={(itemValue) => setNewVendor({ ...newVendor, location: itemValue })}
              style={styles.picker}
            >
              <Picker.Item label="Select a Location" value="" />
              {locations.map((location, index) => (
                <Picker.Item key={index} label={location} value={location} />
              ))}
            </Picker>

            <TouchableOpacity style={styles.button} onPress={addVendor}>
              <Text style={styles.buttonText}>Add Vendor</Text>
            </TouchableOpacity>

            <ScrollView style={styles.vendorList}>
              {vendors.map((vendor) => (
                <View key={vendor.id} style={styles.vendorCard}>
                  <Text style={styles.vendorText}>Vendor-Id: {vendor.id}</Text>
                  <Text style={styles.vendorText}>Name: {vendor.name}</Text>
                  <Text style={styles.vendorText}>Username: {vendor.username}</Text>
                  <Text style={styles.vendorText}>Phone: {vendor.phone}</Text>
                  <Text style={styles.vendorText}>Email: {vendor.email}</Text>
                  <Text style={styles.vendorText}>Category: {vendor.category}</Text>
                  <Text style={styles.vendorText}>Location: {vendor.location}</Text>
                  <TouchableOpacity
                    style={styles.packageButton}
                    onPress={() => {
                      console.log("Vendor ID being sent:", vendor.id);
                      router.push({
                        pathname: '/vendorpackagemanager/packagemanager',
                        params: { vendorid: vendor.id },
                      });
                    }}
                  >
                    <Text style={styles.packageButtonText}>Package Manager</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <Login onLogin={setIsLoggedIn} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff", // Light background color
    padding: 20,
  },
  heading: {
    fontSize: 26,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  picker: {
    height: 50,
    borderColor: "#bdc3c7",
    borderWidth: 1,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#763c3c", // Brown shade for buttons
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "500",
  },
  vendorList: {
    marginTop: 20,
  },
  vendorCard: {
    padding: 20,
    backgroundColor: "#fff",
    marginBottom: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  vendorText: {
    fontSize: 16,
    color: "#34495e",
  },
  packageButton: {
    backgroundColor: "#763c3c", // Brown shade for package button
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  packageButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});