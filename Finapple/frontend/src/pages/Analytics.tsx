import { useEffect, useState } from "react";
import { useAnalyticsStore } from "@/Store/analyticsStore";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  PiggyBank,
  BarChart2,
} from "lucide-react";
import { CATEGORY_COLOR, CATEGORY_LABEL } from "@/constants/categories";

const FONT_UI = "Helvetica Neue, Helvetica, Arial, sans-serif";
const FONT_BRAND = "IBM Plex Sans, Helvetica, Arial, sans-serif";

const PIE_COLORS = [
  "#7132f5",
  "#f59e0b",
  "#3b82f6",
  "#ec4899",
  "#10b981",
  "#f97316",
  "#6366f1",
  "#14b8a6",
];

function StatCard({
  label,
  value,
  icon,
  color,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  sub?: string;
}) {
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #dedee5",
        padding: "20px 24px",
        boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
      }}
    >
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          backgroundColor: color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontSize: "12px",
            color: "#9497a9",
            margin: "0 0 4px",
            fontFamily: FONT_UI,
          }}
        >
          {label}
        </p>
        <p
          style={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#101114",
            margin: 0,
            fontFamily: FONT_BRAND,
            letterSpacing: "-0.5px",
          }}
        >
          {value}
        </p>
        {sub && (
          <p style={{ fontSize: "11px", color: "#9497a9", margin: "2px 0 0" }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

const monthLabel = (m: string) => {
  const [y, mo] = m.split("-");
  return new Date(parseInt(y), parseInt(mo) - 1).toLocaleString("default", {
    month: "short",
    year: "2-digit",
  });
};

function Analytics() {
  const { monthlyStats, trend, loading, fetchMonthlyStats, fetchTrend } =
    useAnalyticsStore();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

  useEffect(() => {
    fetchMonthlyStats(selectedMonth);
    fetchTrend();
  }, [selectedMonth]);

  // Build month options (last 12 months)
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return { val, label: monthLabel(val) };
  });

  const trendData = trend.map((t) => ({ ...t, month: monthLabel(t.month) }));

  return (
    <div style={{ fontFamily: FONT_UI, maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "28px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: FONT_BRAND,
              fontSize: "28px",
              fontWeight: 700,
              color: "#101114",
              letterSpacing: "-0.5px",
              margin: "0 0 4px",
            }}
          >
            Analytics
          </h1>
          <p style={{ fontSize: "14px", color: "#9497a9", margin: 0 }}>
            Track your income, expenses and spending patterns
          </p>
        </div>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: "10px",
            border: "1px solid #dedee5",
            fontSize: "14px",
            fontFamily: FONT_UI,
            backgroundColor: "#ffffff",
            color: "#101114",
            cursor: "pointer",
            outline: "none",
          }}
        >
          {monthOptions.map((m) => (
            <option key={m.val} value={m.val}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#9497a9",
            fontSize: "14px",
          }}
        >
          Loading analytics...
        </div>
      ) : monthlyStats ? (
        <>
          {/* Summary Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "16px",
              marginBottom: "28px",
            }}
          >
            <StatCard
              label="Total Income"
              value={fmt(monthlyStats.totalIncome)}
              icon={<TrendingUp size={20} color="#149e61" />}
              color="rgba(20,158,97,0.12)"
            />
            <StatCard
              label="Total Expenses"
              value={fmt(monthlyStats.totalExpense)}
              icon={<TrendingDown size={20} color="#ef4444" />}
              color="rgba(239,68,68,0.1)"
            />
            <StatCard
              label="Net Savings"
              value={fmt(monthlyStats.netSavings)}
              icon={<PiggyBank size={20} color="#7132f5" />}
              color="rgba(113,50,245,0.12)"
              sub={
                monthlyStats.totalIncome > 0
                  ? `${((monthlyStats.netSavings / monthlyStats.totalIncome) * 100).toFixed(1)}% savings rate`
                  : undefined
              }
            />
            <StatCard
              label="Transactions"
              value={String(monthlyStats.transactionCount)}
              icon={<BarChart2 size={20} color="#3b82f6" />}
              color="rgba(59,130,246,0.1)"
            />
          </div>

          {/* Daily Trend Chart */}
          {monthlyStats.dailyTrend.length > 0 && (
            <div
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                border: "1px solid #dedee5",
                padding: "24px",
                marginBottom: "24px",
                boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
              }}
            >
              <h2
                style={{
                  fontFamily: FONT_BRAND,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#101114",
                  margin: "0 0 20px",
                }}
              >
                Daily Cash Flow
              </h2>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={monthlyStats.dailyTrend}>
                  <defs>
                    <linearGradient
                      id="incomeGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#149e61"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#149e61"
                        stopOpacity={0}
                      />
                    </linearGradient>
                    <linearGradient
                      id="expenseGrad"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#ef4444"
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor="#ef4444"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11, fill: "#9497a9" }}
                    tickFormatter={(v) => v.slice(8)}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: "#9497a9" }}
                    tickFormatter={(v) => `₹${v}`}
                  />
                  <Tooltip
                    formatter={(v: number) => fmt(v)}
                    contentStyle={{
                      borderRadius: "10px",
                      border: "1px solid #dedee5",
                      fontSize: "13px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="income"
                    stroke="#149e61"
                    fill="url(#incomeGrad)"
                    strokeWidth={2}
                    name="Income"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    stroke="#ef4444"
                    fill="url(#expenseGrad)"
                    strokeWidth={2}
                    name="Expense"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Category Breakdown + Pie */}
          {monthlyStats.categoryBreakdown.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              {/* Pie Chart */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #dedee5",
                  padding: "24px",
                  boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
                }}
              >
                <h2
                  style={{
                    fontFamily: FONT_BRAND,
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#101114",
                    margin: "0 0 20px",
                  }}
                >
                  Spending by Category
                </h2>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={monthlyStats.categoryBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={90}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {monthlyStats.categoryBreakdown.map((entry, i) => (
                        <Cell
                          key={entry.name}
                          fill={
                            CATEGORY_COLOR[entry.name] ||
                            PIE_COLORS[i % PIE_COLORS.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: number) => fmt(v)}
                      contentStyle={{
                        borderRadius: "10px",
                        border: "1px solid #dedee5",
                        fontSize: "13px",
                      }}
                    />
                    <Legend
                      formatter={(v) =>
                        v.charAt(0).toUpperCase() + v.slice(1)
                      }
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category List */}
              <div
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "16px",
                  border: "1px solid #dedee5",
                  padding: "24px",
                  boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
                  overflow: "auto",
                }}
              >
                <h2
                  style={{
                    fontFamily: FONT_BRAND,
                    fontSize: "16px",
                    fontWeight: 700,
                    color: "#101114",
                    margin: "0 0 16px",
                  }}
                >
                  Category Breakdown
                </h2>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  {monthlyStats.categoryBreakdown
                    .sort((a, b) => b.value - a.value)
                    .map((cat, i) => {
                      const total = monthlyStats.totalExpense || 1;
                      const pct = ((cat.value / total) * 100).toFixed(1);
                      const color =
                        CATEGORY_COLOR[cat.name] ||
                        PIE_COLORS[i % PIE_COLORS.length];
                      return (
                        <div key={cat.name}>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              marginBottom: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontSize: "13px",
                                fontWeight: 500,
                                color: "#101114",
                              }}
                            >
                              {CATEGORY_LABEL[cat.name] || cat.name}
                            </span>
                            <span
                              style={{ fontSize: "13px", color: "#9497a9" }}
                            >
                              {fmt(cat.value)} ({pct}%)
                            </span>
                          </div>
                          <div
                            style={{
                              height: "6px",
                              borderRadius: "3px",
                              backgroundColor: "#f0f0f5",
                              overflow: "hidden",
                            }}
                          >
                            <div
                              style={{
                                height: "100%",
                                width: `${pct}%`,
                                backgroundColor: color,
                                borderRadius: "3px",
                                transition: "width 0.5s ease",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#9497a9",
            fontSize: "14px",
          }}
        >
          No data for this month yet.
        </div>
      )}

      {/* 6-Month Trend */}
      {trendData.length > 0 && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #dedee5",
            padding: "24px",
            boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
          }}
        >
          <h2
            style={{
              fontFamily: FONT_BRAND,
              fontSize: "16px",
              fontWeight: 700,
              color: "#101114",
              margin: "0 0 20px",
            }}
          >
            6-Month Overview
          </h2>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trendData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f5" />
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: "#9497a9" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9497a9" }}
                tickFormatter={(v) => `₹${v}`}
              />
              <Tooltip
                formatter={(v: number) => fmt(v)}
                contentStyle={{
                  borderRadius: "10px",
                  border: "1px solid #dedee5",
                  fontSize: "13px",
                }}
              />
              <Legend />
              <Bar
                dataKey="income"
                fill="#149e61"
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar
                dataKey="expense"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                name="Expense"
              />
              <Bar
                dataKey="savings"
                fill="#7132f5"
                radius={[4, 4, 0, 0]}
                name="Savings"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default Analytics;
