async function scrapping() {
  try {
    const res = await fetch("http://localhost:3001/api/sinner-matches");
    const data = await res.json();
    return data; // 🔹 on retourne maintenant les données
  } catch (err) {
    return null;
  }
}

export default scrapping;
