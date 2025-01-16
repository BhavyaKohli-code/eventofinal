import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import axios from 'axios';

export default function Booking() {
  const { userId } = useLocalSearchParams(); // Get userId from params
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (userId) {
      fetchBookings(userId);
    }
  }, [userId]);

  const fetchBookings = async (vendorId) => {
    try {
      const response = await axios.get(`http://65.0.135.159:5000/api2/vendors/${vendorId}/bookings`);
      setBookings(response.data); // Assuming the response contains an array of bookings
    } catch (error) {
      console.error('Error fetching bookings:', error.message || error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#763c3c" style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.subtitle}>Vendor ID: {userId}</Text>
      
      {bookings.length > 0 ? (
        <ScrollView style={styles.bookingsContainer}>
          {bookings.map((booking) => (
            <View key={booking.id} style={styles.bookingCard}>
              <Text style={styles.bookingText}>Customer Name: {booking.name}</Text>
              <Text style={styles.bookingText}>Email: {booking.email}</Text>
              <Text style={styles.bookingText}>Phone: {booking.phone}</Text>
              <Text style={styles.bookingText}>Package: {booking.package_name}</Text>
              <Text style={styles.bookingText}>Advance Payment: ₹{booking.advance_received}</Text>
              <Text style={styles.bookingText}>Start Date: {booking.start_date}</Text>
              <Text style={styles.bookingText}>End Date: {booking.end_date}</Text>
              <Text style={styles.bookingText}>Location: {booking.state}, {booking.city}, {booking.area}</Text>
              {booking.landmark && <Text style={styles.bookingText}>Landmark: {booking.landmark}</Text>}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text>No bookings found for this vendor.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#763c3c', // Pinkish color
    textShadowColor: "#ffe4e4", // Black shadow color
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  bookingsContainer: {
    marginTop: 20,
    width: '100%',
  },
  bookingCard: {
    padding: 15,
    backgroundColor: '#e3e3e3',
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    borderStyle: 'solid',
  },
  bookingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  loader: {
    marginVertical: 20,
  },
});
