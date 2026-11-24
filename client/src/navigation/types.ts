import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { TransactionType } from '@finwise/shared';

/**
 * Все экраны приложения и их параметры.
 * TypeScript проверяет, что мы переходим только на существующие экраны
 * и передаём им правильные параметры.
 */
export type RootStackParamList = {
  // 1–3. Запуск, онбординг, вход
  Onboarding: undefined;
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  FingerprintLogin: undefined;
  Forgot: undefined;
  SecurityCode: { email: string; demoCode: string };
  NewPassword: { resetToken: string };
  Success: { message: string; next: SuccessTarget };

  // 4–8. Главная и связанные экраны
  Home: undefined;
  Notifications: undefined;
  Balance: undefined;
  QuickAnalysis: undefined;

  // 9.2 Анализ
  Analysis: undefined;
  Search: undefined;
  Calendar: undefined;

  // 9.3 Транзакции
  Transactions: { type?: TransactionType } | undefined;
  AddTransaction: { type?: TransactionType; categoryId?: string } | undefined;
  TransactionDetails: { id: string };

  // 9.4 Категории и накопления
  Categories: undefined;
  CategoryDetail: { id: string };
  Savings: undefined;
  GoalDetail: { id: string };
  GoalDeposit: { id: string };

  // 9.5 Профиль
  Profile: undefined;
  EditProfile: undefined;
  Security: undefined;
  ChangePin: undefined;
  Fingerprints: undefined;
  AddFingerprint: undefined;
  FingerprintDetail: { id: string };
  Terms: undefined;
  Settings: undefined;
  NotificationSettings: undefined;
  ChangePassword: undefined;
  DeleteAccount: undefined;
  Help: undefined;
  SupportChat: undefined;
};

export type RouteName = keyof RootStackParamList;

/** Куда можно перейти после экрана «Успешно» (экраны без параметров) */
export type SuccessTarget = 'Login' | 'Security' | 'Fingerprints' | 'Settings';

/** Вкладки нижнего меню */
export type TabName = 'Home' | 'Analysis' | 'Transactions' | 'Categories' | 'Profile';

export type Nav = NativeStackNavigationProp<RootStackParamList>;

/** Навигация с типами */
export const useNav = () => useNavigation<Nav>();

/** Параметры текущего экрана с типами */
export const useParams = <R extends RouteName>() =>
  useRoute<RouteProp<RootStackParamList, R>>().params as RootStackParamList[R];
