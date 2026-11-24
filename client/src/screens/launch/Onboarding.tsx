import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { CoinsHand, IllustrationCircle, PhoneHand } from '@/components/illustrations';
import { Screen } from '@/components/Screen';
import { T } from '@/components/ui';
import { useAuth } from '@/context/AuthContext';
import { colors } from '@/theme';

const slides = [
  { title: 'Добро пожаловать\nв менеджер расходов', Art: CoinsHand },
  { title: 'Готовы взять\nфинансы\nпод контроль?', Art: PhoneHand },
];

/** 2-A и 2-B. Онбординг из двух слайдов */
export function Onboarding() {
  const [step, setStep] = useState(0);
  const { finishOnboarding } = useAuth();
  const { title, Art } = slides[step];
  const last = step === slides.length - 1;

  return (
    <Screen
      bell={false}
      header={
        <T size={27} weight="semibold" center style={{ lineHeight: 36, paddingTop: 40, paddingBottom: 50 }}>
          {title}
        </T>
      }
      sheetStyle={{ paddingTop: 48, alignItems: 'center', gap: 32 }}
    >
      <IllustrationCircle>
        <Art />
      </IllustrationCircle>
      {/* После последнего слайда навигатор сам покажет экран «Войти/Регистрация» */}
      <Pressable onPress={() => (last ? finishOnboarding() : setStep(step + 1))} hitSlop={12}>
        <T size={28} weight="semibold">
          {last ? 'Начать' : 'Далее'}
        </T>
      </Pressable>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {slides.map((s, i) => (
          <Pressable
            key={s.title}
            onPress={() => setStep(i)}
            accessibilityLabel={`Слайд ${i + 1}`}
            style={{
              width: 13,
              height: 13,
              borderRadius: 7,
              borderWidth: 1.5,
              borderColor: i === step ? colors.primary : colors.dark,
              backgroundColor: i === step ? colors.primary : 'transparent',
            }}
          />
        ))}
      </View>
    </Screen>
  );
}
