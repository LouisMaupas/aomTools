import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useStore from '../../store/store'; // Utiliser le store combiné

const CounterToolSelect = () => {
  const [civilizations, setCivilizations] = useState([]);
  const {
    userCivilization,
    setUserCivilization,
    opponentCivilizations,
    addOpponentCivilization,
    removeOpponentCivilization,
    updateOpponentCivilization,
  } = useStore(); // Utiliser Zustand pour récupérer les méthodes

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const response = await fetch('/database/database_civ.json'); // Charger les données
        const data = await response.json();
        setCivilizations(data.civilizations);
      } catch (error) {
        console.error('Erreur lors du chargement des civilisations:', error);
      }
    };

    fetchCivilizations();
  }, []);

  // Fonction pour gérer la confirmation et rediriger vers la page suivante
  const handleConfirmSelection = () => {
    if (opponentCivilizations.length === 0 || !userCivilization) {
      alert('Veuillez sélectionner au moins une civilisation d\'adversaire et la vôtre.');
    } else {
      navigate('/counter-tool');
    }
  };

  return (
    <div>
      <h1>Counter Tool</h1>

      {/* Section de sélection des civilisations d'adversaires */}
      <div>
        <h2>Sélectionnez les civilisations des adversaires</h2>
        {opponentCivilizations.map((civilization, index) => (
          <div key={index}>
            <label>
              Adversaire {index + 1} :
              <select
                value={civilization}
                onChange={(e) => updateOpponentCivilization(index, e.target.value)}
              >
                <option value="">Sélectionner une civilisation</option>
                {civilizations.map((civ) => (
                  <option key={civ.id} value={civ.name}>
                    {civ.name}
                  </option>
                ))}
              </select>
            </label>
            <button onClick={() => removeOpponentCivilization(index)}>Retirer</button>
          </div>
        ))}
        <button onClick={addOpponentCivilization}>Ajouter un adversaire</button>
      </div>

      {/* Section de sélection de la civilisation du joueur */}
      <div>
        <h2>Votre civilisation</h2>
        <label>
          Sélectionner votre civilisation :
          <select
            value={userCivilization}
            onChange={(e) => setUserCivilization(e.target.value)} // Mettre à jour la civilisation de l'utilisateur
          >
            <option value="">Sélectionner une civilisation</option>
            {civilizations.map((civ) => (
              <option key={civ.id} value={civ.name}>
                {civ.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* Bouton pour confirmer les sélections */}
      <button onClick={handleConfirmSelection}>Confirmer et obtenir des conseils</button>
    </div>
  );
};

export default CounterToolSelect;
