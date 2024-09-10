import React, { useState, useEffect } from "react";
import { Card, Row, Col, Checkbox, Button } from "antd";
import useCounterToolStore from "../../store/counterTool";
import CounterToolModal from "../CounterToolModal/CounterToolModal";
import "./counterTool.css";

const { Meta } = Card;

const CounterTool = () => {
  const [userAge, setUserAge] = useState(1);
  const [units, setUnits] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [allCivilizations, setAllCivilizations] = useState([]);
  const [displayOnlyUserUnits, setDisplayOnlyUserUnits] = useState(true);
  const [displayOnlyUserUnitsAgeOrLess, setDisplayOnlyUserUnitsAgeOrLess] =
    useState(false);
  const [displayOnlyOpponentUnits, setDisplayOnlyOpponentUnits] =
    useState(true);
  const { userCivilization, opponentCivilizations } = useCounterToolStore(); // Récupérer les civilisations via Zustand
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleOpenModal = (unit) => {
    setSelectedUnit(unit);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUnit(null);
  };

  // Charger les données des civilisations, unités et types d'unités
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les civilisations
        const civResponse = await fetch("/database/database_civ.json");
        const civData = await civResponse.json();
        setAllCivilizations(civData.civilizations);

        // Charger les unités
        const unitResponse = await fetch("/database/database_units.json");
        const unitData = await unitResponse.json();
        setUnits(unitData.units);

        // Charger les types d'unités
        const typesResponse = await fetch("/database/database_unit_types.json");
        const typesData = await typesResponse.json();
        setUnitTypes(typesData.unit_types); // Utiliser les types depuis le fichier
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  // Obtenir le nom de la civilisation choisie par l'utilisateur
  const userCivName =
    allCivilizations.find((civ) => civ.id === userCivilization)?.name ||
    "Inconnue";

  // Obtenir les noms des civilisations des adversaires (peut inclure "Inconnu" si non choisi)
  const opponentCivNames = opponentCivilizations.map((civId) => {
    const civ = allCivilizations.find((c) => c.id === civId);
    return civ ? civ.name : "Inconnu";
  });

  // Fonction pour obtenir le nom en français du type d'unité
  const getUnitTypeNames = (typeIds) => {
    return typeIds
      .map((typeId) => {
        const type = unitTypes.find((t) => t.id === typeId);
        return type ? type.name_fr : "Type inconnu";
      })
      .join(", ");
  };

  return (
    <div>
      <h1>Recherche d'unités</h1>

      {/* Affichage de la civilisation choisie par l'utilisateur */}
      <div>
        <h2>Votre civilisation: {userCivName}</h2>
        <Checkbox
          defaultChecked={displayOnlyUserUnits}
          onChange={(e) => setDisplayOnlyUserUnits(e.target.checked)}
          disabled={true}
        >
          Afficher seulement les unités de votre civilisation dans les unités de
          contre.
        </Checkbox>
        <div>Vous êtes à l'age : {userAge}</div>
        <Button
          onClick={() =>
            userAge < 4 ? setUserAge(userAge + 1) : setUserAge(1)
          }
        >
          Avancer d'un age
        </Button>
        <Checkbox
          defaultChecked={displayOnlyUserUnitsAgeOrLess}
          onChange={(e) => setDisplayOnlyUserUnitsAgeOrLess(e.target.checked)}
          disabled={true}
        >
          Afficher seulement les unités de votre age ou moins dans les unités de
          contre.
        </Checkbox>
      </div>

      {/* Affichage des civilisations des adversaires */}
      <div>
        <h3>Civilisations des adversaires:</h3>
        <ul>
          {opponentCivNames.map((civName, index) => (
            <li key={index}>{civName}</li>
          ))}
        </ul>
        <Checkbox
          defaultChecked={displayOnlyOpponentUnits}
          onChange={(e) => setDisplayOnlyOpponentUnits(e.target.checked)}
          disabled={true}
        >
          Afficher seulement les unités de(s) (l')opposant(s)
        </Checkbox>
      </div>

      {/* Affichage de la liste des unités */}
      <Row gutter={[16, 16]} className="grid-container">
        {units.map((unit) => (
          <Col
            key={unit.id}
            xs={24}
            sm={12}
            md={8}
            lg={6}
            onClick={() => handleOpenModal(unit)}
          >
            <Card hoverable style={{ width: 240 }}>
              <Meta
                title={unit.name_fr || unit.name_en}
                description={`Type: ${getUnitTypeNames(unit.type)}
                ${" "}
                 Age : ${unit.Age}
                `}
              />
            </Card>
          </Col>
        ))}
      </Row>
      {selectedUnit && (
        <CounterToolModal
          unit={selectedUnit}
          visible={modalVisible}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CounterTool;
