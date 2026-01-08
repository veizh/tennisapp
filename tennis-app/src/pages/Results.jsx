import { useEffect, useState } from "react";
import scrapping from "../utils/scrapping_tool";

const Results = () => {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await scrapping(); // attend la réponse du backend
      console.log("Matches :", data);
      setMatches(data); // sauvegarde dans le state pour affichage
      console.log('====================================');
      console.log(Date.now());
      console.log('====================================');
    };

    fetchData();
  }, []);

  return (
    <>
      <h2>Résultats de Sinner</h2>
      <ul>
        {matches.map((match, i) => (
          <li key={i}>
            {match.Date} - {match.Opponent} - {match.Score} - {match.won ? "Won" : "Lost"}
          </li>
        ))}
      </ul>
    </>
  );
};

export default Results;

