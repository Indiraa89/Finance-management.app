import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '@/context/AuthContext';
import { Analysis } from '@/screens/analysis/Analysis';
import { CalendarScreen } from '@/screens/analysis/CalendarScreen';
import { Search } from '@/screens/analysis/Search';
import { FingerprintLogin } from '@/screens/auth/FingerprintLogin';
import { ForgotPassword } from '@/screens/auth/ForgotPassword';
import { Login } from '@/screens/auth/Login';
import { NewPassword } from '@/screens/auth/NewPassword';
import { SecurityCode } from '@/screens/auth/SecurityCode';
import { SignUp } from '@/screens/auth/SignUp';
import { Categories } from '@/screens/categories/Categories';
import { CategoryDetail } from '@/screens/categories/CategoryDetail';
import { GoalDeposit } from '@/screens/categories/GoalDeposit';
import { GoalDetail } from '@/screens/categories/GoalDetail';
import { Savings } from '@/screens/categories/Savings';
import { AccountBalance } from '@/screens/home/AccountBalance';
import { Home } from '@/screens/home/Home';
import { Notifications } from '@/screens/home/Notifications';
import { QuickAnalysis } from '@/screens/home/QuickAnalysis';
import { Onboarding } from '@/screens/launch/Onboarding';
import { SuccessScreen } from '@/screens/launch/SuccessScreen';
import { Welcome } from '@/screens/launch/Welcome';
import { ChangePassword } from '@/screens/profile/ChangePassword';
import { ChangePin } from '@/screens/profile/ChangePin';
import { DeleteAccount } from '@/screens/profile/DeleteAccount';
import { EditProfile } from '@/screens/profile/EditProfile';
import { AddFingerprint, FingerprintDetail, Fingerprints } from '@/screens/profile/Fingerprints';
import { Help } from '@/screens/profile/Help';
import { NotificationSettings } from '@/screens/profile/NotificationSettings';
import { Profile } from '@/screens/profile/Profile';
import { Security } from '@/screens/profile/Security';
import { SettingsScreen } from '@/screens/profile/SettingsScreen';
import { SupportChat } from '@/screens/profile/SupportChat';
import { Terms } from '@/screens/profile/Terms';
import { AddTransaction } from '@/screens/transactions/AddTransaction';
import { TransactionDetails } from '@/screens/transactions/TransactionDetails';
import { Transactions } from '@/screens/transactions/Transactions';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Вся навигация приложения.
 * Пока пользователь не вошёл — доступны только экраны входа,
 * после входа — экраны приложения. Переключение происходит само.
 */
export function RootNavigator() {
  const { user, onboardingDone } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      {user ? (
        <Stack.Group>
          {/* 4–8 */}
          <Stack.Screen name="Home" component={Home} options={{ animation: 'fade' }} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Balance" component={AccountBalance} />
          <Stack.Screen name="QuickAnalysis" component={QuickAnalysis} />
          {/* 9.2 Анализ */}
          <Stack.Screen name="Analysis" component={Analysis} options={{ animation: 'fade' }} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          {/* 9.3 Транзакции */}
          <Stack.Screen name="Transactions" component={Transactions} options={{ animation: 'fade' }} />
          <Stack.Screen name="AddTransaction" component={AddTransaction} />
          <Stack.Screen name="TransactionDetails" component={TransactionDetails} />
          {/* 9.4 Категории */}
          <Stack.Screen name="Categories" component={Categories} options={{ animation: 'fade' }} />
          <Stack.Screen name="CategoryDetail" component={CategoryDetail} />
          <Stack.Screen name="Savings" component={Savings} />
          <Stack.Screen name="GoalDetail" component={GoalDetail} />
          <Stack.Screen name="GoalDeposit" component={GoalDeposit} />
          {/* 9.5 Профиль */}
          <Stack.Screen name="Profile" component={Profile} options={{ animation: 'fade' }} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="Security" component={Security} />
          <Stack.Screen name="ChangePin" component={ChangePin} />
          <Stack.Screen name="Fingerprints" component={Fingerprints} />
          <Stack.Screen name="AddFingerprint" component={AddFingerprint} />
          <Stack.Screen name="FingerprintDetail" component={FingerprintDetail} />
          <Stack.Screen name="Terms" component={Terms} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="DeleteAccount" component={DeleteAccount} />
          <Stack.Screen name="Help" component={Help} />
          <Stack.Screen name="SupportChat" component={SupportChat} />
        </Stack.Group>
      ) : (
        <Stack.Group>
          {/* 1–3 */}
          {!onboardingDone && <Stack.Screen name="Onboarding" component={Onboarding} />}
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="FingerprintLogin" component={FingerprintLogin} />
          <Stack.Screen name="Forgot" component={ForgotPassword} />
          <Stack.Screen name="SecurityCode" component={SecurityCode} />
          <Stack.Screen name="NewPassword" component={NewPassword} />
        </Stack.Group>
      )}
      {/* Экран «Успешно» нужен и до, и после входа */}
      <Stack.Screen name="Success" component={SuccessScreen} options={{ animation: 'fade', gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
