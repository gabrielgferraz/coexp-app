import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import InsumosScreen from './src/screens/InsumosScreen';
import DetalhesInsumoScreen from './src/screens/DetalhesInsumoScreen';
import RegistrarEntradaScreen from './src/screens/RegistrarEntradaScreen';
import RegistrarSaidaScreen from './src/screens/RegistrarSaidaScreen';
import GestaoAcessosScreen from './src/screens/GestaoAcessosScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Insumos" component={InsumosScreen} />
          <Stack.Screen name="DetalhesInsumo" component={DetalhesInsumoScreen} />
          <Stack.Screen name="RegistrarEntrada" component={RegistrarEntradaScreen} />
          <Stack.Screen name="RegistrarSaida" component={RegistrarSaidaScreen} />
          <Stack.Screen name="GestaoAcessos" component={GestaoAcessosScreen} />
          <Stack.Screen name="Dashboard" component={DashboardScreen} />
        </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaProvider>  
  );
}
