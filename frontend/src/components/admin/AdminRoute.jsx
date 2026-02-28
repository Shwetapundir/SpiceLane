import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext'; // ✅ correct path

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" />;
  if (!user.isAdmin) return <Navigate to="/" />;

  return children;
};

export default AdminRoute;