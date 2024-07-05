import { Tabs } from 'expo-router';
import React from 'react';

import { TabBarIcon } from '@/components/navigation/TabBarIcon';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import {StyleSheet, View} from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'black' // Background color of the tab bar
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabBarItem}>
              <TabBarIcon  name={focused ? 'home' : 'home-outline'} color="white"/>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Upload',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabBarItem}>
            <TabBarIcon style={styles.tabBarItem} name={focused ? 'camera' : 'camera-outline'} color="white"/>
            </View>
          ),
        }}
      />
       <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={styles.tabBarItem}>
              <TabBarIcon style={styles.tabBarItem} name={focused ? 'person' : 'person-outline'} color="white"/>
            </View>
          ),
        }}
      />
    </Tabs>
    
  );
}

const styles = StyleSheet.create({
  tabBarItem: {
   color: "white",
   borderColor: "white"
  },
});
