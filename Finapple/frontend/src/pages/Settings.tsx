import { useState } from "react";
import { useAuthStore } from "@/Store/authStore";
import { useNavigate } from "react-router-dom";
import { LogOut, User, Mail, Shield, Calendar, Lock, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/api/api";

const FONT_UI = "Helvetica Neue, Helvetica, Arial, sans-serif";
const FONT_BRAND = "IBM Plex Sans, Helvetica, Arial, sans-serif";

function Settings() {
  const { user, logout, restoreSession } = useAuthStore();
  const navigate = useNavigate();

  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [savingName, setSavingName] = useState(false);

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [savingPassword, setSavingPassword] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleSaveName = async () => {
    if (!newName.trim()) return;
    setSavingName(true);
    try {
      await api.post("/auth/profile", { fullName: newName.trim() });
      await restoreSession();
      toast.success("Name updated");
      setEditingName(false);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      toast.error("New passwords do not match");
      return;
    }
    setSavingPassword(true);
    try {
      await api.post("/auth/change-password", {
        currentPassword: passwords.current,
        newPassword: passwords.newPass,
      });
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setPasswords({ current: "", newPass: "", confirm: "" });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to change password");
    } finally {
      setSavingPassword(false);
    }
  };

  const displayName = user?.name || user?.fullName || "—";
  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #dedee5",
    fontSize: "14px",
    fontFamily: FONT_UI,
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ fontFamily: FONT_UI, maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: FONT_BRAND, fontSize: "28px", fontWeight: 700, color: "#101114", letterSpacing: "-0.5px", margin: "0 0 6px" }}>
          Settings
        </h1>
        <p style={{ fontSize: "14px", color: "#9497a9", margin: 0 }}>
          Manage your account and preferences
        </p>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #dedee5", overflow: "hidden", boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px", marginBottom: "16px" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #dedee5", backgroundColor: "#fafafa" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9497a9", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Account</p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderBottom: "1px solid #dedee5" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(113,50,245,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <User size={17} color="#7132f5" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "12px", color: "#9497a9", margin: "0 0 4px" }}>Full Name</p>
            {editingName ? (
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{ ...inputStyle, flex: 1 }}
                  autoFocus
                  onKeyDown={(e) => { if (e.key === "Enter") handleSaveName(); if (e.key === "Escape") setEditingName(false); }}
                />
                <button onClick={handleSaveName} disabled={savingName} style={{ padding: "8px", borderRadius: "8px", border: "none", backgroundColor: "rgba(20,158,97,0.1)", cursor: "pointer", display: "flex" }}>
                  <Check size={16} color="#149e61" />
                </button>
                <button onClick={() => setEditingName(false)} style={{ padding: "8px", borderRadius: "8px", border: "none", backgroundColor: "rgba(148,151,169,0.1)", cursor: "pointer", display: "flex" }}>
                  <X size={16} color="#686b82" />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <p style={{ fontSize: "14px", fontWeight: 500, color: "#101114", margin: 0 }}>{displayName}</p>
                <button onClick={() => { setNewName(displayName === "—" ? "" : displayName); setEditingName(true); }} style={{ padding: "4px", borderRadius: "6px", border: "none", backgroundColor: "transparent", cursor: "pointer", display: "flex", color: "#9497a9" }}>
                  <Edit2 size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderBottom: "1px solid #dedee5" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(113,50,245,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Mail size={17} color="#7132f5" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "12px", color: "#9497a9", margin: "0 0 2px" }}>Email</p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#101114", margin: 0 }}>{user?.email ?? "—"}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px", borderBottom: "1px solid #dedee5" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(113,50,245,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Calendar size={17} color="#7132f5" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "12px", color: "#9497a9", margin: "0 0 2px" }}>Member Since</p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#101114", margin: 0 }}>{joinedDate}</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "16px 20px" }}>
          <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "rgba(20,158,97,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Shield size={17} color="#149e61" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "12px", color: "#9497a9", margin: "0 0 2px" }}>Security</p>
            <p style={{ fontSize: "14px", fontWeight: 500, color: "#149e61", margin: 0 }}>JWT Protected · Encrypted Vault</p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #dedee5", overflow: "hidden", boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px", marginBottom: "16px" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #dedee5", backgroundColor: "#fafafa" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9497a9", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Security</p>
        </div>

        <div style={{ padding: "20px" }}>
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 16px", borderRadius: "12px", border: "1px solid #dedee5", backgroundColor: "#fafafa", color: "#101114", fontSize: "14px", fontWeight: 500, cursor: "pointer", fontFamily: FONT_UI }}
            >
              <Lock size={16} color="#7132f5" />
              Change Password
            </button>
          ) : (
            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input type="password" placeholder="Current password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} style={inputStyle} required />
              <input type="password" placeholder="New password (min 6 chars)" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} style={inputStyle} required minLength={6} />
              <input type="password" placeholder="Confirm new password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} style={inputStyle} required />
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" disabled={savingPassword} style={{ flex: 1, padding: "12px", borderRadius: "10px", border: "none", backgroundColor: "#7132f5", color: "#ffffff", fontSize: "14px", fontWeight: 600, cursor: savingPassword ? "not-allowed" : "pointer", fontFamily: FONT_UI }}>
                  {savingPassword ? "Saving..." : "Update Password"}
                </button>
                <button type="button" onClick={() => { setShowPasswordForm(false); setPasswords({ current: "", newPass: "", confirm: "" }); }} style={{ padding: "12px 16px", borderRadius: "10px", border: "1px solid #dedee5", backgroundColor: "#ffffff", color: "#686b82", fontSize: "14px", cursor: "pointer", fontFamily: FONT_UI }}>
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #dedee5", overflow: "hidden", boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}>
        <div style={{ padding: "14px 20px", borderBottom: "1px solid #dedee5", backgroundColor: "#fafafa" }}>
          <p style={{ fontSize: "11px", fontWeight: 600, color: "#9497a9", margin: 0, textTransform: "uppercase", letterSpacing: "0.5px" }}>Session</p>
        </div>
        <div style={{ padding: "20px" }}>
          <button
            onClick={handleLogout}
            style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", borderRadius: "12px", border: "1px solid rgba(239,68,68,0.25)", backgroundColor: "rgba(239,68,68,0.05)", color: "#ef4444", fontSize: "14px", fontWeight: 600, cursor: "pointer", fontFamily: FONT_UI, transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.1)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(239,68,68,0.05)"; }}
          >
            <LogOut size={16} />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
