import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Image, FlatList, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useGlobalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Video } from 'expo-av';
import axios from 'axios';

export default function PackageImageManager() {
  const { pkg } = useGlobalSearchParams();
  const [packageDetails, setPackageDetails] = useState(null);
  const [media, setMedia] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [packageMedia, setPackageMedia] = useState([]);
  const [isLoadingMedia, setIsLoadingMedia] = useState(false);
  const [error, setError] = useState(null);
  const [fileUri, setFileUri] = useState(null);
  const [fileType, setFileType] = useState(null);

  useEffect(() => {
    try {
      if (pkg) {
        const parsedData = JSON.parse(decodeURIComponent(pkg));
        setPackageDetails(parsedData);
        fetchPackageMedia(parsedData.id);
      } else {
        setError("Missing 'pkg' parameter in query.");
      }
    } catch (error) {
      setError("Error parsing 'pkg' parameter.");
    }
  }, [pkg]);

  const fetchPackageMedia = async (packageId) => {
    setIsLoadingMedia(true);
    try {
      const response = await fetch(`http://65.0.135.159:5000/package-media/${packageId}`);
      const data = await response.json();
      if (data.media) {
        setPackageMedia(data.media);
      } else {
        setError("No media found for this package.");
      }
    } catch (error) {
      setError("Error fetching package media.");
    } finally {
      setIsLoadingMedia(false);
    }
  };

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access media library is required!");
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (!result.canceled) {
      const selectedMedia = result.assets[0];
      console.log("Selected Media:", selectedMedia); // Log the selected media
      setFileUri(selectedMedia.uri);
      const extension = selectedMedia.uri.split('.').pop();
      const mimeType = extension === 'mp4' ? 'video/mp4' : `image/${extension}`;
      setFileType(mimeType);
      setMedia(selectedMedia); // Set media for preview
    }
  };

  const renderMediaPreview = () => {
    if (media?.uri) {
      if (fileType.includes('image')) {
        return <Image source={{ uri: media.uri }} style={styles.previewImage} />;
      } else if (fileType.includes('video')) {
        return (
          <View style={styles.videoContainer}>
            <Video
              loop={true}
              autoPlay={isPlaying}
              source={{ uri: media.uri }}
              style={styles.videoPreview}
              controls={true}
              resizeMode="contain"
              onError={(error) => {
                console.error("Video playback error:", error);
                setError("Error playing video.");
              }}
            />
          </View>
        );
      }
    }
  };

  const handleUpload = async () => {
    if (!fileUri) {
      Alert.alert('Please select a file first');
      return;
    }
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append('media', {
      uri: fileUri,
      type: fileType,
      name: fileUri.split('/').pop(),
    });
    formData.append('package_id', packageDetails.id.toString()); // Use the actual package ID
    formData.append('type', fileType.includes('video') ? 'video' : 'image');
  
    try {
      const response = await axios.post('http://65.0.135.159:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Alert.alert('Upload successful', response.data.message);
      
      // Fetch the updated media list after successful upload
      fetchPackageMedia(packageDetails.id);
      
      // Clear the selected media preview
      setMedia(null);
      setFileUri(null);
      setFileType(null);
    } catch (error) {
      console.error('Upload error:', error);
      Alert.alert('Upload failed', error.response?.data?.message || 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  const renderMediaGrid = ({ item }) => {
    return (
      <View style={styles.mediaItem}>
        {item.type === 'image' ? (
          <Image source={{ uri: item.image_url }} style={styles.gridImage} />
        ) : item.type === 'video' ? (
          <Video
            source={{ uri: item.image_url }}
            style={styles.gridImage}
            controls={true}
            resizeMode="contain"
            paused={true}
          />
        ) : (
          <Text style={styles.unsupportedText}>Unsupported media type</Text>
        )}
      </View>
    );
  };

  if (!packageDetails) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error || "Loading package details..."}</Text>
      </View>
    );
  }

  const { id, package_name, description, price, image_url } = packageDetails;

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.packageName}>{package_name}</Text>
          <Text style={styles.descriptionText}>{description}</Text>
          <Text style={styles.priceText}>Price: ₹{price}</Text>
          <Image source={{ uri: image_url }} style={styles.packageImage} />
        </View>

        <TouchableOpacity style={styles.button} onPress={pickMedia}>
          <Text style={styles.buttonText}>Pick Media</Text>
        </TouchableOpacity>
        {renderMediaPreview()}
        <TouchableOpacity style={styles.button} onPress={handleUpload} disabled={isUploading}>
          <Text style={styles.buttonText}>Upload Media</Text>
        </TouchableOpacity>

        {isUploading && <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />}

        {isLoadingMedia ? (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        ) : (
          <FlatList
            data={packageMedia}
            renderItem={renderMediaGrid}
            keyExtractor={(item) => item.id.toString()}
            numColumns={3}
            contentContainerStyle={styles.gridContainer}
          />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  packageName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  descriptionText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 5,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  packageImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginVertical: 10,
  },
  mediaItem: {
    margin: 5,
    width: 100,
    height: 100,
  },
  gridImage: {
    width: '100%',
    height: '100%',
    borderRadius: 5,
  },
  gridContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewImage: {
    width: 200,
    height: 200,
    marginVertical: 10,
    borderRadius: 10,
  },
  videoContainer: {
    width: 200,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
  unsupportedText: {
    color: '#999',
    textAlign: 'center',
  },
  centered: {
 justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  loadingIndicator: {
    marginVertical: 20,
  },
});