import React from 'react';
import { View, Image, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';

// Define the type for each image item
interface ImageItem {
    uri: string;
  }

// Define the types for the navigation parameters
type StackParamList = {
  StoryViewScreen: {
    images: ImageItem[];
  };
};

// Define props type for StoryViewScreen
interface StoryViewScreenProps {
  route: RouteProp<StackParamList, 'StoryViewScreen'>;
}

const StoryViewScreen: React.FC<StoryViewScreenProps> = ({ route }) => {
  // Access the images parameter from the navigation route
  const { images } = route.params;

  return (
    <ScrollView>
      {images.map((img, index) => (
        <Image key={index} source={{ uri: img.uri }} style={{ width: '100%', height: 300 }} />
      ))}
    </ScrollView>
  );
};

export default StoryViewScreen;
