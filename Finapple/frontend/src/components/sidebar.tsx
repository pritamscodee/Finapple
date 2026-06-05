import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Vault,
  LayoutDashboard,
  Settings,
  LogOut,
  Wallet,
  BarChart2,
  PiggyBank,
  Target,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/Store/authStore";
import { toast } from "sonner";

const items = [
  { title: "Dashboard", url: "/layout", icon: LayoutDashboard },
  { title: "Wallet", url: "/layout/wallet", icon: Wallet },
  { title: "Analytics", url: "/layout/analytics", icon: BarChart2 },
  { title: "Budget", url: "/layout/budget", icon: PiggyBank },
  { title: "Savings", url: "/layout/savings", icon: Target },
  { title: "Vault", url: "/layout/vault", icon: Vault },
  { title: "Settings", url: "/layout/settings", icon: Settings },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    toast("Logged out successfully");
    navigate("/");
  };

  return (
    <Sidebar
      style={{ borderRight: "1px solid #dedee5", backgroundColor: "#ffffff" }}
    >
      <SidebarHeader
        style={{ padding: "20px 16px 16px", borderBottom: "1px solid #dedee5" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              backgroundColor: "#7132f5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "18px",
                fontFamily: "IBM Plex Sans, sans-serif",
              }}
            >
              F
            </span>
          </div>
          <div>
            <p
              style={{
                margin: 0,
                fontSize: "15px",
                fontWeight: 700,
                color: "#101114",
                fontFamily: "IBM Plex Sans, Helvetica, Arial, sans-serif",
                letterSpacing: "-0.3px",
              }}
            >
              Finapple
            </p>
            <p
              style={{
                margin: 0,
                fontSize: "11px",
                color: "#9497a9",
                fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
              }}
            >
              Secure Platform
            </p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent style={{ padding: "12px 8px" }}>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <SidebarMenuItem key={item.title} style={{ marginBottom: "2px" }}>
                <SidebarMenuButton asChild>
                  <Link
                    to={item.url}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 12px",
                      borderRadius: "10px",
                      textDecoration: "none",
                      backgroundColor: isActive
                        ? "rgba(133,91,251,0.12)"
                        : "transparent",
                      color: isActive ? "#7132f5" : "#686b82",
                      fontWeight: isActive ? 600 : 400,
                      fontSize: "14px",
                      fontFamily:
                        "Helvetica Neue, Helvetica, Arial, sans-serif",
                      transition: "background 0.15s, color 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor =
                          "rgba(148,151,169,0.08)";
                        e.currentTarget.style.color = "#101114";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) {
                        e.currentTarget.style.backgroundColor = "transparent";
                        e.currentTarget.style.color = "#686b82";
                      }
                    }}
                  >
                    <item.icon size={18} />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter
        style={{ padding: "12px 8px", borderTop: "1px solid #dedee5" }}
      >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "10px 12px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: "transparent",
                  color: "#686b82",
                  fontSize: "14px",
                  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
                  cursor: "pointer",
                  width: "100%",
                  transition: "background 0.15s, color 0.15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    "rgba(239,68,68,0.08)";
                  e.currentTarget.style.color = "#ef4444";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "#686b82";
                }}
              >
                <LogOut size={18} />
                <span>Log out</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
