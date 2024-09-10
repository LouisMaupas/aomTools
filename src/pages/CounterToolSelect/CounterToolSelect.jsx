import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Button} from "antd"
import useStore from "../../store/store";

const CounterToolSelect = () => {
  const [civilizations, setCivilizations] = useState([]);
  const {
    userCivilization,
    setUserCivilization,
    opponentCivilizations,
    addOpponentCivilization,
    removeOpponentCivilization,
    updateOpponentCivilization,
  } = useStore(); 

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const response = await fetch("/database/database_civ.json"); 
        const data = await response.json();
        setCivilizations(data.civilizations);
      } catch (error) {
        console.error("Erreur lors du chargement des civilisations:", error);
      }
    };

    fetchCivilizations();
  }, []);


  const handleConfirmSelection = () => {
    if (opponentCivilizations.length === 0 || !userCivilization) {
      alert(
        "Veuillez sélectionner au moins une civilisation d'adversaire et la vôtre."
      );
    } else {
      navigate("/counter-tool");
    }
  };

  return (
    <div>
      <h1>Counter Tool</h1>

      <Button type="primary" danger onClick={()=> navigate("/counter-tool")}>OSEF GO COUNTER TOOL</Button>

      <div>
        <h2>Sélectionnez les civilisations des adversaires</h2>
        {opponentCivilizations.map((civilization, index) => (
          <div key={index}>
            <label>
              Adversaire {index + 1} :
              <select
                value={civilization}
                onChange={(e) =>
                  updateOpponentCivilization(index, e.target.value)
                }
              >
                <option value="">Sélectionner une civilisation</option>
                {civilizations.map((civ) => (
                  <option key={civ.id} value={civ.name_fr}>
                    {civ.name_fr}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => removeOpponentCivilization(index)}>
              Retirer
            </button>
          </div>
        ))}
        <button onClick={addOpponentCivilization}>Ajouter un adversaire</button>
      </div>

      <div>
        <h2>Votre civilisation</h2>
        <label>
          Sélectionner votre civilisation :
          <select
            value={userCivilization}
            onChange={(e) => setUserCivilization(e.target.value)}
          >
            <option value="">Sélectionner une civilisation</option>
            {civilizations.map((civ) => (
              <option key={civ.id} value={civ.name_fr}>
                {civ.name_fr}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button onClick={handleConfirmSelection}>
        Confirmer et obtenir des conseils
      </button>
    </div>
  );
};

export default CounterToolSelect;
