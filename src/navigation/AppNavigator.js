import React from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import SplashScreen            from '../screens/SplashScreen';
import AuthScreen              from '../screens/AuthScreen';
import OTPScreen               from '../screens/OTPScreen';
import PlantationSummaryScreen from '../screens/PlantationSummaryScreen';
import AddPlantationScreen     from '../screens/AddPlantationScreen';
import RiskGuideScreen         from '../screens/RiskGuideScreen';
import ChatbotScreen           from '../screens/ChatbotScreen';
import PlantationDetailScreen  from '../screens/PlantationDetailScreen';
import PlantationsScreen       from '../screens/PlantationsScreen';
import AlertsScreen            from '../screens/AlertsScreen';
import ProfileScreen           from '../screens/ProfileScreen';

import { useApp }        from '../context/AppContext';
import { COLORS, FONTS } from '../theme';
import Icon              from '../components/LucideIcon';

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Tab       = createBottomTabNavigator();

// Stack interne de l'onglet Accueil — PlantationSummary est l'écran home
function HomeNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <HomeStack.Screen name="Home"              component={PlantationSummaryScreen} />
      <HomeStack.Screen name="RiskGuide"         component={RiskGuideScreen} />
      <HomeStack.Screen name="AddPlantation"     component={AddPlantationScreen} />
      <HomeStack.Screen name="PlantationDetail"  component={PlantationDetailScreen} />
      <HomeStack.Screen name="Plantations"       component={PlantationsScreen} />
      <HomeStack.Screen name="Alerts"            component={AlertsScreen} />
      <HomeStack.Screen name="Profile"           component={ProfileScreen} />
    </HomeStack.Navigator>
  );
}

// 2 onglets principaux
function MainTabs() {
  const { unreadCount } = useApp();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.bgPrimary,
          borderTopColor: COLORS.border,
          borderTopWidth: 1,
          height: 68,
          paddingBottom: 12,
          paddingTop: 8,
        },
        tabBarActiveTintColor:   COLORS.brand,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontFamily: FONTS.medium },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeNavigator}
        options={{
          tabBarLabel: 'Accueil',
          tabBarIcon: ({ focused, color }) => (
            <Icon name="Home" size={22} color={color} strokeWidth={focused ? 2.5 : 1.75} />
          ),
        }}
      />
      <Tab.Screen
        name="ChatbotTab"
        component={ChatbotScreen}
        options={{
          tabBarLabel: 'Assistant IA',
          tabBarIcon: ({ focused, color }) => (
            <View>
              <Icon name="Bot" size={22} color={color} strokeWidth={focused ? 2.5 : 1.75} />
              <View style={[styles.liveDot, { backgroundColor: focused ? COLORS.success : COLORS.textMuted }]} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Splash"            component={SplashScreen} />
        <RootStack.Screen name="Auth"              component={AuthScreen} />
        <RootStack.Screen name="OTP"               component={OTPScreen} />
        <RootStack.Screen name="AddPlantation"     component={AddPlantationScreen} />
        <RootStack.Screen name="PlantationSummary" component={PlantationSummaryScreen} />
        <RootStack.Screen name="Main"              component={MainTabs} options={{ animation: 'fade' }} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  liveDot: {
    position: 'absolute',
    top: 0, right: -2,
    width: 7, height: 7,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.bgPrimary,
  },
});
