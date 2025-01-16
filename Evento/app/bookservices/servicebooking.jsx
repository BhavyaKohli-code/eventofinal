import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { useRouter } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function BookServices() {
  const [vendorData, setVendorData] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    state: '',
    city: '',
    area: '',
    landmark: '',
    startDate: '',
    endDate: '',
    vendorId: '',
    packageId: '',
    advance_received: "",
  });
  const router = useRouter();
  const { packageId } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!packageId) {
      Alert.alert("Error", "Package ID is required to fetch vendor data.");
      return;
    }

    const fetchVendorData = async () => {
      setLoading(true);
      try {
        const response = await fetch(`http://65.0.135.159:5000/api2/vendor2/${packageId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setVendorData(data);
        setFormData(prevFormData => ({
          ...prevFormData,
          vendorId: data.vendor_id,
          packageId: packageId,
        }));
      } catch (error) {
        console.error("Error fetching vendor data:", error);
        Alert.alert("Error", "Failed to fetch vendor data.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendorData();
  }, [packageId]);

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      state: '',
      city: '',
      area: '',
      landmark: '',
      startDate: '',
      endDate: '',
      advance_received: '',
      vendorId: formData.vendorId, // Keep vendorId and packageId unchanged
      packageId: formData.packageId,
      
    });
  };

  const handleSubmit = async () => {
    console.log("Form Data Submitted:", formData);
  
    if (!formData.name || !formData.email || !formData.phone) {
      Alert.alert("Error", "Please fill in all required fields.");
      return;
    }
  
    try {
      const response = await fetch("http://65.0.135.159:5000/submit-booking-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log("Form submission successful:", result);
        Alert.alert("Success", "Your form has been submitted successfully!");
        resetForm(); // Reset the form after successful submission
      } else {
        const error = await response.json();
        console.error("Form submission failed:", error);
        Alert.alert("Error", error.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Error during form submission:", err);
      Alert.alert("Error", "Unable to submit the form. Please check your network connection and try again.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.heading}>Welcome to the Book Services Page</Text>
        
        {loading ? (
          <ActivityIndicator size="large" color="#007BFF" />
        ) : (
          vendorData && (
            <>
              <View style={styles.card}>
                <Text style={styles.packageName}>{vendorData.package_name}</Text>
                <Text style={styles.description}>{vendorData.description}</Text>
                <Text style={styles.price}>Price: {vendorData.price}</Text>
              </View>

              <View style={styles.card}>
                <Text style={styles.vendorName}>{vendorData.vendor_name}</Text>
                <Text style={styles.category}>Category: {vendorData.category}</Text>
                <Text style={styles.category}>Phone: {vendorData.phone}</Text>
 <Text style={styles.location}>Location: {vendorData.location}</Text>
                <Text style={styles.email}>Email: {vendorData.email}</Text>
              </View>
            </>
          )
        )}

        <View style={styles.form}>
          <Text style={styles.subHeading}>Customer Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            keyboardType="phone-pad"
          />
          
          <Text style={styles.subHeading}>Location Details</Text>
          <TextInput
            style={styles.input}
            placeholder="State"
            value={formData.state}
            onChangeText={(value) => handleInputChange('state', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="City"
            value={formData.city}
            onChangeText={(value) => handleInputChange('city', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Area/House no"
            value={formData.area}
            onChangeText={(value) => handleInputChange('area', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Landmark"
            value={formData.landmark}
            onChangeText={(value) => handleInputChange('landmark', value)}
          />

<Text style={styles.subHeading}>advance_received</Text>
          <TextInput
            style={styles.input}
            placeholder="advance received"
            value={formData.advance_received}
            onChangeText={(value) => handleInputChange('advance_received', value)}
          />
          
          <Text style={styles.subHeading}>Date Details</Text>
          <TextInput
            style={styles.input}
            placeholder="Start Date (YYYY-MM-DD)"
            value={formData.startDate}
            onChangeText={(value) => handleInputChange('startDate', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="End Date (YYYY-MM-DD)"
            value={formData.endDate}
            onChangeText={(value) => handleInputChange('endDate', value)}
          />
          
          <Button title="Submit" onPress={handleSubmit} color="#007BFF" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 20,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  subHeading: {
    fontSize: 20,
    fontWeight: "600",
    color: "#555",
    marginVertical: 10,
  },
  card: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "100%",
  },
  vendorName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007BFF",
  },
  packageName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  description: {
    fontSize: 16,
    color: "#666",
    marginVertical: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#28A745",
  },
  category: {
    fontSize: 14,
    color: "#6C757D",
  },
  location: {
    fontSize: 14,
    color: "#6C757D",
  },
  email: {
    fontSize: 14,
    color: "#6C757D",
  },
  form: {
    width: "100%",
    marginTop: 20,
    paddingBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth:  1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
});