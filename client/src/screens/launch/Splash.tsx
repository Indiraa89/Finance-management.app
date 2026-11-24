import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { Logo, LogoMark } from '@/components/illustrations';
import { FullScreen } from '@/components/Screen';

/** 1-A. Сплэш: зелёный экран с логотипом, пока приложение загружается */
export function Splash({ fontsLoaded }: { fontsLoaded: boolean }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, { toValue: 1, duration: 700, useNativeDriver: true }).start();
  }, [anim]);

  return (
    <FullScreen>
      <Animated.View
        style={{
          opacity: anim,
          transform: [{ scale: anim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
        }}
      >
        {/* Пока шрифт не загружен, показываем только значок — без «прыжка» текста */}
        {fontsLoaded ? <Logo /> : <LogoMark />}
      </Animated.View>
    </FullScreen>
  );
}
