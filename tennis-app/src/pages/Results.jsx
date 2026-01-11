import { useEffect, useState } from "react";
import scrapping from "../utils/scrapping_tool";
import { selectBestVrkMethod } from "../utils/winrateVrkCalculator";

const Results = () => {
  const [matches, setMatches] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const data = await scrapping(); // Récupère les matchs (array d'objets TennisAbstract)
      console.log("Matches :", data);
      setMatches(data);

      // === APPEL DE LA FONCTION DE PRÉDICTION ===
      if (data && data.length > 1) { // On attend au moins quelques matchs
        // Rank de l'adversaire pour le prochain match (exemple fictif)
        // À toi de le récupérer dynamiquement (ex: depuis un input ou un autre joueur sélectionné)
        const opponentNextMatchRank = 5; // Exemple : Sinner vs un joueur rank 5

        // Appel de la fonction qui choisit automatiquement le meilleur modèle vrk
        const result = selectBestVrkMethod(data, opponentNextMatchRank);

        setPrediction(result);
        console.log("Prédiction vrk pour Sinner :", result);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <h2>Résultats de Jannik Sinner</h2>

      {/* Affichage de la prédiction */}
      {prediction && (
        <div style={{ marginBottom: "30px", padding: "15px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}>
          <h3>Prédiction Winrate (pilier vrk/rk)</h3>
          <p>
            <strong>Proba de victoire contre un adversaire rank {prediction.opponentRankUsed || "?"} :</strong>{" "}
            {(prediction.winrate * 100).toFixed(1)}% ± {(prediction.marge * 100).toFixed(1)}%
          </p>
          <p>
            <strong>Méthode sélectionnée :</strong> {prediction.method}
            {prediction.lambdaUsed && ` (λ = ${prediction.lambdaUsed})`}
          </p>
          <p><strong>Matches utilisés :</strong> {prediction.totalMatchesUsed}</p>
          <p>
            Perf moyenne quand favori : {(prediction.coefFavori * 100).toFixed(1)}% | 
            Perf moyenne quand underdog : {(prediction.coefUnderdog * 100).toFixed(1)}%
          </p>
        </div>
      )}

      {/* Liste des matchs */}
      <ul>
        {matches.map((match, i) => (
          <li key={i}>
            {match.Date} - {match.Tournament} ({match.Surface}) - {match.Rd} -{" "}
            Rank: {match.Rk} vs {match.vRk} - {match.Score} →{" "}
            <strong>{match.won ? "Victoire" : "Défaite"}</strong>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Results;