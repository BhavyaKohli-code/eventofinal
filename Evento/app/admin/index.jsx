import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Button, TextInput, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
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
      // Fetch vendors from the backend API
      fetch("http://65.0.135.159:5000/vendors") // Replace with your server's URL
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
          { id: Date.now(), ...newVendor }, // Simulate the added vendor
        ]);
        setNewVendor({ name: "", username: "", phone: "", email: "", password: "", category: "", location: "" });
        Alert.alert("Success", "Vendor added successfully");
      })
      .catch((error) => console.error("Error adding vendor:", error));
  };

  const deleteVendor = (id) => {
    fetch(`http://65.0.135.159:5000/vendors/${id}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message);
        setVendors((prevVendors) => prevVendors.filter((vendor) => vendor.id !== id));
        Alert.alert("Success", "Vendor deleted successfully");
      })
      .catch((error) => console.error("Error deleting vendor:", error));
  };

  return (
    <ScrollView style={styles.vendorList}>
      <View style={styles.container}>
        {isLoggedIn ? (
          <>
            <Text style={styles.heading}>Welcome to the Admin Page</Text>

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
              onValueChange={(itemValue) => setNewVendor({ ...newVendor, category: itemValue })}
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

            <Button title="Add Vendor" onPress={addVendor} color="#f67171" />

            {vendors.map((vendor) => (
              <View key={vendor.id} style={styles.vendorCard}>
                <Text style={styles.vendorText}>Vendor-Id: {vendor.id}</Text>
                <Text style={styles.vendorText}>Name: {vendor.name}</Text>
                <Text style={styles.vendorText}>Username: {vendor.username}</Text>
                <Text style={styles.vendorText}>Phone: {vendor.phone}</Text>
                <Text style={styles.vendorText}>Email: {vendor.email}</Text>
                <Text style={styles.vendorText}>Category: {vendor.category}</Text>
                <Text style={styles.vendorText}>Password: {vendor.password}</Text>
                <Text style={styles.vendorText}>Location: {vendor.location}</Text>
                <Button title="Delete" onPress={() => deleteVendor(vendor.id)} color="red" />
              </View>
            ))}
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
    backgroundColor: "##ffe0e0", // Beige background
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 40,
    borderColor: "#f67171", // Element border color
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    borderColor: "#f67171", // Picker border color
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: "#fff",
  },
  vendorList: {
    marginTop: 20,
  },
  vendorCard: {
    padding: 15,
    backgroundColor: "#fff",
    marginBottom: 10,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  vendorText: {
    fontSize: 16,
    color: "#555",
  },
});