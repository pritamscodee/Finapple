import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet, useLocation } from "react-router-dom";

const pageTitles: Record<string, string> = {
  "/layout": "Dashboard",
  "/layout/wallet": "Wallet",
  "/layout/analytics": "Analytics",
  "/layout/budget": "Budget Manager",
  "/layout/savings": "Savings Goals",
  "/layout/vault": "Vault",
  "/layout/settings": "Settings",
};

function Layout() {
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? "Finapple";

  return (
    <SidebarProvider>
      <div
        style={{
          display: "flex",
          width: "100%",
          minHeight: "100vh",
          backgroundColor: "#f8f8fb",
        }}
      >
        <AppSidebar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          <header
            style={{
              height: "56px",
              backgroundColor: "#ffffff",
              borderBottom: "1px solid #dedee5",
              display: "flex",
              alignItems: "center",
              padding: "0 24px",
              gap: "12px",
              boxShadow: "rgba(16,24,40,0.04) 0px 1px 4px",
              flexShrink: 0,
            }}
          >
            <SidebarTrigger style={{ color: "#686b82" }} />
            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#dedee5",
              }}
            />
            <span
              style={{
                fontSize: "14px",
                color: "#9497a9",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              {title}
            </span>
          </header>

          <main style={{ flex: 1, padding: "32px", overflow: "auto" }}>
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default Layout;
