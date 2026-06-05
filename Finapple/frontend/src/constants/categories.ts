// Single source of truth for all transaction categories.
// Budget Manager and Wallet both import from here — they will always match.

export type CategoryMeta = {
  value: string;
  label: string;
  color: string;
};

/** Expense categories — used in Wallet withdrawals AND Budget Manager */
export const EXPENSE_CATEGORIES: CategoryMeta[] = [
  { value: "food",          label: "Food & Dining",    color: "#f59e0b" },
  { value: "rent",          label: "Rent & Housing",   color: "#7132f5" },
  { value: "transport",     label: "Transport",        color: "#3b82f6" },
  { value: "entertainment", label: "Entertainment",    color: "#ec4899" },
  { value: "health",        label: "Health & Medical", color: "#10b981" },
  { value: "shopping",      label: "Shopping",         color: "#f97316" },
  { value: "utilities",     label: "Utilities",        color: "#6366f1" },
  { value: "education",     label: "Education",        color: "#14b8a6" },
  { value: "other",         label: "Other",            color: "#9497a9" },
];

/** Income categories — used in Wallet deposits only (not budgeted) */
export const INCOME_CATEGORIES: CategoryMeta[] = [
  { value: "salary",     label: "Salary",        color: "#149e61" },
  { value: "freelance",  label: "Freelance",     color: "#10b981" },
  { value: "investment", label: "Investment",    color: "#3b82f6" },
  { value: "gift",       label: "Gift",          color: "#ec4899" },
  { value: "other",      label: "Other Income",  color: "#9497a9" },
];

/** Quick lookup: category value → color */
export const CATEGORY_COLOR: Record<string, string> = Object.fromEntries(
  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((c) => [c.value, c.color]),
);

/** Quick lookup: category value → label */
export const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES].map((c) => [c.value, c.label]),
);
