# 🍳 Recipe Ideas App

This project was created for the **Take-Home Challenge**.  
Out of the given user needs, I chose **Recipe Ideas**.

---

## 📝 Challenge Mapping

**User Persona**  
- **Name:** Taylor  
- **Occupation:** Busy Professional  
- **Need:** After a long day at work, Taylor wants quick help in the kitchen. Sometimes it’s about cooking with whatever ingredients are lying around, other times it’s about finding something that matches the time or mood.  

**Task**  
The goal was to build a simple application where Taylor can search for recipes by ingredient.  
- API Used: [TheMealDB](https://www.themealdb.com/api.php)  
  - Search: `https://www.themealdb.com/api/json/v1/1/filter.php?i={ingredient}`  
  - Lookup: `https://www.themealdb.com/api/json/v1/1/lookup.php?i={id}`  

---

## 🎯 What the App Can Do
- 🔍 Search for recipes by typing any ingredient.  
- ⚡ Quickly try common ingredients with one click (chicken, paneer, egg, etc.).  
- 🖼️ Browse recipes in a clean card layout with images.  
- 📖 Click on a recipe to see details:
  - Full list of ingredients  
  - Cooking instructions  
  - Tags (if available)  
  - Source link + YouTube video demo  
- 📱 Works well on both desktop and mobile.  
- 🚫 Handles errors gracefully (like empty searches or network issues).  

---

## 🛠️ Tech Stack
- **React** for building the UI  
- **CSS-in-JS** (inline styles) for a quick but clean design  
- **React hooks** (`useState`, `useEffect`, `useMemo`) for state management  
- **TheMealDB API** as the recipe source  



