import React, { useState, useEffect } from 'react';
import { Card, Row, Col } from 'antd';
import useCounterToolStore from '../../store/counterTool';
import './CounterTool.css'; 

const { Meta } = Card;

const CounterTool = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [civilizations, setCivilizations] = useState([]);
  const [units, setUnits] = useState([]);
  const { userCivilization } = useCounterToolStore(); // Récupérer la civilisation de l'utilisateur depuis Zustand

  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const response = await fetch('/database/database_civ.json'); // Charger les données depuis le fichier JSON
        const data = await response.json();
        setCivilizations(data.civilizations);

        // Fusionner toutes les unités des civilisations dans un seul tableau
        const allUnits = data.civilizations.flatMap((civ) => civ.units);
        setUnits(allUnits);
      } catch (error) {
        console.error('Erreur lors du chargement des civilisations:', error);
      }
    };

    fetchCivilizations();
  }, []);

  // Fonction pour gérer le changement dans la barre de recherche
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Filtrer les unités en fonction de la barre de recherche
  const filteredUnits = units.filter((unit) =>
    unit && unit.name?.toLowerCase().includes(searchQuery.toLowerCase()) // Vérification que `unit` et `unit.name` sont définis
  );

  // Fonction pour gérer le clic sur une carte
  const handleCardClick = (unit) => {
    if (!unit['countered-by']) {
      alert('Aucune unité ne contre cette unité.');
      return;
    }

    // Trouver les unités qui ont leur ID dans 'countered-by' et appartiennent à la civilisation de l'utilisateur
    const counterUnits = units.filter((u) =>
      u && unit['countered-by'].includes(u?.id) && u.civilization === userCivilization // Vérification de `u`
    );

    // Extraire les noms des unités trouvées
    const counterUnitNames = counterUnits.map((u) => u?.name).filter(Boolean); // Vérification que name est défini

    // Afficher les unités contrées par celles-ci
    if (counterUnitNames.length > 0) {
      alert(`Unités contre cette unité: ${counterUnitNames.join(', ')}`);
    } else {
      alert("Aucune unité de votre civilisation ne contre cette unité.");
    }
  };

  return (
    <div>
      <h1>Recherche d'unités</h1>
      <input
        type="text"
        placeholder="Recherchez une unité..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      {/* Grille de cartes */}
      <Row gutter={[16, 16]} className="grid-container">
        {filteredUnits.map((unit) => (
          <Col key={unit?.id} xs={24} sm={12} md={8} lg={6}>
            <Card
              hoverable
              onClick={() => handleCardClick(unit)}
              style={{ width: 240 }}
            >
              <Meta
                title={unit?.name} // Vérification que `unit` est défini
                description={`Type: ${unit?.type} | Attaque: ${unit?.attack} | Défense: ${unit?.defense}`} // Vérifications sur `unit`
              />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default CounterTool;
