import React, { useEffect, useState } from "react";
import { Search, Play, ExternalLink, X, Clock, Users, ChefHat } from "lucide-react";

export default function RecipeIdeasApp() {
  const [ingredient, setIngredient] = useState("chicken");
  const [query, setQuery] = useState("chicken");
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [selected, setSelected] = useState(null);
  const [loadingMeal, setLoadingMeal] = useState(false);

  const popular = [
    { name: "chicken", emoji: "🍗" },
    { name: "paneer", emoji: "🧀" },
    { name: "egg", emoji: "🥚" },
    { name: "tomato", emoji: "🍅" },
    { name: "potato", emoji: "🥔" },
    { name: "rice", emoji: "🍚" },
    { name: "mushroom", emoji: "🍄" },
    { name: "fish", emoji: "🐟" },
    { name: "prawn", emoji: "🦐" },
    { name: "chickpea", emoji: "🫘" },
  ];

  useEffect(() => {
    let ignore = false;
    if (!query.trim()) return;

    setLoading(true);
    setError("");
    fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(query)}`)
      .then(res => res.ok ? res.json() : Promise.reject("Network Error"))
      .then(data => {
        if (!ignore) setMeals(Array.isArray(data.meals) ? data.meals : []);
      })
      .catch(() => {
        if (!ignore) {
          setMeals([]);
          setError("Could not load recipes. Try another ingredient.");
        }
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => { ignore = true; };
  }, [query]);

  useEffect(() => {
    if (!selectedId) return;
    let ignore = false;
    setLoadingMeal(true);

    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${selectedId}`)
      .then(res => res.json())
      .then(data => {
        if (!ignore) setSelected(data?.meals?.[0] || null);
      })
      .catch(() => { if (!ignore) setSelected(null); })
      .finally(() => { if (!ignore) setLoadingMeal(false); });

    return () => { ignore = true; };
  }, [selectedId]);
  
  // Close modal on 'Escape' key press
  useEffect(() => {
    const handleEsc = (event) => {
       if (event.key === 'Escape') {
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);


  const onSubmit = (e) => {
    e.preventDefault();
    if (ingredient.trim()) setQuery(ingredient);
  };

  const onChip = (chip) => {
    setIngredient(chip);
    setQuery(chip);
  };

  return (
    // Tip: You can remove the Tailwind class names from this div if you like
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Style />

      {/* Hero Header */}
      <header className="hero-header">
        <div className="hero-bg"></div>
        <div className="container relative z-10">
          <div className="hero-content">
            <div className="hero-icon">
              <ChefHat size={48} className="text-white" />
            </div>
            <h1 className="hero-title">
              Culinary <span className="gradient-text">Adventures</span>
            </h1>
            <p className="hero-subtitle">
              Discover amazing recipes by ingredient. Every meal tells a story.
            </p>

            <form onSubmit={onSubmit} className="search-form">
              <div className="search-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  className="search-input"
                  placeholder="What ingredient inspires you today?"
                  value={ingredient}
                  onChange={(e) => setIngredient(e.target.value)}
                  aria-label="Ingredient"
                />
                <button className="search-btn" type="submit" aria-label="Search recipes">
                  <Search size={16} />
                </button>
              </div>
            </form>

            <div className="popular-chips">
              <span className="chips-label">Popular:</span>
              {popular.map((p) => (
                <button
                  key={p.name}
                  className="popular-chip"
                  onClick={() => onChip(p.name)}
                  aria-label={`Search ${p.name}`}
                >
                  <span className="chip-emoji">{p.emoji}</span>
                  {p.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Discovering delicious recipes...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <div className="error-icon">😔</div>
              <p>{error}</p>
            </div>
          ) : meals.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <p>No recipes found for "{query}"</p>
              <span>Try a different ingredient!</span>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2>Found {meals.length} amazing recipes with {query}</h2>
                <div className="results-line"></div>
              </div>
              <div className="recipe-grid">
                {meals.map((m, index) => (
                  <article
                    key={m.idMeal}
                    className="recipe-card"
                    style={{ '--delay': `${index * 0.05}s` }}
                    onClick={() => setSelectedId(m.idMeal)}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedId(m.idMeal)}
                  >
                    <div className="card-image-wrapper">
                      <img src={m.strMealThumb} alt={m.strMeal} loading="lazy" className="card-image" />
                      <div className="card-overlay">
                        <div className="play-button">
                           <Play size={24} fill="white" stroke="none" />
                        </div>
                      </div>
                    </div>
                    <div className="card-content">
                      <h3 className="card-title">{m.strMeal}</h3>
                      <p className="card-subtitle">Tap to explore recipe</p>
                      <div className="card-action">
                        <span>View Recipe</span>
                        <ExternalLink size={16} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            Powered by <a className="footer-link" href="https://www.themealdb.com/" target="_blank" rel="noreferrer">TheMealDB</a> 
            • Crafted with ❤️ and React
          </p>
        </div>
      </footer>

      {/* Modal */}
      {selectedId && (
        <div className="modal-backdrop" onClick={() => setSelectedId(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedId(null)} aria-label="Close">
              <X size={20} />
            </button>
            {loadingMeal ? (
              <div className="modal-loading">
                <div className="loading-spinner"></div>
                <p>Loading recipe details...</p>
              </div>
            ) : !selected ? (
              <div className="modal-error">
                <div className="error-icon">⚠️</div>
                <p>Could not load the recipe details.</p>
              </div>
            ) : (
              <RecipeDetails meal={selected} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Recipe Details Component
function RecipeDetails({ meal }) {
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const meas = meal[`strMeasure${i}`];
    if (ing && ing.trim()) ingredients.push(`${meas ? meas.trim() : ""} ${ing.trim()}`.trim());
  }

  return (
    <div className="recipe-details">
      <div className="detail-hero">
        <div className="detail-image-wrapper">
          <img className="detail-image" src={meal.strMealThumb} alt={meal.strMeal} />
        </div>
        <div className="detail-info">
          <h2 className="detail-title">{meal.strMeal}</h2>
          <div className="detail-meta">
            {meal.strArea && (
              <div className="meta-item">
                <span className="meta-icon">🌍</span>
                <span>{meal.strArea}</span>
              </div>
            )}
            {meal.strCategory && (
              <div className="meta-item">
                <span className="meta-icon">🍽️</span>
                <span>{meal.strCategory}</span>
              </div>
            )}
            <div className="meta-item">
              <Clock size={16} className="meta-icon" />
              <span>30-45 min</span>
            </div>
            <div className="meta-item">
              <Users size={16} className="meta-icon" />
              <span>4 servings</span>
            </div>
          </div>

          {meal.strTags && (
            <div className="recipe-tags">
              {meal.strTags.split(",").map((t) => (
                <span key={t} className="recipe-tag">#{t.trim()}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {ingredients.length > 0 && (
        <section className="detail-section">
          <h3 className="section-header">
            <span className="section-icon">🥘</span>
            Ingredients
          </h3>
          <div className="ingredients-grid">
            {ingredients.map((ing, i) => (
              <div key={i} className="ingredient-item">
                <span className="ingredient-bullet">•</span>
                <span className="ingredient-text">{ing}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {meal.strInstructions && (
        <section className="detail-section">
          <h3 className="section-header">
            <span className="section-icon">📋</span>
            Instructions
          </h3>
          <div className="instructions-wrapper">
            <p className="instructions-text">{meal.strInstructions}</p>
          </div>
        </section>
      )}

      <div className="detail-actions">
        {meal.strSource && (
          <a className="action-btn secondary" href={meal.strSource} target="_blank" rel="noreferrer">
            <ExternalLink size={18} />
            <span>Full Recipe</span>
          </a>
        )}
        {meal.strYoutube && (
          <a className="action-btn primary" href={meal.strYoutube} target="_blank" rel="noreferrer">
            <Play size={18} />
            <span>Watch Video</span>
          </a>
        )}
      </div>
    </div>
  );
}

// Style Component
function Style() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

      :root {
        --c-bg: #F8F7FF;
        --c-primary: #A29BFE;
        --c-primary-light: #E8E6FF;
        --c-secondary: #74B9FF;
        --c-text-primary: #2d3436;
        --c-text-secondary: #636e72;
        --c-white: #FFFFFF;
        --c-border: #dfe6e9;
        --c-shadow: rgba(162, 155, 254, 0.2);
        --c-gradient-start: #a29bfe;
        --c-gradient-end: #74b9ff;
        --radius-sm: 4px;
        --radius-md: 8px;
        --radius-lg: 16px;
        --shadow-sm: 0 4px 6px -1px var(--c-shadow), 0 2px 4px -1px var(--c-shadow);
        --shadow-md: 0 10px 15px -3px var(--c-shadow), 0 4px 6px -2px var(--c-shadow);
      }
      
      body {
        font-family: 'Poppins', sans-serif;
        background-color: var(--c-bg);
        color: var(--c-text-primary);
        line-height: 1.6;
      }
      
      .container {
        width: 100%;
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 1rem;
      }
      
      /* --- Hero Header --- */
      .hero-header {
        position: relative;
        padding: 6rem 0;
        text-align: center;
        overflow: hidden;
        border-bottom: 1px solid var(--c-border);
      }
      .hero-bg {
        position: absolute;
        top: 0; left: 0; right: 0; bottom: 0;
        background-image: linear-gradient(135deg, var(--c-gradient-start) 0%, var(--c-gradient-end) 100%);
        opacity: 0.1;
      }
      .hero-content {
        position: relative;
        backdrop-filter: blur(10px);
        background: rgba(255, 255, 255, 0.3);
        padding: 2.5rem;
        border-radius: var(--radius-lg);
        border: 1px solid rgba(255, 255, 255, 0.5);
        box-shadow: 0 8px 32px 0 rgba(100, 100, 150, 0.1);
      }
      .hero-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: linear-gradient(135deg, var(--c-gradient-start), var(--c-gradient-end));
        border-radius: 50%;
        margin-bottom: 1.5rem;
        box-shadow: var(--shadow-md);
      }
      .hero-title {
        font-size: 3rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
      }
      .gradient-text {
        background: linear-gradient(135deg, var(--c-gradient-start), var(--c-gradient-end));
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .hero-subtitle {
        font-size: 1.1rem;
        color: var(--c-text-secondary);
        max-width: 500px;
        margin: 0 auto 2rem;
      }

      /* --- Search Form --- */
      .search-form { width: 100%; max-width: 600px; margin: 0 auto; }
      .search-wrapper { display: flex; align-items: center; background: var(--c-white); border-radius: 50px; padding: 0.5rem; box-shadow: var(--shadow-sm); transition: box-shadow 0.3s ease; }
      .search-wrapper:focus-within { box-shadow: var(--shadow-md); }
      .search-icon { color: var(--c-text-secondary); margin: 0 0.75rem; }
      .search-input { flex-grow: 1; border: none; background: transparent; outline: none; font-size: 1rem; padding: 0.5rem 0; color: var(--c-text-primary); }
      .search-input::placeholder { color: var(--c-text-secondary); opacity: 0.8; }
      .search-btn { display: flex; align-items: center; justify-content: center; background: var(--c-primary); color: var(--c-white); border: none; border-radius: 50%; width: 36px; height: 36px; cursor: pointer; transition: background-color 0.3s ease; }
      .search-btn:hover { background: var(--c-gradient-end); }

      /* --- Popular Chips --- */
      .popular-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem; margin-top: 1.5rem; }
      .chips-label { font-size: 0.9rem; color: var(--c-text-secondary); align-self: center; margin-right: 0.5rem; }
      .popular-chip { display: inline-flex; align-items: center; background: var(--c-white); border: 1px solid var(--c-border); border-radius: 20px; padding: 0.4rem 0.9rem; font-size: 0.9rem; cursor: pointer; transition: all 0.2s ease; }
      .popular-chip:hover { background: var(--c-primary-light); border-color: var(--c-primary); color: var(--c-primary); }
      .chip-emoji { margin-right: 0.5rem; font-size: 1rem; }

      /* --- Main Content & Recipe Grid --- */
      .main-content { padding: 4rem 0; }
      .results-header { text-align: center; margin-bottom: 2.5rem; }
      .results-header h2 { font-size: 1.75rem; font-weight: 600; margin-bottom: 0.5rem; }
      .results-line { width: 80px; height: 3px; background: var(--c-primary); margin: 0 auto; border-radius: 2px; }
      .recipe-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
      
      @keyframes fade-in-up {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .recipe-card {
        background: var(--c-white);
        border-radius: var(--radius-lg);
        overflow: hidden;
        box-shadow: var(--shadow-sm);
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        opacity: 0;
        animation: fade-in-up 0.5s ease forwards;
        animation-delay: var(--delay);
      }
      .recipe-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-md); }
      .card-image-wrapper { position: relative; }
      .card-image { width: 100%; height: 200px; object-fit: cover; display: block; }
      .card-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.2); opacity: 0; transition: opacity 0.3s ease; }
      .recipe-card:hover .card-overlay { opacity: 1; }
      .play-button { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.8); background: rgba(0,0,0,0.5); border-radius: 50%; width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; opacity: 0; transition: all 0.3s ease; }
      .recipe-card:hover .play-button { transform: translate(-50%, -50%) scale(1); opacity: 1; }
      
      .card-content { padding: 1.25rem; }
      .card-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.25rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .card-subtitle { font-size: 0.85rem; color: var(--c-text-secondary); margin-bottom: 1rem; }
      .card-action { display: flex; align-items: center; justify-content: space-between; font-size: 0.9rem; color: var(--c-primary); font-weight: 600; }

      /* --- Loading, Error, Empty States --- */
      .loading-state, .error-state, .empty-state, .modal-loading, .modal-error { text-align: center; padding: 4rem 0; color: var(--c-text-secondary); }
      .loading-spinner { border: 4px solid var(--c-primary-light); border-top-color: var(--c-primary); border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
      @keyframes spin { to { transform: rotate(360deg); } }
      .error-icon, .empty-icon { font-size: 3rem; margin-bottom: 1rem; }
      .empty-state span { display: block; margin-top: 0.25rem; }

      /* --- Footer --- */
      .footer { text-align: center; padding: 2rem 0; border-top: 1px solid var(--c-border); font-size: 0.9rem; color: var(--c-text-secondary); }
      .footer-link { color: var(--c-primary); text-decoration: none; font-weight: 600; }
      .footer-link:hover { text-decoration: underline; }

      /* --- Modal --- */
      @keyframes fade-in-backdrop { from { opacity: 0; } to { opacity: 1; } }
      @keyframes scale-in-modal { from { transform: translate(-50%, -50%) scale(0.9); opacity: 0; } to { transform: translate(-50%, -50%) scale(1); opacity: 1; } }
      .modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); z-index: 1000; display: flex; align-items: center; justify-content: center; animation: fade-in-backdrop 0.3s ease; }
      .modal-container { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: var(--c-white); border-radius: var(--radius-lg); width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; z-index: 1001; animation: scale-in-modal 0.3s ease; }
      .modal-close { position: absolute; top: 1rem; right: 1rem; background: var(--c-bg); border: none; border-radius: 50%; width: 32px; height: 32px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: var(--c-text-secondary); transition: all 0.2s ease; z-index: 10; }
      .modal-close:hover { background: var(--c-primary-light); color: var(--c-primary); }

      /* --- Recipe Details (Inside Modal) --- */
      .recipe-details { padding: 2.5rem; }
      .detail-hero { display: flex; gap: 2rem; margin-bottom: 2rem; }
      .detail-image-wrapper { flex-shrink: 0; width: 250px; height: 250px; border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-md); }
      .detail-image { width: 100%; height: 100%; object-fit: cover; }
      .detail-info { flex-grow: 1; }
      .detail-title { font-size: 2rem; font-weight: 700; margin-bottom: 1rem; }
      .detail-meta { display: flex; flex-wrap: wrap; gap: 1rem; color: var(--c-text-secondary); font-size: 0.9rem; margin-bottom: 1rem; }
      .meta-item { display: flex; align-items: center; gap: 0.5rem; background: var(--c-bg); padding: 0.3rem 0.8rem; border-radius: 20px; }
      .meta-icon { color: var(--c-primary); }
      .recipe-tags { display: flex; flex-wrap: wrap; gap: 0.5rem; }
      .recipe-tag { background: var(--c-primary-light); color: var(--c-primary); padding: 0.2rem 0.7rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }

      .detail-section { margin-bottom: 2rem; }
      .section-header { display: flex; align-items: center; gap: 0.75rem; font-size: 1.5rem; font-weight: 600; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid var(--c-primary-light); }
      .section-icon { font-size: 1.5rem; }
      
      .ingredients-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.75rem; }
      .ingredient-item { display: flex; align-items: start; gap: 0.5rem; }
      .ingredient-bullet { color: var(--c-primary); font-weight: bold; }
      .ingredient-text { font-size: 0.95rem; }

      .instructions-wrapper { background: var(--c-bg); padding: 1.5rem; border-radius: var(--radius-md); }
      .instructions-text { white-space: pre-wrap; color: var(--c-text-secondary); }

      .detail-actions { display: flex; justify-content: flex-end; gap: 1rem; margin-top: 2rem; }
      .action-btn { display: inline-flex; align-items: center; gap: 0.5rem; padding: 0.75rem 1.5rem; border-radius: 50px; border: none; font-weight: 600; font-size: 1rem; text-decoration: none; cursor: pointer; transition: all 0.3s ease; }
      .action-btn.primary { background: var(--c-primary); color: var(--c-white); }
      .action-btn.primary:hover { background: var(--c-gradient-end); }
      .action-btn.secondary { background: var(--c-primary-light); color: var(--c-primary); }
      .action-btn.secondary:hover { background: var(--c-border); }

      /* --- Responsive --- */
      @media (max-width: 768px) {
        .hero-title { font-size: 2.5rem; }
        .detail-hero { flex-direction: column; }
        .detail-image-wrapper { width: 100%; height: 250px; }
        .recipe-details { padding: 1.5rem; }
      }
    `}</style>
  );
}
