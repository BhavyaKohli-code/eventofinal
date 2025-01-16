import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

export default function DecoratorsScreen() {
  const [packages, setPackages] = useState([]);
  const [filteredPackages, setFilteredPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationFilter, setLocationFilter] = useState('');
  const [maxPriceFilter, setMaxPriceFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [unavailableVendors, setUnavailableVendors] = useState([]);
  const locations = [
    "Bhatpara", "Ichapur", "Titagarh", "Khardaha", "Birati", "New Barrackpur", "Hridaypur", "Bamangachhi",
      "Barasat", "Madhyamgram", "Barrackpore", "Kolkata", "Dumdum", "Howrah", "Naihati", "Shyamnagar", 
      "Nadia", "Habra", "Jagatdal", "Chandannagar", "Chinsurah", "Bandel", "Kanchrapara", "Kalyani", 
      "Sonarpur", "Baruipur", "Gobardanga", "Bangaon", "Chakdaha", "Haringhata", "Jaguli"
  ];
  const navigation = useNavigation();

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await fetch('http://65.0.135.159:5000/api/mehandi-artists/packages');
        const data = await response.json();
        setPackages(data);
        setFilteredPackages(data);
      } catch (error) {
        console.error('Error fetching packages:', error);
      }
    };

    const fetchUnavailableVendors = async () => {
      try {
        const response = await fetch('http://65.0.135.159:5000/vendor-availability');
        const data = await response.json();
        setUnavailableVendors(data);
      } catch (error) {
        console.error('Error fetching vendor availability:', error);
      }
    };

    Promise.all([fetchPackages(), fetchUnavailableVendors()]).finally(() => setLoading(false));
  }, []);

  const filterPackages = () => {
    let availablePackages = packages;

    // Filter by location
    if (locationFilter) {
      availablePackages = availablePackages.filter(pkg => pkg.location === locationFilter);
    }

    // Filter by maximum price
    if (maxPriceFilter && !isNaN(maxPriceFilter)) {
      availablePackages = availablePackages.filter(pkg => parseFloat(pkg.price) <= parseFloat(maxPriceFilter));
    }

    // Filter by date range
    if (startDate && endDate) {
      const formattedStartDate = new Date(startDate).toISOString().split('T')[0];
      const formattedEndDate = new Date(endDate).toISOString().split('T')[0];

      const unavailableVendorIds = unavailableVendors
        .filter(
          (entry) =>
            (entry.non_availability_date >= formattedStartDate &&
              entry.non_availability_date <= formattedEndDate)
        )
        .map((entry) => entry.vendor_id);

      availablePackages = availablePackages.filter(
        (pkg) => !unavailableVendorIds.includes(pkg.vendor_id)
      );
    }

    setFilteredPackages(availablePackages);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>mehandi-artists</Text>
      <View style={styles.filterContainer}>
        <Picker
          selectedValue={locationFilter}
          onValueChange={(itemValue) => setLocationFilter(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Location" value="" />
          {locations.map(location => (
            <Picker.Item key={location} label={location} value={location} />
          ))}
        </Picker>
        <TextInput
          style={styles.input}
          placeholder="Max Price"
          keyboardType="numeric"
          value={ maxPriceFilter}
          onChangeText={setMaxPriceFilter}
        />
        <TextInput
          style={styles.input}
          placeholder="Start Date (YYYY-MM-DD)"
          value={startDate}
          onChangeText={(text) => {
            if (text.length <= 10) {
              setStartDate(text);
            }
          }}
        />
        <TextInput
          style={styles.input}
          placeholder="End Date (YYYY-MM-DD)"
          value={endDate}
          onChangeText={(text) => {
            if (text.length <= 10) {
              setEndDate(text);
            }
          }}
        />
        <TouchableOpacity style={styles.button} onPress={filterPackages}>
          <Text style={styles.buttonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredPackages}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.packageContainer}>
            <Text style={styles.packageName}>{item.package_name}</Text>
            <Text style={styles.packagePrice}>Vendor ID: {item.vendor_id}</Text>
            <Text style={styles.packageDescription}>{item.description}</Text>
            <Text style={styles.packagePrice}>Price: ₹{item.price}</Text>
            <Text style={styles.packageLocation}>Location: {item.location}</Text>
            <TouchableOpacity
              style={styles.mediaButton}
              onPress={() => navigation.navigate('exploreservices/serviceimages', { packageId: item.package_id })}
            >
              <Text style={styles.buttonText}>Show Media</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={() => {
                console.log('Navigating to bookservices with packageId:', item.package_id);
                navigation.navigate('bookservices/servicebooking', { packageId: item.package_id });
              }}
            >
              <Text style={styles.buttonText}>Book Now</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#343a40',
    textAlign:"center"
  },
  filterContainer: {
    marginBottom: 20,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  picker: {
    height: 50,
    marginBottom: 12,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
  },
  input: {
    height: 45,
    borderColor: '#ced4da',
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 12,
    paddingHorizontal: 10,
    backgroundColor: '#ffffff',
  },
  packageContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  packageName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#495057',
  },
  packageDescription: {
    fontSize: 16,
    marginVertical: 8,
    color: '#6c757d',
  },
  packagePrice: {
    fontSize: 18,
    color: '#28a745',
  },
  packageLocation: {
    fontSize: 16,
    color: '#6c757d',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaButton: {
    backgroundColor: '#17a2b8',
    padding: 12,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  bookButton: {
    backgroundColor: '#28a745',
    padding:  12,
    borderRadius: 4,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
});