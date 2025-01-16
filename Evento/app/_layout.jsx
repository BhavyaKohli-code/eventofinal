import React from 'react';
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
         headerShown: false 
      }}
    >
      {/* Admin Login Route */}
      <Stack.Screen name="admin/login" options={{ title: 'Login' }} />
      
      {/* Admin Page */}
      <Stack.Screen name="admin" options={{ title: 'Admin' }} />
      
      {/* Service Explorer */}
      <Stack.Screen name="exploreservices/serviceimages" />
      
      {/* Caterers Route */}
      <Stack.Screen name="exploreservices/services/Caterers" options={{ title: 'Caterers' }} />
      
      {/* Booking Services */}
      <Stack.Screen name="bookservices/index" options={{ title: 'Book Services' }} />
    </Stack>
  );
}
