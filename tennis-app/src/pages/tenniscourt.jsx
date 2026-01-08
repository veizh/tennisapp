import React, { useState, useRef, useEffect } from "react";
import { Loading } from "../component/loading";
import { useNavigate } from "react-router-dom";
const TennisCourt = ({ player1, player2, onSelectSide, width = 352.5, height = 731 / 1.3 }) => {
  const canvasRef = useRef(null);
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = "/tennis_court_v.png";

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Afficher player1 en haut
        ctx.fillStyle = "whitesmoke";
        ctx.font = "bold 22px Arial ";
        ctx.textAlign = "center";
        ctx.fillText(player1?player1:"Player 1", canvas.width / 2, 80);
      

      // Afficher player2 en bas
        ctx.fillStyle = "whitesmoke";
        ctx.font = "bold 22px Arial ";
        ctx.textAlign = "center";
        ctx.fillText(player2?player2:"Player 2", canvas.width / 2, canvas.height - 80);
      
    };
  };

  // Redessiner quand player1 ou player2 change
  useEffect(() => {
    drawCanvas();
  }, [player1, player2]);

  const handleClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;

    if (y < rect.height / 2) {
      onSelectSide("player1");
    } else {
      onSelectSide("player2");
    }
  };

  return <canvas ref={canvasRef} width={width} height={height} onClick={handleClick} />;
};

const Simulations = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSelect, setActiveSelect] = useState(null);
  const [search, setSearch] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
    const [isLoading,setIsLoading]=useState(false)
  const Navigate =useNavigate()
  const items = [
    { id: 1, name: "Novak Djokovic" },
    { id: 2, name: "Rafael Nadal" },
    { id: 3, name: "Roger Federer" },
    { id: 4, name: "Carlos Alcaraz" },
    { id: 5, name: "Jannik Sinner" },
    { id: 6, name: "Daniil Medvedev" },
    { id: 7, name: "Alexander Zverev" },
    { id: 8, name: "Stefanos Tsitsipas" },
    { id: 9, name: "Casper Ruud" },
    { id: 10, name: "Andrey Rublev" },
    { id: 11, name: "Taylor Fritz" },
    { id: 12, name: "Holger Rune" },
    { id: 13, name: "Hubert Hurkacz" },
    { id: 14, name: "Frances Tiafoe" },
    { id: 15, name: "Tommy Paul" },
    { id: 16, name: "Ben Shelton" },
    { id: 17, name: "Alex de Minaur" },
    { id: 18, name: "Grigor Dimitrov" },
    { id: 19, name: "Stan Wawrinka" },
    { id: 20, name: "Gaël Monfils" },
  ];
  function run (player1,player2){
    if(!player1 || !player2){
      return window.alert('Veuillez choisir des joueurs')
    }{
      return  Navigate('/results')
    }
  }
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelectPlayer = (name) => {
    if (activeSelect === "player1") setPlayer1(name);
    if (activeSelect === "player2") setPlayer2(name);
    setIsOpen(false);
    setSearch("");
  };

  const handleCanvasClick = (side) => {
    setActiveSelect(side);
    setIsOpen(true);
  };
  if(isLoading)return <Loading />
  return (
    <div className="select__component">
      <h2>Veuillez choisir les deux adversaires pour la prediction</h2>

      <TennisCourt
        player1={player1}
        player2={player2}
        onSelectSide={handleCanvasClick}
        width={352.5}
        height={731 / 1.3}
      />
        <div className="btn__run" onClick={()=>{run(player1,player2)}}>Calculer les Odds</div>
      {isOpen && (
        <div className="options__component" onClick={() => setIsOpen(false)}>
          <div className="option__list" onClick={(e) => e.stopPropagation()}>
            <input
              type="text"
              placeholder="Rechercher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ul className="list">
              {filteredItems.map((item) => (
                <li key={item.id}onClick={() => handleSelectPlayer(item.name)}>
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulations;
