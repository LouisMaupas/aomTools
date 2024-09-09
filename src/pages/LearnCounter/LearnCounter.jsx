import React, { useState, useEffect } from 'react';

const LearnCounter = () => {
  const [civilizations, setCivilizations] = useState([]);
  const [opponentCivilization, setOpponentCivilization] = useState('');
  const [opponentMajorGod, setOpponentMajorGod] = useState('');
  const [userCivilization, setUserCivilization] = useState('');
  const [userMajorGod, setUserMajorGod] = useState('');
  const [opponentGods, setOpponentGods] = useState([]);
  const [userGods, setUserGods] = useState([]);

  // Charger les données des civilisations depuis le fichier JSON (faux retour d'API)
  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const response = await fetch('/fakeDatabase.json');
        const data = await response.json();
        setCivilizations(data.civilizations);
      } catch (error) {
        console.error('Erreur lors du chargement des civilisations:', error);
      }
    };

    fetchCivilizations();
  }, []);

  // Mettre à jour les dieux majeurs lorsqu'une civilisation d'opposant est sélectionnée
  useEffect(() => {
    if (opponentCivilization) {
      const selectedCiv = civilizations.find((civ) => civ.name === opponentCivilization);
      if (selectedCiv) {
        setOpponentGods(selectedCiv.majorGods);
      }
    }
  }, [opponentCivilization, civilizations]);

  // Mettre à jour les dieux majeurs lorsque la civilisation de l'utilisateur est sélectionnée
  useEffect(() => {
    if (userCivilization) {
      const selectedCiv = civilizations.find((civ) => civ.name === userCivilization);
      if (selectedCiv) {
        setUserGods(selectedCiv.majorGods);
      }
    }
  }, [userCivilization, civilizations]);

  const handleStartQuiz = () => {
    // Logique du quiz à ajouter ici
    alert("Quiz démarré !");
  };

  return (
    <div>
      <h1>LearnCounter</h1>

      {/* Sélection de la civilisation ou dieu majeur de l'opposant */}
      <div>
        <h2>Opposant</h2>
        <label>
          Civilisation de l'opposant :
          <select
            value={opponentCivilization}
            onChange={(e) => setOpponentCivilization(e.target.value)}
          >
            <option value="">Sélectionner une civilisation</option>
            {civilizations.map((civ) => (
              <option key={civ.id} value={civ.name}>
                {civ.name}
              </option>
            ))}
          </select>
        </label>
        {opponentGods.length > 0 && (
          <label>
            Dieu majeur de l'opposant :
            <select
              value={opponentMajorGod}
              onChange={(e) => setOpponentMajorGod(e.target.value)}
            >
              <option value="">Sélectionner un dieu majeur</option>
              {opponentGods.map((god, index) => (
                <option key={index} value={god}>
                  {god}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Sélection de la civilisation ou dieu majeur de l'utilisateur */}
      <div>
        <h2>Votre Civilisation</h2>
        <label>
          Votre civilisation :
          <select
            value={userCivilization}
            onChange={(e) => setUserCivilization(e.target.value)}
          >
            <option value="">Sélectionner une civilisation</option>
            {civilizations.map((civ) => (
              <option key={civ.id} value={civ.name}>
                {civ.name}
              </option>
            ))}
          </select>
        </label>
        {userGods.length > 0 && (
          <label>
            Votre dieu majeur :
            <select
              value={userMajorGod}
              onChange={(e) => setUserMajorGod(e.target.value)}
            >
              <option value="">Sélectionner un dieu majeur</option>
              {userGods.map((god, index) => (
                <option key={index} value={god}>
                  {god}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {/* Bouton pour démarrer le quiz */}
      <button onClick={handleStartQuiz} disabled={!opponentMajorGod || !userMajorGod}>
        Démarrer le Quiz
      </button>
    </div>
  );
};

export default LearnCounter;
