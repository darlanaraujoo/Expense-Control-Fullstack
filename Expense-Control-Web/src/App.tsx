import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { PrivateRoute } from './components/PrivateRoute';
import { AppLayout } from './layouts/AppLayout';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { Users } from './pages/Users';
import { Categories } from './pages/Categories';
import { Transactions } from './pages/Transactions';
import { Reports } from './pages/Reports';

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/transactions" replace />;
  }
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/transactions" replace />} />
          <Route path="users" element={<Users />} />
          <Route path="categories" element={<Categories />} />
          <Route path="transactions" element={<Transactions />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
