import {
  Montserrat_300Light,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
  useFonts,
} from '@expo-google-fonts/montserrat';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { RootNavigator } from '@/navigation/RootNavigator';
import { Splash } from '@/screens/launch/Splash';
import { colors } from '@/theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 10_000 },
  },
});

/** Сплэш показываем минимум 1,5 с, пока грузятся шрифты и проверяется вход */
function Root() {
  const { loading } = useAuth();
  const [fontsLoaded] = useFonts({
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });
  const [minTimePassed, setMinTimePassed] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMinTimePassed(true), 1500);
    return () => clearTimeout(id);
  }, []);

  if (loading || !fontsLoaded || !minTimePassed) return <Splash fontsLoaded={fontsLoaded} />;

  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <StatusBar style="dark" />
          {/* В браузере показываем приложение в «рамке телефона» */}
          <View style={s.outer}>
            <View style={s.device}>
              <Root />
            </View>
          </View>
        </AuthProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

const s = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: Platform.OS === 'web' ? colors.canvas : colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  device: {
    flex: 1,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 430 : undefined,
    maxHeight: Platform.OS === 'web' ? 932 : undefined,
    overflow: 'hidden',
    backgroundColor: colors.primary,
    borderRadius: Platform.OS === 'web' ? 32 : 0,
  },
});
