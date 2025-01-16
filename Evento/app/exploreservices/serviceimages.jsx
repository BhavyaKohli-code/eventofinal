import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  Pressable,
  ImageBackground,
  ScrollView,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Video } from 'expo-av';

export default function MediaScreen() {
  const [media, setMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const route = useRoute();
  const { packageId } = route.params;

  useEffect(() => {
    // Fetch media (images and videos) for the specific package
    fetch(`http://65.0.135.159:5000/api/decorators/package-images/${packageId}`)
      .then((response) => response.json())
      .then((data) => {
        setMedia(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching media:', error);
        setLoading(false);
      });
  }, [packageId]);

  const renderMediaItem = ({ item }) => (
    <TouchableOpacity
      style={styles.mediaItem}
      onPress={() => {
        setSelectedMedia(item);
        setModalVisible(true);
      }}
    >
      {item.type === 'image' ? (
        <Image source={{ uri: item.image_url }} style={styles.mediaImage} resizeMode="cover" />
      ) : (
        <Video
          source={{ uri: item.image_url }}
          style={styles.mediaImage}
          resizeMode="cover"
          shouldPlay={false} // Paused by default
        />
      )}
    </TouchableOpacity>
  );

  const closeModal = () => {
    setModalVisible(false);
    setSelectedMedia(null);
  };

  return (
    <ImageBackground
          source={require('./laptop-ratio-image.jpg')} // Replace with your image filename
          style={styles.modalContainer}
        >
          <ScrollView>
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#763c3c" />
        </View>
      ) : (
        <FlatList
          data={media}
          renderItem={renderMediaItem}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3} // Grid layout
          contentContainerStyle={styles.grid}
        />
      )}

      {/* Modal for displaying selected media */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <ImageBackground
          source={require('./laptop-ratio-image.jpg')} // Replace with your image filename
          style={styles.modalContainer}
        >
          <Pressable style={styles.closeButton} onPress={closeModal}>
            <Text style={styles.closeButtonText}>X</Text>
          </Pressable>
          {selectedMedia && (
            <View style={styles.modalContent}>
              {selectedMedia.type === 'image' ? (
                <Image
                  source={{ uri: selectedMedia.image_url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                />
              ) : (
                <Video
                  source={{ uri: selectedMedia.image_url }}
                  style={styles.modalImage}
                  resizeMode="contain"
                  shouldPlay={true} // Autoplay video
                  isLooping={true} // Loop video
                  useNativeControls={true}
                />
              )}
            </View>
          )}
        </ImageBackground>
      </Modal>
    </View>
    </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent', // Light background color
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaItem: {
    margin: 5,
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#ffffff', // White background for media items
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    justifyContent: 'center', // Center content vertically
    alignItems: 'center', // Center content horizontally
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  grid: {
    justifyContent: 'space-between',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 60, 60, 0.6)', // Dull background using primary color (pinkish)
    // Image background will be placed here
  },
  modalContent: {
    width: '90%',
    height: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  closeButton: {
    position: 'absolute',
    top: 40,
    right: 20,
    backgroundColor: '#ffffff', // White background for close button
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'black',
  },
  mediaVideo: {
    width: '100%', // Ensures full width
    height: '100%', // Ensures full height
    alignSelf: 'center', // Centers the video inside the container
  },
});
