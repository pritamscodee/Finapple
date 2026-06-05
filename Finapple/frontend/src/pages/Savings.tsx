import { useEffect, useState } from "react";
import { useSavingsStore } from "@/Store/savingsStore";
import { toast } from "sonner";
import { Plus, Trash2, Target, CheckCircle, PlusCircle } from "lucide-react";

const FONT_UI = "Helvetica Neue, Helvetica, Arial, sans-serif";
const FONT_BRAND = "IBM Plex Sans, Helvetica, Arial, sans-serif";

const fmt = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: 2 });

function Savings() {
  const { goals, loading, fetchGoals, createGoal, addToGoal, deleteGoal } =
    useSavingsStore();

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
  });
  const [saving, setSaving] = useState(false);
  const [addingTo, setAddingTo] = useState<number | null>(null);
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(form.targetAmount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid target amount");
      return;
    }
    setSaving(true);
    const msg = await createGoal(
      form.name,
      amt,
      form.deadline || undefined,
    );
    toast.success(msg);
    setShowForm(false);
    setForm({ name: "", targetAmount: "", deadline: "" });
    setSaving(false);
  };

  const handleAdd = async (id: number) => {
    const amt = parseFloat(addAmount);
    if (!amt || amt <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    const msg = await addToGoal(id, amt);
    toast.success(msg);
    setAddingTo(null);
    setAddAmount("");
  };

  const inputStyle: React.CSSProperties = {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid #dedee5",
    fontSize: "14px",
    fontFamily: FONT_UI,
    outline: "none",
    backgroundColor: "#ffffff",
    color: "#101114",
    width: "100%",
    boxSizing: "border-box",
  };

  const activeGoals = goals.filter((g) => !g.isCompleted);
  const completedGoals = goals.filter((g) => g.isCompleted);

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
            Savings Goals
          </h1>
          <p style={{ fontSize: "14px", color: "#9497a9", margin: 0 }}>
            Set targets and track your progress
          </p>
        </div>
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
          New Goal
        </button>
      </div>

      {/* Create Form */}
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
              margin: "0 0 16px",
            }}
          >
            Create Savings Goal
          </h3>
          <form
            onSubmit={handleCreate}
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <input
              type="text"
              placeholder="Goal name (e.g. Emergency Fund)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              required
              minLength={2}
            />
            <input
              type="number"
              placeholder="Target amount (₹)"
              value={form.targetAmount}
              onChange={(e) =>
                setForm({ ...form, targetAmount: e.target.value })
              }
              style={inputStyle}
              min="1"
              step="0.01"
              required
            />
            <div>
              <label
                style={{
                  fontSize: "12px",
                  color: "#9497a9",
                  display: "block",
                  marginBottom: "4px",
                }}
              >
                Deadline (optional)
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) =>
                  setForm({ ...form, deadline: e.target.value })
                }
                style={inputStyle}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                disabled={saving}
                style={{
                  flex: 1,
                  padding: "12px",
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
                {saving ? "Creating..." : "Create Goal"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{
                  padding: "12px 16px",
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
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            color: "#9497a9",
            fontSize: "14px",
          }}
        >
          Loading goals...
        </div>
      ) : goals.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "60px",
            backgroundColor: "#ffffff",
            borderRadius: "16px",
            border: "1px solid #dedee5",
          }}
        >
          <Target
            size={40}
            color="#dedee5"
            style={{ marginBottom: "12px" }}
          />
          <p style={{ color: "#9497a9", fontSize: "14px", margin: 0 }}>
            No savings goals yet. Create one to start tracking your progress.
          </p>
        </div>
      ) : (
        <>
          {/* Active Goals */}
          {activeGoals.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <h2
                style={{
                  fontFamily: FONT_BRAND,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#101114",
                  margin: "0 0 14px",
                }}
              >
                Active Goals
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {activeGoals.map((g) => (
                  <div
                    key={g.id}
                    style={{
                      backgroundColor: "#ffffff",
                      borderRadius: "14px",
                      border: "1px solid #dedee5",
                      padding: "20px 24px",
                      boxShadow: "rgba(0,0,0,0.03) 0px 4px 24px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        marginBottom: "12px",
                      }}
                    >
                      <div>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#101114",
                            margin: "0 0 4px",
                            fontFamily: FONT_BRAND,
                          }}
                        >
                          {g.name}
                        </p>
                        {g.deadline && (
                          <p
                            style={{
                              fontSize: "12px",
                              color: "#9497a9",
                              margin: 0,
                            }}
                          >
                            Deadline:{" "}
                            {new Date(g.deadline).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        )}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <button
                          onClick={() => {
                            setAddingTo(addingTo === g.id ? null : g.id);
                            setAddAmount("");
                          }}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "rgba(113,50,245,0.1)",
                            color: "#7132f5",
                            fontSize: "12px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: FONT_UI,
                          }}
                        >
                          <PlusCircle size={13} />
                          Add
                        </button>
                        <button
                          onClick={async () => {
                            await deleteGoal(g.id);
                            toast.success("Goal deleted");
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

                    {/* Progress */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#9497a9" }}>
                        {fmt(g.savedAmount)} saved
                      </span>
                      <span
                        style={{
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#7132f5",
                        }}
                      >
                        {g.percentComplete}% of {fmt(g.targetAmount)}
                      </span>
                    </div>
                    <div
                      style={{
                        height: "10px",
                        borderRadius: "5px",
                        backgroundColor: "#f0f0f5",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${g.percentComplete}%`,
                          background:
                            "linear-gradient(90deg, #7132f5, #a855f7)",
                          borderRadius: "5px",
                          transition: "width 0.5s ease",
                        }}
                      />
                    </div>
                    <p
                      style={{
                        fontSize: "11px",
                        color: "#9497a9",
                        margin: "6px 0 0",
                      }}
                    >
                      {fmt(g.remaining)} remaining
                    </p>

                    {/* Add amount inline */}
                    {addingTo === g.id && (
                      <div
                        style={{
                          display: "flex",
                          gap: "8px",
                          marginTop: "12px",
                        }}
                      >
                        <input
                          type="number"
                          placeholder="Amount to add (₹)"
                          value={addAmount}
                          onChange={(e) => setAddAmount(e.target.value)}
                          style={{
                            ...inputStyle,
                            flex: 1,
                            width: "auto",
                          }}
                          min="1"
                          step="0.01"
                          autoFocus
                        />
                        <button
                          onClick={() => handleAdd(g.id)}
                          style={{
                            padding: "10px 16px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: "#7132f5",
                            color: "#ffffff",
                            fontSize: "13px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: FONT_UI,
                          }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => setAddingTo(null)}
                          style={{
                            padding: "10px 14px",
                            borderRadius: "10px",
                            border: "1px solid #dedee5",
                            backgroundColor: "#ffffff",
                            color: "#686b82",
                            fontSize: "13px",
                            cursor: "pointer",
                            fontFamily: FONT_UI,
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Completed Goals */}
          {completedGoals.length > 0 && (
            <div>
              <h2
                style={{
                  fontFamily: FONT_BRAND,
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#101114",
                  margin: "0 0 14px",
                }}
              >
                Completed Goals 🎉
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "12px",
                }}
              >
                {completedGoals.map((g) => (
                  <div
                    key={g.id}
                    style={{
                      backgroundColor: "rgba(20,158,97,0.04)",
                      borderRadius: "14px",
                      border: "1px solid rgba(20,158,97,0.2)",
                      padding: "18px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                      }}
                    >
                      <CheckCircle size={20} color="#149e61" />
                      <div>
                        <p
                          style={{
                            fontSize: "15px",
                            fontWeight: 600,
                            color: "#101114",
                            margin: "0 0 2px",
                          }}
                        >
                          {g.name}
                        </p>
                        <p
                          style={{
                            fontSize: "12px",
                            color: "#149e61",
                            margin: 0,
                          }}
                        >
                          {fmt(g.targetAmount)} achieved
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={async () => {
                        await deleteGoal(g.id);
                        toast.success("Goal removed");
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
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Savings;
