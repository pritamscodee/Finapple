import { useAuthStore } from "@/Store/authStore";
import { usefileStore } from "@/Store/FilesDataStore";
import { useWalletStore } from "@/Store/walletStore";
import { useSavingsStore } from "@/Store/savingsStore";
import { useAnalyticsStore } from "@/Store/analyticsStore";
import { useEffect } from "react";
import {
  FileText,
  ImageIcon,
  FileIcon,
  Shield,
  Upload,
  Brain,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart2,
  PiggyBank,
  Target,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Link } from "react-router-dom";

const FONT_UI = "Helvetica Neue, Helvetica, Arial, sans-serif";
const FONT_BRAND = "IBM Plex Sans, Helvetica, Arial, sans-serif";

function StatCard({
  label,
  value,
  icon,
  bg,
  prefix,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  bg: string;
  prefix?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #dedee5",
        padding: "24px",
        boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "48px",
          height: "48px",
          borderRadius: "12px",
          backgroundColor: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p style={{ fontSize: "13px", color: "#9497a9", margin: "0 0 4px", fontFamily: FONT_UI }}>
          {label}
        </p>
        <p style={{ fontSize: "22px", fontWeight: 700, color: "#101114", margin: 0, fontFamily: FONT_BRAND, letterSpacing: "-0.5px" }}>
          {prefix}{prefix ? value.toLocaleString("en-IN", { minimumFractionDigits: 2 }) : value}
        </p>
      </div>
    </div>
  );
}

function QuickAction({
  to,
  icon,
  title,
  desc,
  primary,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  primary?: boolean;
}) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <div
        style={{
          backgroundColor: primary ? "#7132f5" : "#ffffff",
          borderRadius: "16px",
          border: primary ? "none" : "1px solid #dedee5",
          padding: "28px",
          cursor: "pointer",
          boxShadow: primary
            ? "rgba(113,50,245,0.25) 0px 8px 24px"
            : "rgba(0,0,0,0.03) 0px 4px 24px",
          transition: "transform 0.15s, box-shadow 0.15s",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
        }}
      >
        <div style={{ marginBottom: "12px" }}>{icon}</div>
        <p
          style={{
            fontSize: "16px",
            fontWeight: 700,
            margin: "0 0 6px",
            color: primary ? "#ffffff" : "#101114",
            fontFamily: FONT_BRAND,
          }}
        >
          {title}
        </p>
        <p
          style={{
            fontSize: "13px",
            margin: 0,
            color: primary ? "rgba(255,255,255,0.75)" : "#9497a9",
          }}
        >
          {desc}
        </p>
      </div>
    </Link>
  );
}

function Dashboard() {
  const { user } = useAuthStore();
  const { files, GetFiles } = usefileStore();
  const { balance, transactions, fetchBalance, fetchTransactions } = useWalletStore();
  const { goals, fetchGoals } = useSavingsStore();
  const { monthlyStats, fetchMonthlyStats } = useAnalyticsStore();

  useEffect(() => {
    GetFiles();
    fetchBalance();
    fetchTransactions();
    fetchGoals();
    const now = new Date();
    const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    fetchMonthlyStats(month);
  }, []);

  const displayName =
    user?.name || user?.fullName || user?.email?.split("@")[0] || "User";

  const activeGoals = goals.filter((g) => !g.isCompleted);

  return (
    <div style={{ fontFamily: FONT_UI, maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontFamily: FONT_BRAND,
            fontSize: "28px",
            fontWeight: 700,
            color: "#101114",
            letterSpacing: "-0.5px",
            margin: "0 0 6px",
          }}
        >
          Welcome back, {displayName} 👋
        </h1>
        <p style={{ fontSize: "14px", color: "#9497a9", margin: 0 }}>
          Here's an overview of your financial dashboard
        </p>
      </div>

      {/* Stat Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <StatCard
          label="Wallet Balance"
          value={balance !== null ? parseFloat(balance) : 0}
          icon={<Wallet size={22} color="#7132f5" />}
          bg="rgba(113,50,245,0.12)"
          prefix="₹"
        />
        <StatCard
          label="Monthly Income"
          value={monthlyStats?.totalIncome ?? 0}
          icon={<TrendingUp size={22} color="#149e61" />}
          bg="rgba(20,158,97,0.12)"
          prefix="₹"
        />
        <StatCard
          label="Monthly Expenses"
          value={monthlyStats?.totalExpense ?? 0}
          icon={<TrendingDown size={22} color="#ef4444" />}
          bg="rgba(239,68,68,0.08)"
          prefix="₹"
        />
        <StatCard
          label="Total Files"
          value={files.length}
          icon={<Shield size={22} color="#3b82f6" />}
          bg="rgba(59,130,246,0.1)"
        />
      </div>

      {/* Quick Actions */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <QuickAction
          to="/layout/vault"
          icon={<Upload size={28} color="#ffffff" />}
          title="Upload a File"
          desc="Securely store documents and images"
          primary
        />
        <QuickAction
          to="/layout/wallet"
          icon={<Wallet size={28} color="#7132f5" />}
          title="Wallet"
          desc="Deposit, withdraw or send money"
        />
        <QuickAction
          to="/layout/analytics"
          icon={<BarChart2 size={28} color="#7132f5" />}
          title="Analytics"
          desc="View spending trends and reports"
        />
        <QuickAction
          to="/layout/budget"
          icon={<PiggyBank size={28} color="#7132f5" />}
          title="Budget Manager"
          desc="Set and track monthly spending limits"
        />
        <QuickAction
          to="/layout/savings"
          icon={<Target size={28} color="#7132f5" />}
          title="Savings Goals"
          desc="Track progress toward financial goals"
        />
        <QuickAction
          to="/layout/vault"
          icon={<Brain size={28} color="#7132f5" />}
          title="AI Analysis"
          desc="Extract insights from documents with AI"
        />
      </div>

      {/* Savings Goals Summary */}
      {activeGoals.length > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontFamily: FONT_BRAND, fontSize: "18px", fontWeight: 700, color: "#101114", margin: 0, letterSpacing: "-0.3px" }}>
              Savings Goals
            </h2>
            <Link to="/layout/savings" style={{ fontSize: "13px", color: "#7132f5", fontWeight: 500, textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "12px" }}>
            {activeGoals.slice(0, 3).map((g) => (
              <div key={g.id} style={{ backgroundColor: "#ffffff", borderRadius: "14px", border: "1px solid #dedee5", padding: "18px 20px", boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, color: "#101114" }}>{g.name}</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "#7132f5" }}>{g.percentComplete}%</span>
                </div>
                <div style={{ height: "6px", borderRadius: "3px", backgroundColor: "#f0f0f5", overflow: "hidden", marginBottom: "6px" }}>
                  <div style={{ height: "100%", width: `${g.percentComplete}%`, background: "linear-gradient(90deg, #7132f5, #a855f7)", borderRadius: "3px" }} />
                </div>
                <span style={{ fontSize: "11px", color: "#9497a9" }}>
                  ₹{g.savedAmount.toLocaleString("en-IN")} / ₹{g.targetAmount.toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && (
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "16px",
            }}
          >
            <h2
              style={{
                fontFamily: FONT_BRAND,
                fontSize: "18px",
                fontWeight: 700,
                color: "#101114",
                margin: 0,
                letterSpacing: "-0.3px",
              }}
            >
              Recent Files
            </h2>
            <Link
              to="/layout/vault"
              style={{
                fontSize: "13px",
                color: "#7132f5",
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              View all →
            </Link>
          </div>
          <div
            style={{
              backgroundColor: "#ffffff",
              borderRadius: "16px",
              border: "1px solid #dedee5",
              overflow: "hidden",
              boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
            }}
          >
            {files.slice(0, 5).map((f, i) => (
              <div
                key={f.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "14px 20px",
                  borderBottom:
                    i < Math.min(files.length, 5) - 1
                      ? "1px solid #dedee5"
                      : "none",
                }}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "8px",
                    backgroundColor: "rgba(113,50,245,0.12)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {f.resource_type === "raw" ? (
                    <FileText size={16} color="#7132f5" />
                  ) : f.resource_type === "image" ? (
                    <ImageIcon size={16} color="#7132f5" />
                  ) : (
                    <FileIcon size={16} color="#7132f5" />
                  )}
                </div>
                <span
                  style={{
                    fontSize: "13px",
                    color: "#101114",
                    fontWeight: 500,
                    flex: 1,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.publicId ?? "Untitled"}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#9497a9",
                    backgroundColor: "rgba(148,151,169,0.1)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    textTransform: "uppercase",
                    flexShrink: 0,
                  }}
                >
                  {f.resource_type === "raw"
                    ? "PDF"
                    : (f.resource_type ?? "file")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      {transactions.length > 0 && (
        <div style={{ marginTop: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
            <h2 style={{ fontFamily: FONT_BRAND, fontSize: "18px", fontWeight: 700, color: "#101114", margin: 0, letterSpacing: "-0.3px" }}>
              Recent Transactions
            </h2>
            <Link to="/layout/wallet" style={{ fontSize: "13px", color: "#7132f5", fontWeight: 500, textDecoration: "none" }}>
              View all →
            </Link>
          </div>
          <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #dedee5", overflow: "hidden", boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}>
            {transactions.slice(0, 4).map((tx, i) => (
              <div key={tx.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "14px 20px", borderBottom: i < Math.min(transactions.length, 4) - 1 ? "1px solid #dedee5" : "none" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", backgroundColor: tx.type === "deposit" || tx.type === "transfer_in" ? "rgba(20,158,97,0.1)" : "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  {tx.type === "deposit" || tx.type === "transfer_in"
                    ? <ArrowDownLeft size={16} color="#149e61" />
                    : <ArrowUpRight size={16} color="#ef4444" />}
                </div>
                <span style={{ fontSize: "13px", color: "#101114", fontWeight: 500, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {tx.description || tx.type}
                </span>
                <span style={{ fontSize: "13px", fontWeight: 700, color: tx.type === "deposit" || tx.type === "transfer_in" ? "#149e61" : "#ef4444", flexShrink: 0 }}>
                  {tx.type === "deposit" || tx.type === "transfer_in" ? "+" : "-"}₹{parseFloat(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
