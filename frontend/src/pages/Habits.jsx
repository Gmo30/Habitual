import { useState } from "react";

const HABIT_LIBRARY = [
  {
    id: "meditate",
    category: "Mindfulness",
    title: "Meditate",
    description:
      "Cultivate a quiet mind with a daily practice. Start with just five minutes of focused breathing to ground your energy and reduce morning anxiety.",
    tag: "10 min average",
    featured: true,
    iconMaterial: "spa",
    iconBg: "#d1e9d0",
    iconColor: "#4c614d",
  },
  {
    id: "hydrate",
    category: "Nutrition",
    title: "Hydrate",
    description:
      "Keep your body's rhythm flowing. Aim for 8 glasses to maintain energy levels and mental clarity.",
    iconMaterial: "water_drop",
    iconBg: "#ffdbcb",
    iconColor: "#8c4e2e",
  },
  {
    id: "walk",
    category: "Movement",
    title: "Walk",
    description:
      "A gentle 15-minute stroll to reconnect with nature and move your body softly.",
    iconMaterial: "directions_walk",
    iconBg: "#d1e9d0",
    iconColor: "#4c614d",
  },
  {
    id: "read",
    category: "Mindfulness",
    title: "Read",
    description:
      "Nourish your mind with 10 pages of a book that inspires or relaxes you before bed.",
    iconMaterial: "menu_book",
    iconBg: "#e6e2d9",
    iconColor: "#5d5c55",
  },
  {
    id: "journal",
    category: "Mindfulness",
    title: "Journal",
    description:
      "Reflect on three things you're grateful for to close your day with warmth.",
    iconMaterial: "edit_note",
    iconBg: "#ffdbcb",
    iconColor: "#8c4e2e",
  },
];

const FILTER_TABS = ["All", "Mindfulness", "Movement", "Nutrition"];

const S = {
  page: {
    background: "#fff8f3",
    color: "#1e1b18",
    minHeight: "100vh",
    padding: "2rem 2.5rem 3rem",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  },
  softShadow: { boxShadow: "0 16px 24px -12px rgba(30,27,24,0.08)" },
  innerSoftShadow: { boxShadow: "inset 0 2px 4px 0 rgba(30,27,24,0.05)" },
};

export default function Habits({
  habits = [],
  loading = false,
  addHabit = async () => {},
  removeHabit = async () => {},
}) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [newHabit, setNewHabit] = useState("");
  const [inputError, setInputError] = useState("");
  const [showCustom, setShowCustom] = useState(false);

  const habitNames = habits.map((h) => h.name);

  const handleAdd = async (name) => {
    if (habitNames.includes(name)) {
      const habit = habits.find((h) => h.name === name);
      if (habit) await removeHabit(habit._id);
    } else {
      await addHabit(name);
    }
  };

  const handleCustomAdd = async () => {
    const trimmed = newHabit.trim();
    if (!trimmed) return;
    const result = await addHabit(trimmed);
    if (result?.success) {
      setNewHabit("");
      setInputError("");
      setShowCustom(false);
    } else {
      setInputError(result?.message || "Something went wrong.");
    }
  };

  const filtered = HABIT_LIBRARY.filter((h) => {
    const matchesSearch = h.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || h.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const featured = filtered.find((h) => h.featured);
  const rest = filtered.filter((h) => !h.featured);

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Literata:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <style>{`
        .msym {
          font-family: 'Material Symbols Outlined';
          font-style: normal;
          font-weight: normal;
          font-size: inherit;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          line-height: 1;
          vertical-align: middle;
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          user-select: none;
        }
        .msym-fill { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
        .card-hover:hover { background: #ffffff !important; }
        .btn-primary:active { transform: scale(0.95); }
        .btn-add:active { transform: scale(0.9); }
        .search-inp:focus { outline: none; ring: none; }
      `}</style>

      <div style={S.page}>
        {/* ── Header ── */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontFamily: "'Literata', serif", fontSize: "2rem", fontWeight: 700, lineHeight: 1.25, margin: 0, color: "#1e1b18" }}>
              Habit Library
            </h2>
            <p style={{ marginTop: "0.5rem", fontSize: "1.125rem", lineHeight: "1.75rem", color: "#434842", maxWidth: "36rem", margin: "0.5rem 0 0" }}>
              Curated rituals to help you find your rhythm. Choose a pre-set habit or craft your own unique practice.
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={() => setShowCustom(true)}
            style={{
              ...S.softShadow,
              display: "flex", alignItems: "center", gap: "0.5rem",
              background: "#8c4e2e", color: "#fff",
              padding: "0.75rem 1.5rem", borderRadius: "0.75rem",
              border: "none", cursor: "pointer",
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem",
              letterSpacing: "0.01em", whiteSpace: "nowrap",
              transition: "transform 0.1s",
            }}
          >
            <span className="msym" style={{ fontSize: "20px" }}>add_circle</span>
            Add Custom Habit
          </button>
        </div>

        {/* ── Search + filters ── */}
        <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", flexWrap: "wrap", alignItems: "center" }}>
          <div style={{ position: "relative", flex: "1", minWidth: "200px" }}>
            <span className="msym" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "#434842", fontSize: "20px", pointerEvents: "none" }}>
              search
            </span>
            <input
              className="search-inp"
              placeholder="Find a habit..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                ...S.innerSoftShadow,
                width: "100%", padding: "1rem 1rem 1rem 3rem",
                background: "#faf2ed", border: "none", borderRadius: "1rem",
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "1rem", color: "#1e1b18",
                boxSizing: "border-box",
              }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {FILTER_TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                style={{
                  padding: "0.5rem 1rem", borderRadius: "9999px", border: "none", cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                  letterSpacing: "0.01em", transition: "all 0.15s",
                  background: activeFilter === tab ? "#4c614d" : "#f4ede7",
                  color: activeFilter === tab ? "#fff" : "#434842",
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Custom habit form ── */}
        {showCustom && (
          <div style={{ ...S.softShadow, background: "#fff", borderRadius: "1.5rem", padding: "1.25rem 1.5rem", marginBottom: "1.5rem", border: "1px solid rgba(76,97,77,0.08)" }}>
            <p style={{ margin: "0 0 0.75rem", fontWeight: 600, fontSize: "0.75rem", letterSpacing: "0.05em", color: "#737871", textTransform: "uppercase" }}>
              New Custom Habit
            </p>
            <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
              <input
                type="text"
                placeholder="e.g. Cold shower, Stretch, No phone..."
                value={newHabit}
                onChange={(e) => { setNewHabit(e.target.value); setInputError(""); }}
                onKeyDown={(e) => e.key === "Enter" && handleCustomAdd()}
                autoFocus
                style={{
                  flex: 1, padding: "0.625rem 1rem",
                  border: inputError ? "1.5px solid #ba1a1a" : "1.5px solid #c3c8c0",
                  borderRadius: "0.75rem", background: "#faf2ed",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", color: "#1e1b18",
                  outline: "none",
                }}
              />
              <button
                onClick={handleCustomAdd}
                disabled={loading}
                style={{
                  padding: "0.625rem 1.25rem", background: "#4c614d", color: "#fff",
                  border: "none", borderRadius: "0.75rem", cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: "0.875rem",
                  opacity: loading ? 0.6 : 1,
                }}
              >
                Add
              </button>
              <button
                onClick={() => { setShowCustom(false); setInputError(""); setNewHabit(""); }}
                style={{
                  padding: "0.625rem 1rem", background: "transparent",
                  border: "1.5px solid #c3c8c0", borderRadius: "0.75rem", cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: "0.875rem", color: "#737871",
                }}
              >
                Cancel
              </button>
            </div>
            {inputError && <p style={{ margin: "0.4rem 0 0", fontSize: "0.75rem", color: "#ba1a1a" }}>{inputError}</p>}
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "1rem" }}>

          {featured && (() => {
            const added = habitNames.includes(featured.title);
            return (
              <div
                className="card-hover"
                style={{
                  ...S.softShadow,
                  gridColumn: "span 8",
                  background: added ? "#f4faf4" : "#ffffff",
                  borderRadius: "2rem", padding: "2rem",
                  border: added ? "1.5px solid #b6cdb4" : "1px solid rgba(76,97,77,0.05)",
                  transition: "background 0.2s",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", gap: "2rem", alignItems: "stretch" }}>
                  <div style={{ width: "33%", flexShrink: 0, borderRadius: "1rem", overflow: "hidden", minHeight: "180px", background: "linear-gradient(145deg, #b6cdb4 0%, #7a9e7a 100%)" }} />
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#8c4e2e", marginBottom: "0.5rem" }}>
                      <span className="msym msym-fill" style={{ fontSize: "20px" }}>spa</span>
                      <span style={{ fontWeight: 600, fontSize: "0.875rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                        {featured.category}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: "'Literata', serif", fontSize: "1.5rem", fontWeight: 700, margin: "0 0 0.75rem", color: "#1e1b18" }}>
                      {featured.title}
                    </h3>
                    <p style={{ fontSize: "1rem", lineHeight: "1.6", color: "#434842", margin: "0 0 1.5rem" }}>
                      {featured.description}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontWeight: 500, fontSize: "0.75rem", color: "#484741", background: "#e6e2d9", padding: "0.25rem 0.75rem", borderRadius: "9999px" }}>
                        {featured.tag}
                      </span>
                      <AddButton added={added} onClick={() => handleAdd(featured.title)} disabled={loading} />
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
          
          {rest.map((habit) => {
            const added = habitNames.includes(habit.title);
            return (
              <div
                key={habit.id}
                className="card-hover"
                style={{
                  ...S.softShadow,
                  gridColumn: "span 4",
                  background: added ? "#f4faf4" : "#ffffff",
                  borderRadius: "2rem", padding: "1.5rem",
                  border: added ? "1.5px solid #b6cdb4" : "1px solid rgba(76,97,77,0.05)",
                  display: "flex", flexDirection: "column", justifyContent: "space-between",
                  transition: "background 0.2s", cursor: "pointer",
                  minHeight: "200px",
                }}
              >
                <div>
                  <div style={{
                    width: "48px", height: "48px", borderRadius: "0.875rem",
                    background: habit.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "1.25rem",
                    color: habit.iconColor,
                  }}>
                    <span className="msym" style={{ fontSize: "28px" }}>{habit.iconMaterial}</span>
                  </div>
                  <h3 style={{ fontFamily: "'Literata', serif", fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.5rem", color: "#1e1b18" }}>
                    {habit.title}
                  </h3>
                  <p style={{ fontSize: "1rem", lineHeight: "1.5", color: "#434842", margin: 0 }}>
                    {habit.description}
                  </p>
                </div>
                <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "flex-end" }}>
                  <AddButton added={added} onClick={() => handleAdd(habit.title)} disabled={loading} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function AddButton({ added, onClick, disabled }) {
  return (
    <button
      className="btn-add"
      onClick={onClick}
      disabled={disabled}
      style={{
        width: "40px", height: "40px", borderRadius: "9999px", border: "none",
        background: added ? "#657a65" : "#4c614d",
        color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "transform 0.1s, background 0.15s",
        flexShrink: 0,
      }}
    >
      <span className="msym" style={{ fontSize: "20px" }}>{added ? "check" : "add"}</span>
    </button>
  );
}