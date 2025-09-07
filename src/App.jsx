import React, { useEffect, useMemo, useState } from "react";

// Minimal, drop-in React app you can paste into CodeSandbox (React template) as App.jsx
// API used: TheMealDB (no auth). Endpoints:
// - Search (by ingredient): https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}
// - Lookup (by id):       https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}

export default function RecipeIdeasApp() {
  const [ingredient, setIngredient] = useState("chicken");
  const [query, setQuery] = useState("chicken");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loadingMeal, setLoadingMeal] = useState(false);

  const popular = useMemo(
    () => [
      "chicken",
      "paneer",
      "egg",
      "tomato",
      "potato",
      "rice",
      "mushroom",
      "fish",
      "prawn",
      "chickpea",
    ],
    []
  );

  useEffect(() => {
    let ignore = false;
    async function run() {
      setLoading(true);
      setError("");
      try {
        const url = `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(
          query.trim()
        )}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        if (!ignore) setMeals(Array.isArray(data.meals) ? data.meals : []);
      } catch (e) {
        if (!ignore) {
          setMeals([]);
          setError("Could not load recipes. Please try another ingredient.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    if (query.trim()) run();
    return () => {
      ignore = true;
    };
  }, [query]);

  useEffect(() => {
    let ignore = false;
    async function run() {
      if (!selectedId) return;
      setLoadingMeal(true);
      try {
        const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedId}`;
        const res = await fetch(url);
        const data = await res.json();
        const meal = data?.meals?.[0] || null;
        if (!ignore) setSelected(meal);
      } catch (e) {
        if (!ignore) setSelected(null);
      } finally {
        if (!ignore) setLoadingMeal(false);
      }
    }
    run();
    return () => {
      ignore = true;
    };
  }, [selectedId]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (ingredient.trim()) setQuery(ingredient);
  };

  const onChip = (chip) => {
    setIngredient(chip);
    setQuery(chip);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <Style />
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="container">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">🍳 Recipe Ideas</h1>
          <p className="mt-1 text-sm md:text-base text-slate-600">
            Find dishes by <strong>ingredient</strong>. Tap a card for full recipe & video.
          </p>
          <form onSubmit={onSubmit} className="mt-4 flex gap-2">
            <input
              className="input flex-1"
              placeholder="e.g., chicken, paneer, egg, tomato"
              value={ingredient}
              onChange={(e) => setIngredient(e.target.value)}
              aria-label="Ingredient"
            />
            <button className="btn" type="submit" aria-label="Search recipes">
              Search
            </button>
          </form>
          <div className="chips" role="list" aria-label="Popular ingredients">
            {popular.map((p) => (
              <button key={p} className="chip" onClick={() => onChip(p)} role="listitem">
                {p}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="container py-6">
        {loading ? (
          <div className="center">Loading recipes…</div>
        ) : error ? (
          <div className="center error" role="alert">
            {error}
          </div>
        ) : meals.length === 0 ? (
          <div className="center">No recipes found for "{query}"</div>
        ) : (
          <section className="grid">
            {meals.map((m) => (
              <article key={m.idMeal} className="card" onClick={() => setSelectedId(m.idMeal)}>
                <img src={m.strMealThumb} alt={m.strMeal} loading="lazy" />
                <div className="card-body">
                  <h3 className="card-title">{m.strMeal}</h3>
                  <p className="card-sub">Tap for full recipe</p>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>

      <footer className="py-10 text-center text-slate-500">
        <p>
          Data by <a className="link" href="https://www.themealdb.com/" target="_blank" rel="noreferrer">TheMealDB</a> · Built with React
        </p>
      </footer>

      {/* Modal */}
      {selectedId && (
        <div className="modal" role="dialog" aria-modal="true" onClick={() => setSelectedId(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close" onClick={() => setSelectedId(null)} aria-label="Close">
              ✕
            </button>
            {loadingMeal ? (
              <div className="center">Loading recipe…</div>
            ) : !selected ? (
              <div className="center error">Could not load the recipe details.</div>
            ) : (
              <RecipeDetails meal={selected} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RecipeDetails({ meal }) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${meas ? meas.trim() : ""} ${ing.trim()}`.trim());
  }

  return (
    <div>
      <div className="detail-header">
        <img className="detail-img" src={meal.strMealThumb} alt={meal.strMeal} />
        <div>
          <h2 className="detail-title">{meal.strMeal}</h2>
          <p className="detail-meta">
            {meal.strArea ? <span>{meal.strArea}</span> : null}
            {meal.strCategory ? <span>{meal.strCategory}</span> : null}
          </p>
          {meal.strTags && (
            <div className="tags">
              {meal.strTags.split(",").map((t) => (
                <span key={t} className="tag">#{t.trim()}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {ingredients.length > 0 && (
        <section>
          <h3 className="section-title">Ingredients</h3>
          <ul className="ingredients">
            {ingredients.map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ul>
        </section>
      )}

      {meal.strInstructions && (
        <section>
          <h3 className="section-title">Instructions</h3>
          <p className="instructions">{meal.strInstructions}</p>
        </section>
      )}

      <div className="actions">
        {meal.strSource && (
          <a className="btn secondary" href={meal.strSource} target="_blank" rel="noreferrer">
            Full Source
          </a>
        )}
        {meal.strYoutube && (
          <a className="btn" href={meal.strYoutube} target="_blank" rel="noreferrer">
            Watch Video
          </a>
        )}
      </div>
    </div>
  );
}

function Style() {
  return (
    <style>{`
  :root {
    --bg: #f8fafc;
    --card: #ffffff;
    --ink: #0f172a;
    --muted: #64748b;
    --ring: #6366f1;
    --border: #e2e8f0;
    --shadow: 0 10px 20px rgba(2, 6, 23, 0.08);
  }
  * { box-sizing: border-box; }
  html, body, #root { height: 100%; }
  body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, Noto Sans, sans-serif; color: var(--ink); background: var(--bg); }
  .container { max-width: 1100px; margin: 0 auto; padding: 16px; }
  .input { border: 1px solid var(--border); border-radius: 14px; padding: 12px 14px; font-size: 16px; outline: none; transition: box-shadow .15s, border-color .15s; background: #fff; }
  .input:focus { border-color: var(--ring); box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2); }
  .btn { background: var(--ink); color: white; border: 0; padding: 10px 16px; border-radius: 14px; cursor: pointer; font-weight: 700; box-shadow: var(--shadow); }
  .btn:hover { filter: brightness(0.96); }
  .btn.secondary { background: #eef2ff; color: #3730a3; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .chip { border: 1px solid var(--border); background: #fff; padding: 6px 10px; border-radius: 999px; cursor: pointer; font-size: 14px; }
  .chip:hover { border-color: var(--ring); }
  .grid { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 14px; }
  @media (min-width: 520px) { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 800px) { .grid { grid-template-columns: repeat(3, 1fr); } }
  .card { background: var(--card); border: 1px solid var(--border); border-radius: 16px; overflow: hidden; box-shadow: var(--shadow); cursor: pointer; display: flex; flex-direction: column; }
  .card img { width: 100%; height: 180px; object-fit: cover; display: block; }
  .card-body { padding: 12px; }
  .card-title { margin: 0; font-size: 16px; font-weight: 800; }
  .card-sub { margin: 6px 0 0; color: var(--muted); font-size: 13px; }
  .center { text-align: center; color: var(--muted); padding: 32px; }
  .error { color: #b91c1c; }
  .link { color: #3730a3; text-decoration: none; font-weight: 600; }
  .link:hover { text-decoration: underline; }

  /* Modal */
  .modal { position: fixed; inset: 0; background: rgba(2, 6, 23, 0.6); display: grid; place-items: center; padding: 18px; }
  .modal-content { width: min(900px, 100%); background: #fff; border-radius: 20px; border: 1px solid var(--border); box-shadow: var(--shadow); padding: 18px; position: relative; max-height: 92vh; overflow: auto; }
  .close { position: absolute; top: 10px; right: 10px; border: 0; background: #f1f5f9; border-radius: 10px; padding: 6px 8px; cursor: pointer; }
  .detail-header { display: grid; grid-template-columns: 120px 1fr; gap: 14px; align-items: center; }
  .detail-img { width: 120px; height: 120px; object-fit: cover; border-radius: 14px; border: 1px solid var(--border); }
  .detail-title { margin: 0 0 4px; font-size: 22px; font-weight: 900; }
  .detail-meta { margin: 0; display: flex; gap: 10px; color: var(--muted); font-size: 14px; }
  .tags { margin-top: 8px; display: flex; flex-wrap: wrap; gap: 6px; }
  .tag { background: #f1f5f9; color: #0f172a; padding: 4px 10px; border-radius: 999px; font-size: 12px; border: 1px solid var(--border); }
  .section-title { font-size: 16px; font-weight: 800; margin: 18px 0 8px; }
  .ingredients { display: grid; grid-template-columns: repeat(1, minmax(0, 1fr)); gap: 6px; padding-left: 16px; }
  @media (min-width: 600px) { .ingredients { grid-template-columns: repeat(2, 1fr); } }
  .instructions { white-space: pre-wrap; line-height: 1.55; }
  .actions { display: flex; gap: 10px; margin-top: 16px; }
    `}</style>
  );
}

