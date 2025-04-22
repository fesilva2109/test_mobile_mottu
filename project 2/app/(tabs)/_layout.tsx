// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <MaterialIcons name="dashboard" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="motorcycles"
        options={{
          title: 'Motorcycles',
          tabBarIcon: ({ color }) => <MaterialIcons name="motorcycle" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="yard"
        options={{
          title: 'Yard',
          tabBarIcon: ({ color }) => <MaterialIcons name="garage" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}