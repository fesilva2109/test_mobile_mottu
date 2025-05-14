import { Tabs } from 'expo-router';
import { Dimensions, Platform } from 'react-native';
import { LayoutGrid, ChartBar as BarChart3, QrCode, Chrome as Home } from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  // Adjust tab bar height for different devices
  const isTablet = Dimensions.get('window').width >= 768;
  const tabBarHeight = isTablet ? 70 : 60;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary.default,
        tabBarInactiveTintColor: Colors.neutral.gray,
        tabBarStyle: {
          height: tabBarHeight,
          paddingBottom: Platform.OS === 'ios' ? 20 : 10,
          backgroundColor: Colors.neutral.white,
          borderTopColor: Colors.neutral.light,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: isTablet ? 14 : 12,
          fontWeight: '500',
          marginBottom: 5,
        },
        headerStyle: {
          backgroundColor: Colors.neutral.white,
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.neutral.light,
        },
        headerTitleStyle: {
          color: Colors.neutral.dark,
          fontWeight: '600',
          fontSize: isTablet ? 24 : 20,
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          headerTitle: 'Mottu Yard',
        }}
      />
      <Tabs.Screen
        name="mapa"
        options={{
          title: 'Mapa',
          tabBarIcon: ({ color, size }) => <LayoutGrid size={size} color={color} />,
          headerTitle: 'Mapa do Pátio',
        }}
      />
      <Tabs.Screen
        name="cadastro"
        options={{
          title: 'Cadastro',
          tabBarIcon: ({ color, size }) => <QrCode size={size} color={color} />,
          headerTitle: 'Cadastro de Motos',
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <BarChart3 size={size} color={color} />,
          headerTitle: 'Dashboard',
        }}
      />
    </Tabs>
  );
}