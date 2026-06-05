import { useEffect, useState } from "react";
import { useWalletStore, type Transaction } from "@/Store/walletStore";
import { toast } from "sonner";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ArrowLeftRight,
  Wallet,
  Plus,
  Minus,
  Send,
  Loader2,
  X,
} from "lucide-react";
import { EXPENSE_CATEGORIES, CATEGORY_COLOR, CATEGORY_LABEL } from "@/constants/categories";

const FONT_UI = "Helvetica Neue, Helvetica, Arial, sans-serif";
const FONT_BRAND = "IBM Plex Sans, Helvetica, Arial, sans-serif";

type ModalType = "deposit" | "withdraw" | "transfer" | null;

function txIcon(type: Transaction["type"]) {
  if (type === "deposit" || type === "transfer_in")
    return <ArrowDownLeft size={16} color="#149e61" />;
  return <ArrowUpRight size={16} color="#ef4444" />;
}

function txColor(type: Transaction["type"]) {
  return type === "deposit" || type === "transfer_in" ? "#149e61" : "#ef4444";
}

function txSign(type: Transaction["type"]) {
  return type === "deposit" || type === "transfer_in" ? "+" : "-";
}

function txLabel(type: Transaction["type"]) {
  const map: Record<Transaction["type"], string> = {
    deposit: "Deposit",
    withdrawal: "Withdrawal",
    transfer_in: "Received",
    transfer_out: "Sent",
  };
  return map[type];
}

function ActionModal({
  type,
  onClose,
}: {
  type: ModalType;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].value);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { deposit, withdraw, transfer } = useWalletStore();

  // Reset category when modal type changes
  useEffect(() => {
    setCategory(EXPENSE_CATEGORIES[0].value);
  }, [type]);

  if (!type) return null;

  const titles: Record<NonNullable<ModalType>, string> = {
    deposit: "Add Money",
    withdraw: "Withdraw",
    transfer: "Send Money",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) return toast.error("Enter a valid amount");
    setLoading(true);
    try {
      let msg = "";
      if (type === "deposit") msg = await deposit(amt, description, category);
      else if (type === "withdraw") msg = await withdraw(amt, description, category);
      else msg = await transfer(recipientEmail, amt, description);
      toast.success(msg);
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Transaction failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid #dedee5",
    fontSize: "14px",
    fontFamily: FONT_UI,
    outline: "none",
    boxSizing: "border-box",
    backgroundColor: "#ffffff",
    color: "#101114",
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(16,17,20,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
        backdropFilter: "blur(4px)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "20px",
          width: "90vw",
          maxWidth: "420px",
          padding: "28px",
          boxShadow: "rgba(0,0,0,0.2) 0px 16px 48px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontFamily: FONT_BRAND,
              fontSize: "20px",
              fontWeight: 700,
              color: "#101114",
              margin: 0,
            }}
          >
            {titles[type]}
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "rgba(148,151,169,0.08)",
              border: "none",
              borderRadius: "8px",
              padding: "6px",
              cursor: "pointer",
              display: "flex",
            }}
          >
            <X size={18} color="#686b82" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {type === "transfer" && (
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#101114", display: "block", marginBottom: "6px" }}>
                Recipient Email
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="recipient@example.com"
                required
                style={inputStyle}
              />
            </div>
          )}

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#101114", display: "block", marginBottom: "6px" }}>
              Amount (₹)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
              style={{ ...inputStyle, fontSize: "18px", fontFamily: FONT_BRAND, fontWeight: 600 }}
            />
          </div>

          {/* Category only shown for withdrawals — these match Budget Manager categories exactly */}
          {type === "withdraw" && (
            <div>
              <label style={{ fontSize: "13px", fontWeight: 600, color: "#101114", display: "block", marginBottom: "4px" }}>
                Category
              </label>
              <p style={{ fontSize: "11px", color: "#7132f5", margin: "0 0 8px" }}>
                Pick the same category as your Budget Manager limit to track spending
              </p>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={inputStyle}
              >
                {EXPENSE_CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label style={{ fontSize: "13px", fontWeight: 600, color: "#101114", display: "block", marginBottom: "6px" }}>
              Description (optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What's this for?"
              style={inputStyle}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: loading ? "rgba(113,50,245,0.4)" : "#7132f5",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: 600,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: FONT_UI,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "4px",
            }}
          >
            {loading && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
            {loading ? "Processing..." : titles[type]}
          </button>
        </form>
      </div>
    </div>
  );
}

function WalletPage() {
  const { balance, transactions, loading, txLoading, fetchBalance, fetchTransactions } = useWalletStore();
  const [modal, setModal] = useState<ModalType>(null);

  useEffect(() => {
    fetchBalance();
    fetchTransactions();
  }, []);

  const totalIn = transactions
    .filter((t) => t.type === "deposit" || t.type === "transfer_in")
    .reduce((s, t) => s + parseFloat(t.amount), 0);

  const totalOut = transactions
    .filter((t) => t.type === "withdrawal" || t.type === "transfer_out")
    .reduce((s, t) => s + parseFloat(t.amount), 0);

  return (
    <div style={{ fontFamily: FONT_UI, maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "32px" }}>
        <h1 style={{ fontFamily: FONT_BRAND, fontSize: "28px", fontWeight: 700, color: "#101114", letterSpacing: "-0.5px", margin: "0 0 6px" }}>
          Wallet
        </h1>
        <p style={{ fontSize: "14px", color: "#9497a9", margin: 0 }}>
          Manage your balance and transactions
        </p>
      </div>

      <div
        style={{
          background: "linear-gradient(135deg, #7132f5 0%, #5741d8 100%)",
          borderRadius: "20px",
          padding: "32px",
          color: "#ffffff",
          marginBottom: "24px",
          boxShadow: "rgba(113,50,245,0.3) 0px 8px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
          <Wallet size={18} style={{ opacity: 0.8 }} />
          <span style={{ fontSize: "13px", opacity: 0.8 }}>Available Balance</span>
        </div>
        <p style={{ fontFamily: FONT_BRAND, fontSize: "42px", fontWeight: 700, margin: "0 0 24px", letterSpacing: "-1px" }}>
          {loading ? "..." : `₹${parseFloat(balance ?? "0").toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
        </p>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          {[
            { label: "Add Money", icon: <Plus size={16} />, action: "deposit" as ModalType },
            { label: "Withdraw", icon: <Minus size={16} />, action: "withdraw" as ModalType },
            { label: "Send", icon: <Send size={16} />, action: "transfer" as ModalType },
          ].map((btn) => (
            <button
              key={btn.action}
              onClick={() => setModal(btn.action)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "10px 18px",
                borderRadius: "10px",
                border: "1px solid rgba(255,255,255,0.3)",
                backgroundColor: "rgba(255,255,255,0.15)",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: FONT_UI,
                backdropFilter: "blur(4px)",
                transition: "background 0.15s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.25)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"; }}
            >
              {btn.icon}
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #dedee5", padding: "20px", boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(20,158,97,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowDownLeft size={16} color="#149e61" />
            </div>
            <span style={{ fontSize: "13px", color: "#9497a9" }}>Total In</span>
          </div>
          <p style={{ fontFamily: FONT_BRAND, fontSize: "22px", fontWeight: 700, color: "#149e61", margin: 0 }}>
            +₹{totalIn.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #dedee5", padding: "20px", boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "8px", backgroundColor: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <ArrowUpRight size={16} color="#ef4444" />
            </div>
            <span style={{ fontSize: "13px", color: "#9497a9" }}>Total Out</span>
          </div>
          <p style={{ fontFamily: FONT_BRAND, fontSize: "22px", fontWeight: 700, color: "#ef4444", margin: 0 }}>
            -₹{totalOut.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2 style={{ fontFamily: FONT_BRAND, fontSize: "18px", fontWeight: 700, color: "#101114", margin: 0, letterSpacing: "-0.3px" }}>
          Transaction History
        </h2>
        <span style={{ backgroundColor: "rgba(104,107,130,0.12)", color: "#484b5e", fontSize: "12px", fontWeight: 500, padding: "3px 10px", borderRadius: "8px" }}>
          {transactions.length} transactions
        </span>
      </div>

      <div style={{ backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #dedee5", overflow: "hidden", boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px" }}>
        {txLoading ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#9497a9", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px" }}>
            <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ fontSize: "14px" }}>Loading transactions...</span>
          </div>
        ) : transactions.length === 0 ? (
          <div style={{ padding: "60px 20px", textAlign: "center" }}>
            <div style={{ width: "52px", height: "52px", borderRadius: "50%", backgroundColor: "rgba(113,50,245,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <ArrowLeftRight size={22} color="#7132f5" />
            </div>
            <p style={{ fontSize: "15px", fontWeight: 600, color: "#101114", margin: "0 0 6px" }}>No transactions yet</p>
            <p style={{ fontSize: "13px", color: "#9497a9", margin: 0 }}>Add money to get started</p>
          </div>
        ) : (
          transactions.map((tx, i) => (
            <div
              key={tx.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "14px",
                padding: "16px 20px",
                borderBottom: i < transactions.length - 1 ? "1px solid #dedee5" : "none",
              }}
            >
              <div style={{ width: "38px", height: "38px", borderRadius: "10px", backgroundColor: tx.type === "deposit" || tx.type === "transfer_in" ? "rgba(20,158,97,0.1)" : "rgba(239,68,68,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {txIcon(tx.type)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: 600, color: "#101114", margin: "0 0 2px" }}>
                  {tx.description || txLabel(tx.type)}
                </p>
                <p style={{ fontSize: "12px", color: "#9497a9", margin: 0 }}>
                  {txLabel(tx.type)}
                  {tx.category && tx.category !== "other" && (
                    <span style={{ marginLeft: "6px", backgroundColor: "rgba(113,50,245,0.08)", color: CATEGORY_COLOR[tx.category] || "#7132f5", padding: "1px 6px", borderRadius: "4px", fontSize: "11px" }}>
                      {CATEGORY_LABEL[tx.category] || tx.category}
                    </span>
                  )}
                  {" · "}{new Date(tx.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "15px", fontWeight: 700, color: txColor(tx.type), margin: "0 0 2px" }}>
                  {txSign(tx.type)}₹{parseFloat(tx.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p style={{ fontSize: "11px", color: "#9497a9", margin: 0 }}>
                  Bal: ₹{parseFloat(tx.balanceAfter).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      <ActionModal key={modal ?? "none"} type={modal} onClose={() => setModal(null)} />

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default WalletPage;
