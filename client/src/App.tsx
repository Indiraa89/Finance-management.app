import type { ReactNode } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router';
import { FullScreen } from './components/Screen';
import { Spinner } from './components/ui';
import { useAuth } from './context/AuthContext';
import { AccountBalance } from './screens/home/AccountBalance';
import { Analysis } from './screens/analysis/Analysis';
import { CalendarScreen } from './screens/analysis/CalendarScreen';
import { Search } from './screens/analysis/Search';
import { FingerprintLogin } from './screens/auth/FingerprintLogin';
import { ForgotPassword } from './screens/auth/ForgotPassword';
import { Login } from './screens/auth/Login';
import { NewPassword } from './screens/auth/NewPassword';
import { SecurityCode } from './screens/auth/SecurityCode';
import { SignUp } from './screens/auth/SignUp';
import { Categories } from './screens/categories/Categories';
import { CategoryDetail } from './screens/categories/CategoryDetail';
import { GoalDeposit } from './screens/categories/GoalDeposit';
import { GoalDetail } from './screens/categories/GoalDetail';
import { Savings } from './screens/categories/Savings';
import { Home } from './screens/home/Home';
import { Notifications } from './screens/home/Notifications';
import { QuickAnalysis } from './screens/home/QuickAnalysis';
import { Onboarding } from './screens/launch/Onboarding';
import { Splash } from './screens/launch/Splash';
import { SuccessScreen } from './screens/launch/SuccessScreen';
import { Welcome } from './screens/launch/Welcome';
import { AddFingerprint, FingerprintDetail, Fingerprints } from './screens/profile/Fingerprints';
import { ChangePassword } from './screens/profile/ChangePassword';
import { ChangePin } from './screens/profile/ChangePin';
import { DeleteAccount } from './screens/profile/DeleteAccount';
import { EditProfile } from './screens/profile/EditProfile';
import { Help } from './screens/profile/Help';
import { NotificationSettings } from './screens/profile/NotificationSettings';
import { Profile } from './screens/profile/Profile';
import { Security } from './screens/profile/Security';
import { SettingsScreen } from './screens/profile/SettingsScreen';
import { SupportChat } from './screens/profile/SupportChat';
import { Terms } from './screens/profile/Terms';
import { AddTransaction } from './screens/transactions/AddTransaction';
import { TransactionDetails } from './screens/transactions/TransactionDetails';
import { Transactions } from './screens/transactions/Transactions';

/** Пускает только вошедших пользователей */
function Private({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading)
    return (
      <FullScreen>
        <Spinner />
      </FullScreen>
    );
  if (!user) return <Navigate to="/welcome" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

/** Экраны входа: если уже вошли — сразу на Главную */
function PublicOnly({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/home" replace />;
  return <>{children}</>;
}

const p = (el: ReactNode) => <Private>{el}</Private>;
const pub = (el: ReactNode) => <PublicOnly>{el}</PublicOnly>;

export function App() {
  return (
    <Routes>
      {/* 1–3. Запуск, онбординг, вход */}
      <Route path="/" element={<Splash />} />
      <Route path="/onboarding" element={pub(<Onboarding />)} />
      <Route path="/welcome" element={pub(<Welcome />)} />
      <Route path="/login" element={pub(<Login />)} />
      <Route path="/signup" element={pub(<SignUp />)} />
      <Route path="/forgot" element={<ForgotPassword />} />
      <Route path="/forgot/code" element={<SecurityCode />} />
      <Route path="/forgot/new-password" element={<NewPassword />} />
      <Route path="/fingerprint" element={pub(<FingerprintLogin />)} />
      <Route path="/success" element={<SuccessScreen />} />

      {/* 4–8. Главная и связанные экраны */}
      <Route path="/home" element={p(<Home />)} />
      <Route path="/notifications" element={p(<Notifications />)} />
      <Route path="/balance" element={p(<AccountBalance />)} />
      <Route path="/quick-analysis" element={p(<QuickAnalysis />)} />

      {/* 9.2 Анализ */}
      <Route path="/analysis" element={p(<Analysis />)} />
      <Route path="/analysis/search" element={p(<Search />)} />
      <Route path="/analysis/calendar" element={p(<CalendarScreen />)} />

      {/* 9.3 Транзакции */}
      <Route path="/transactions" element={p(<Transactions />)} />
      <Route path="/transactions/new" element={p(<AddTransaction />)} />
      <Route path="/transactions/:id" element={p(<TransactionDetails />)} />

      {/* 9.4 Категории и накопления */}
      <Route path="/categories" element={p(<Categories />)} />
      <Route path="/categories/:id" element={p(<CategoryDetail />)} />
      <Route path="/savings" element={p(<Savings />)} />
      <Route path="/savings/:id" element={p(<GoalDetail />)} />
      <Route path="/savings/:id/deposit" element={p(<GoalDeposit />)} />

      {/* 9.5 Профиль */}
      <Route path="/profile" element={p(<Profile />)} />
      <Route path="/profile/edit" element={p(<EditProfile />)} />
      <Route path="/profile/security" element={p(<Security />)} />
      <Route path="/profile/security/pin" element={p(<ChangePin />)} />
      <Route path="/profile/security/fingerprints" element={p(<Fingerprints />)} />
      <Route path="/profile/security/fingerprints/add" element={p(<AddFingerprint />)} />
      <Route path="/profile/security/fingerprints/:id" element={p(<FingerprintDetail />)} />
      <Route path="/profile/security/terms" element={p(<Terms />)} />
      <Route path="/profile/settings" element={p(<SettingsScreen />)} />
      <Route path="/profile/settings/notifications" element={p(<NotificationSettings />)} />
      <Route path="/profile/settings/password" element={p(<ChangePassword />)} />
      <Route path="/profile/settings/delete" element={p(<DeleteAccount />)} />
      <Route path="/profile/help" element={p(<Help />)} />
      <Route path="/profile/help/chat" element={p(<SupportChat />)} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
