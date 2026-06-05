import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import Login from "./components/Login";
import LandingPage from "./pages/LandingPage";
import Signup from "./components/Signup";
import Layout from "./pages/Layout";
import Vault from "./pages/Vault";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
import WalletPage from "./pages/Wallet";
import Analytics from "./pages/Analytics";
import Budget from "./pages/Budget";
import Savings from "./pages/Savings";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/signup", element: <Signup /> },
  {
    path: "/layout",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: "wallet", element: <WalletPage /> },
      { path: "analytics", element: <Analytics /> },
      { path: "budget", element: <Budget /> },
      { path: "savings", element: <Savings /> },
      { path: "vault", element: <Vault /> },
      { path: "settings", element: <Settings /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <Toaster position="top-center" richColors />
  </StrictMode>,
);
