import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function PackageManager() {
  const { vendorid } = useLocalSearchParams();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [packageName, setPackageName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    fetchPackages();
  }, [vendorid]);

  const fetchPackages = () => {
    setLoading(true);
    fetch(`http://65.0.135.159:5000/package-manager/${vendorid}`)
      .then(response => response.json())
      .then(data => {
        setPackages(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching packages:', error);
        setLoading(false);
      });
  };

  const handleAddPackage = () => {
    fetch('http://65.0.135.159:5000/add-packages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        vendor_id: vendorid,
        package_name: packageName,
        description,
        price: parseFloat(price),
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add package');
        }
        return response.json();
      })
      .then(() => {
        Alert.alert('Success', 'Package added successfully!');
        setPackageName('');
        setDescription('');
        setPrice('');
        fetchPackages(); // Refresh the package list
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  const handleRemovePackage = (id) => {
    fetch(`http://65.0.135.159:5000/delete-packages/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to remove package');
        }
        Alert.alert('Success', 'Package removed successfully!');
        fetchPackages(); // Refresh the package list
      })
      .catch(error => {
        Alert.alert('Error', error.message);
      });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.packageList}>
    <View style={styles.container}>
      <Text style={styles.heading}>Packages for Vendor ID: {vendorid}</Text>

      <View style={styles.addPackageContainer}>
        <TextInput
          placeholder="Package Name"
          value={packageName}
          onChangeText={setPackageName}
          style={styles.input}
        />
        <TextInput
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
        />
        <TextInput
          placeholder="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddPackage}>
          <Text style={styles.addButtonText}>Add Package</Text>
        </TouchableOpacity>
      </View> 

      
      
        {packages.length > 0 ? (
          packages.map(pkg => (
            <View key={pkg.id} style={styles.packageCard}>
              <Text style={styles.packageName}>{pkg.package_name}</Text>
              <Text style={styles.packageDescription}>{pkg.description}</Text>
              <Text style={styles.packagePrice}>Price: ₹{pkg.price}</Text>
              <TouchableOpacity style={styles.removeButton} onPress={() => handleRemovePackage(pkg.id)}>
                <Text style={styles.removeButtonText}>Remove Package</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noPackagesText}>No packages found for this vendor.</Text>
        )}
      
      </View>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  packageList: {
    marginTop: 10,
  },
  packageCard: {
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  packageDescription: {
    fontSize: 14,
    color: '#555',
  },
  packagePrice: {
    fontSize: 16,
    color: '#000',
    marginTop: 5,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noPackagesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#888',
  },
  addPackageContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 8,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});