import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button, FlatList, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Calendar } from 'react-native-calendars'; // Ensure this library is installed
import axios from 'axios'; // Ensure axios is installed

const { width } = Dimensions.get('window');

export default function DateManagementPage() {
  const { userId, userName } = useLocalSearchParams();
  const [selectedDate, setSelectedDate] = useState('');
  const [nonAvailableDates, setNonAvailableDates] = useState([]);

  useEffect(() => {
    // Fetch non-available dates from the backend
    const fetchNonAvailableDates = async () => {
      try {
        const response = await axios.get(`http://65.0.135.159:5000/vendor_availability/${userId}`);
        setNonAvailableDates(response.data);
      } catch (error) {
        console.error('Error fetching non-available dates:', error);
      }
    };

    fetchNonAvailableDates();
  }, [userId]);

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);
    console.log('Selected day:', day);
  };

  const addNonAvailableDate = async () => {
    if (!selectedDate) return;

    try {
      await axios.post('http://65.0.135.159:5000/vendor_availability', {
        vendor_id: userId,
        non_availability_date: selectedDate,
      });
      // Refresh the list of non-available dates
      const response = await axios.get(`http://65.0.135.159:5000/vendor_availability/${userId}`);
      setNonAvailableDates(response.data);
      setSelectedDate(''); // Clear selected date
    } catch (error) {
      console.error('Error adding non-available date:', error);
    }
  };

  // Function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(); // You can customize the options here
  };

  return (
    <ScrollView>
    <View style={styles.container}>
      <Text style={styles.header}>Date Management</Text>
      <Text style={styles.info}>Vendor ID: {userId}</Text>
      <Text style={styles.info}>Vendor Name: {userName}</Text>
      
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
          <Button title="Add Non-Available Date" onPress={addNonAvailableDate} />
        </View>
      ) : (
        <Text style={styles.selectedDateText}>No date selected</Text>
      )}

      <Text style={styles.nonAvailableHeader}>Non-Available Dates:</Text>
      <FlatList
        data={nonAvailableDates}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.nonAvailableDate}>{formatDate(item.non_availability_date)}</Text>
        )}
      />
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
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
    color: '#555',
  },
  calendar: {
    marginTop: 20,
    borderRadius: 10,
    overflow: 'hidden',
    width: width * 0.9,
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
  },
  nonAvailableHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
    color: '#333',
  },
  nonAvailableDate: {
    fontSize: 16,
    marginVertical: 5,
    textAlign: 'center',
    color: '#555',
  },
});