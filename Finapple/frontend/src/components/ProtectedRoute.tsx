import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/Store/authStore";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, token, restoreSession } = useAuthStore();
  const [checking, setChecking] = useState(!isAuthenticated && !!token);

  useEffect(() => {
    if (token && !isAuthenticated) {
      restoreSession().finally(() => setChecking(false));
    }
  }, []);

  if (checking) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f8f8fb",
          fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
          fontSize: "14px",
          color: "#9497a9",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!token && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
