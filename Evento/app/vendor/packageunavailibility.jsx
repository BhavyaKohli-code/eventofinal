import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, FlatList, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Calendar } from 'react-native-calendars'; // Ensure this library is installed
import axios from 'axios'; // Ensure axios is installed

const { width } = Dimensions.get('window');

export default function PackageUnavailability() {
  const { id, pkg } = useLocalSearchParams();
  const router = useRouter();

  // State for package details and loading/error status
  const [packageDetails, setPackageDetails] = useState(pkg ? JSON.parse(pkg) : null);
  const [loading, setLoading] = useState(!pkg);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [unavailabilityDates, setUnavailabilityDates] = useState([]); // State for unavailability dates

  useEffect(() => {
    const fetchPackageDetails = async () => {
      if (packageDetails) return; // Skip fetching if details are already provided

      try {
        const response = await fetch(`http://65.0.135.159:5000/packagesun1/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch package details');
        }
        const data = await response.json();
        setPackageDetails(data);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching package details:', err);
      } finally {
        setLoading(false);
      }
    };

    const fetchUnavailabilityDates = async () => {
      try {
        const response = await axios.get(`http://65.0.135.159:5000/api/package-non-availability/${id}`);
        setUnavailabilityDates(response.data.map(item => item.non_availability_date)); // Store the dates
      } catch (err) {
        console.error('Error fetching unavailability dates:', err);
      }
    };

    fetchPackageDetails();
    fetchUnavailabilityDates(); // Fetch unavailability dates
  }, [id, packageDetails]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the options here
  };

  const submitNonAvailabilityDate = async () => {
    if (!selectedDate) {
      alert('Please select a date before submitting.');
      return;
    }
    
    try {
      const response = await axios.post('http://65.0.135.159:5000/api/package-non-availability/posting', {
        package_id: id, // Assuming you have the vendor ID
        non_availability_date: selectedDate,
      });

      if (response.status === 200) {
        alert('Non-availability date submitted successfully!');
        setSelectedDate('');
        // Fetch updated unavailability dates
        const updatedResponse = await axios.get(`http://65.0.135.159:5000/api/carrental-package-non-availability/${id}`);
        setUnavailabilityDates(updatedResponse .data.map(item => item.non_availability_date)); // Update the unavailability dates
      } else {
        alert('Failed to submit non-availability date.');
      }
    } catch (error) {
      console.error('Error submitting non-availability date:', error);
      alert('An error occurred while submitting the date.');
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text>Loading package details...</Text>
      </View>
    );
  }

  if (error || !packageDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || 'Error: Package details not found.'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.header}>Package Details</Text>
        <View style={styles.card}>
          <Text style={styles.packageHeading}>{packageDetails.package_name}</Text>
          <Text style={styles.packageDescription}>{packageDetails.description}</Text>
          <Text style={styles.packagePrice}>₹{packageDetails.price}</Text>
        </View>

        <Calendar
          onDayPress={onDayPress}
          style={styles.calendar}
          theme={{
            selectedDayBackgroundColor: 'blue',
            todayTextColor: 'red',
            dayTextColor: 'black',
            textDisabledColor: '#d9e1e8',
            monthTextColor: 'black',
            arrowColor: 'blue',
            textDayFontFamily: 'Arial',
            textMonthFontFamily: 'Arial',
            textDayHeaderFontFamily: 'Arial',
            textDayFontSize: 16,
            textMonthFontSize: 20,
            textDayHeaderFontSize: 16,
          }}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: 'blue' },
          }}
        />

        {selectedDate ? (
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>Selected Date: {formatDate(selectedDate)}</Text>
          </View>
        ) : (
          <Text style={styles.selectedDateText}>No date selected</Text>
        )}

        <Text style={styles.nonAvailableHeader}>Non-Available Dates:</Text>
        {unavailabilityDates.length > 0 ? (
          <FlatList
            data={unavailabilityDates}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Text style={styles.nonAvailabilityDate}>{formatDate(item)}</Text>
            )}
          />
        ) : (
          <Text>No non-availability dates found.</Text>
        )}

        <TouchableOpacity style={styles.button} onPress={submitNonAvailabilityDate}>
          <Text style={styles.buttonText}>Submit Non-Availability Date</Text>
        </TouchableOpacity>

       
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    height:"100%"
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    elevation: 3,
    borderColor: 'black',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
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
    textAlign: 'center',
  },
  calendar: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    width : width * 0.9,
    alignSelf: 'center',
    backgroundColor: 'white',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  selectedDateContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#e0f7fa',
    borderRadius: 5,
    alignItems: 'center',
  },
  selectedDateText: {
    fontSize: 16,
    color: '#00796b',
    textAlign:"center"
  },
  nonAvailableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  nonAvailabilityDate: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginVertical: 5,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
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
});