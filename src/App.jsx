import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TransactionProvider } from './context/TransactionContext';
// import ProtectedRoute from './components/ProtectedRoute'; // Better to extract logic
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import Dashboard from './pages/Dashboard/Dashboard';
import TransactionList from './pages/Transactions/TransactionList';
import Navbar from './components/Navbar';
import AuthContext from './context/AuthContext';
import { useContext } from 'react';

// Wrapper for protected routes to include Navbar
const MainLayout = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <>
      <Navbar />
      <div className="container" style={{ paddingBottom: '2rem' }}>
        {children}
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/"
              element={
                <MainLayout>
                  <Dashboard />
                </MainLayout>
              }
            />

            <Route
              path="/transactions"
              element={
                <MainLayout>
                  <TransactionList />
                </MainLayout>
              }
            />
          </Routes>
        </Router>
      </TransactionProvider>
    </AuthProvider>
  );
}

export default App;
