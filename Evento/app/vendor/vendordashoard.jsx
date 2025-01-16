import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function VendorDashboard() {
  const { userId, userName, userEmail } = useLocalSearchParams();
  const router = useRouter();

  if (!userId || !userName || !userEmail) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: Missing user data.</Text>
      </View>
    );
  }

  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [vendorCategory, setVendorCategory] = useState(null);

  useEffect(() => {
    if (userId) {
      fetchVendorDetails(userId);
      fetchVendorPackages(userId);
    }
  }, [userId]);

  const fetchVendorDetails = async (vendorId) => {
    try {
      const response = await axios.get(`http://65.0.135.159:5000/api2/vendors/${vendorId}`);
      setVendorCategory(response.data.category); // Assuming the response contains the category
    } catch (error) {
      console.error('Error fetching vendor details:', error.message || error);
    }
  };

  const fetchVendorPackages = async (vendorId) => {
    try {
      const response = await axios.get(`http://65.0.135.159:5000/api/vendor-packages/${vendorId}`);
      setPackages(response.data);
    } catch (error) {
      console.error('Error fetching packages:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  const manageImage = (pkg) => {
    console.log("Package to be passed: ", pkg);
    router.push({
      pathname: '/vendor/PackageImageManager',
      params: { pkg: JSON.stringify(pkg) },
    });
  };

  const manageUnavailability = (pkg) => {
    console.log("Managing unavailability for package: ", pkg);
    router.push({
      pathname: '/vendor/packageunavailibility', // Ensure the path is correct
      params: { 
        id: pkg.id, // Assuming pkg has an id
        pkg: JSON.stringify(pkg), // Pass the package details if needed
        userId: userId // Pass the userId as well
      },
    });
  };

  const manageDate = () => {
    router.push({
      pathname: '/vendor/datemanagement',
      params: { userId, userName },
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome, {userName}!</Text>
      <Text style={styles.subtitle}>Email: {userEmail}</Text>
      <Text style={styles.subtitle}>Category: {vendorCategory}</Text>
      <Text style={styles.subtitle}>Vendor ID: {userId}</Text>
      <TouchableOpacity
        style={styles.manageButton}
        onPress={() => {
          router.push({
            pathname: '/vendor/Bookings', // Replace with the actual path for booking
            params: { userId }, // Pass the userId as a parameter
          });
        }}
      >
        <Text style={styles.manageButtonText}>See Booking</Text>
      </TouchableOpacity>
      
      {/* Manage Date Management Button */}
      {vendorCategory !== 'Rental Cars' && (
        <TouchableOpacity
          style={styles.button}
          onPress={manageDate}
        >
          <Text style={styles.buttonText}>Go to Date Management</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Your Packages:</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      ) : packages.length > 0 ? (
        packages.map((pkg, index) => (
          <View key={index} style={styles.package}>
            <Text style={styles.packageHeading}>{pkg.package_name}</Text>
            <Text style={styles.packageDescription}>{pkg.description}</Text>
            <Text style={styles.packagePrice}>₹{pkg.price}</Text>
           
            <TouchableOpacity
              style={styles.manageButton}
              onPress={() => manageImage(pkg)}
            >
              <Text style={styles.manageButtonText}>Manage Images</Text>
            </TouchableOpacity>
            {vendorCategory === 'Rental Cars' && (
              <TouchableOpacity
                style={styles.manageButton}
                onPress={() => manageUnavailability(pkg)}
              >
                <Text style={styles.manageButtonText}>Manage Unavailability</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noPackages}>No packages available for this vendor.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#ffffff', // Light background color
    height:"100%"
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,
    textShadowColor: "#ffe4e4", // Text shadow color
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#763c3c', // Brownish color for text
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginVertical: 20,
    color: '#763c3c', // Brownish color for text
  },
  loader: {
    marginVertical: 20,
  },
  noPackages: {
    fontSize: 16,
    color: '#763c3c', // Brownish color for text
    marginVertical: 10,
  },
  package: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    width: '100%', // Make it responsive
    maxWidth: 400, // Limit max width
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    borderColor: "black",
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  packageHeading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  packageDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  packagePrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#763c3c', // Brown shade for buttons
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  manageButton: {
    backgroundColor: '#763c3c', // Brown shade for buttons
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});