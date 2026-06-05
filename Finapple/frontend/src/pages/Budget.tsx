import { useEffect, useState, useCallback } from "react";
import { useBudgetStore } from "@/Store/budgetStore";
import { toast } from "sonner";
import { Plus, Trash2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import {
  EXPENSE_CATEGORIES,
  CATEGORY_COLOR,
  CATEGORY_LABEL,
} from "@/constants/categories";

const FONT_UI = "Helvetica Neue, Helvetica, Arial, sans-serif";
const FONT_BRAND = "IBM Plex Sans, Helvetica, Arial, sans-serif";

const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

function Budget() {
  const { budgets, loading, fetchBudgets, setBudget, deleteBudget } =
    useBudgetStore();

  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    category: EXPENSE_CATEGORIES[0].value,
    limitAmount: "",
  });
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch whenever month changes
  useEffect(() => {
    fetchBudgets(selectedMonth);
  }, [selectedMonth]);

  // Re-fetch when the tab regains focus (user may have done a wallet tx)
  useEffect(() => {
    const onFocus = () => fetchBudgets(selectedMonth);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, [selectedMonth]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchBudgets(selectedMonth);
    setRefreshing(false);
  }, [selectedMonth]);

  const monthOptions = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "long", year: "numeric" });
    return { val, label };
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.limitAmount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    setSaving(true);
    const msg = await setBudget(form.category, amt, selectedMonth);
    toast.success(msg);
    setShowForm(false);
    setForm({ category: EXPENSE_CATEGORIES[0].value, limitAmount: "" });
    setSaving(false);
  };

  const totalBudgeted = budgets.reduce((s, b) => s + b.limitAmount, 0);
  const totalSpent = budgets.reduce((s, b) => s + b.spent, 0);

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #dedee5",
    fontSize: "14px",
    fontFamily: FONT_UI,
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#101114",
  };

  return (
    <div style={{ fontFamily: FONT_UI, maxWidth: "800px", margin: "0 auto" }}>
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
            Budget Manager
          </h1>
          <p style={{ fontSize: "14px", color: "#9497a9", margin: 0 }}>
            Spending is tracked automatically from your wallet withdrawals
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={inputStyle}
          >
            {monthOptions.map((m) => (
              <option key={m.val} value={m.val}>
                {m.label}
              </option>
            ))}
          </select>
          {/* Manual refresh — syncs spending from latest wallet transactions */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh spending from wallet"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "38px",
              height: "38px",
              borderRadius: "10px",
              border: "1px solid #dedee5",
              backgroundColor: "#ffffff",
              cursor: refreshing ? "not-allowed" : "pointer",
              color: "#686b82",
              flexShrink: 0,
            }}
          >
            <RefreshCw
              size={15}
              style={{
                animation: refreshing ? "spin 0.8s linear infinite" : "none",
              }}
            />
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "10px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: "#7132f5",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: FONT_UI,
            }}
          >
            <Plus size={16} />
            Add Budget
          </button>
        </div>
      </div>

      {/* How it works hint */}
      <div
        style={{
          backgroundColor: "rgba(113,50,245,0.05)",
          border: "1px solid rgba(113,50,245,0.15)",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "13px",
          color: "#686b82",
          lineHeight: "1.5",
        }}
      >
        💡 <strong style={{ color: "#7132f5" }}>How it works:</strong> Set a
        monthly limit per category. When you make a{" "}
        <strong>withdrawal</strong> in the Wallet with a matching category, the
        spending here updates automatically.
      </div>

      {/* Summary */}
      {budgets.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[
            { label: "Total Budgeted", value: fmt(totalBudgeted), color: "#7132f5" },
            { label: "Total Spent",    value: fmt(totalSpent),    color: "#ef4444" },
            {
              label: "Remaining",
              value: fmt(Math.max(0, totalBudgeted - totalSpent)),
              color: "#149e61",
            },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                backgroundColor: "#ffffff",
                borderRadius: "14px",
                border: "1px solid #dedee5",
                padding: "18px 20px",
                boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
              }}
            >
              <p style={{ fontSize: "12px", color: "#9497a9", margin: "0 0 6px" }}>
                {s.label}
              </p>
              <p
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                  color: s.color,
                  margin: 0,
                  fontFamily: FONT_BRAND,
                }}
              >
                {s.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Add Budget Form */}
      {showForm && (
        <div
          style={{
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #dedee5",
            padding: "24px",
            marginBottom: "20px",
            boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
          }}
        >
          <h3
            style={{
              fontFamily: FONT_BRAND,
              fontSize: "16px",
              fontWeight: 700,
              color: "#101114",
              margin: "0 0 4px",
            }}
          >
            Set Budget Limit
          </h3>
          <p style={{ fontSize: "13px", color: "#9497a9", margin: "0 0 16px" }}>
            Choose the same category you use when making withdrawals in Wallet.
          </p>
          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}
          >
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              style={{ ...inputStyle, flex: "1", minWidth: "160px" }}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Monthly limit (₹)"
              value={form.limitAmount}
              onChange={(e) => setForm({ ...form, limitAmount: e.target.value })}
              style={{ ...inputStyle, flex: "1", minWidth: "160px" }}
              min="1"
              step="0.01"
              required
            />
            <button
              type="submit"
              disabled={saving}
              style={{
                padding: "10px 20px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: "#7132f5",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer",
                fontFamily: FONT_UI,
              }}
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              style={{
                padding: "10px 16px",
                borderRadius: "10px",
                border: "1px solid #dedee5",
                backgroundColor: "#ffffff",
                color: "#686b82",
                fontSize: "14px",
                cursor: "pointer",
                fontFamily: FONT_UI,
              }}
            >
              Cancel
            </button>
          </form>
        </div>
      )}

      {/* Budget Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "60px", color: "#9497a9", fontSize: "14px" }}>
          Loading budgets...
        </div>
      ) : budgets.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #dedee5",
          }}
        >
          <p style={{ color: "#9497a9", fontSize: "14px", margin: "0 0 8px" }}>
            No budgets set for this month.
          </p>
          <p style={{ color: "#9497a9", fontSize: "13px", margin: 0 }}>
            Click <strong>"Add Budget"</strong> → pick a category → set a limit.
            Then use the same category when withdrawing in Wallet.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {budgets.map((b) => {
            const color = CATEGORY_COLOR[b.category] || "#9497a9";
            const displayLabel = CATEGORY_LABEL[b.category] || b.category;
            const isOver = b.percentUsed >= 100;
            const isWarning = b.percentUsed >= 80 && !isOver;
            return (
              <div
                key={b.id}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "14px",
                  border: `1px solid ${isOver ? "rgba(239,68,68,0.3)" : "#dedee5"}`,
                  padding: "20px 24px",
                  boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "12px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: color,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{ fontSize: "15px", fontWeight: 600, color: "#101114" }}
                    >
                      {displayLabel}
                    </span>
                    {isOver && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "#ef4444",
                          fontWeight: 600,
                          backgroundColor: "rgba(239,68,68,0.08)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        <AlertTriangle size={11} /> Over budget
                      </span>
                    )}
                    {isWarning && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "#f59e0b",
                          fontWeight: 600,
                          backgroundColor: "rgba(245,158,11,0.08)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        <AlertTriangle size={11} /> Near limit
                      </span>
                    )}
                    {!isOver && !isWarning && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "11px",
                          color: "#149e61",
                          fontWeight: 600,
                          backgroundColor: "rgba(20,158,97,0.08)",
                          padding: "2px 8px",
                          borderRadius: "6px",
                        }}
                      >
                        <CheckCircle size={11} /> On track
                      </span>
                    )}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ fontSize: "13px", color: "#9497a9" }}>
                      {fmt(b.spent)} / {fmt(b.limitAmount)}
                    </span>
                    <button
                      onClick={async () => {
                        await deleteBudget(b.id);
                        toast.success("Budget removed");
                      }}
                      style={{
                        padding: "6px",
                        borderRadius: "8px",
                        border: "none",
                        backgroundColor: "rgba(239,68,68,0.08)",
                        cursor: "pointer",
                        display: "flex",
                        color: "#ef4444",
                      }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div
                  style={{
                    height: "8px",
                    borderRadius: "4px",
                    backgroundColor: "#f0f0f5",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${Math.min(100, b.percentUsed)}%`,
                      backgroundColor: isOver ? "#ef4444" : isWarning ? "#f59e0b" : color,
                      borderRadius: "4px",
                      transition: "width 0.5s ease",
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "6px",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "#9497a9" }}>
                    {b.percentUsed}% used
                  </span>
                  <span style={{ fontSize: "11px", color: "#9497a9" }}>
                    {fmt(b.remaining)} remaining
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default Budget;
