import { Tabs } from 'expo-router';
import { Platform, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { FileKey as MotorcycleKey, Camera as CameraIcon, MapPin, ChartBar as BarChart3 } from 'lucide-react-native';
import { BlurView } from 'expo-blur';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.neutral[500],
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarBackground: () => 
          Platform.OS === 'ios' ? (
            <BlurView intensity={90} style={StyleSheet.absoluteFill} tint="light" />
          ) : null,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Register',
          tabBarIcon: ({ color, size }) => (
            <CameraIcon size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="motorcycles"
        options={{
          title: 'Motorcycles',
          tabBarIcon: ({ color, size }) => (
            <MotorcycleKey size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="yard"
        options={{
          title: 'Yard Map',
          tabBarIcon: ({ color, size }) => (
            <MapPin size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <BarChart3 size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    elevation: 0,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.neutral[200],
    backgroundColor: Platform.OS === 'android' ? 'rgba(255, 255, 255, 0.95)' : undefined,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
});