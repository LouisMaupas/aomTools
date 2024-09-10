import { useState, useEffect } from "react";
import { Card, Row, Col, Checkbox, Button, AutoComplete } from "antd";
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
  const { userCivilization, opponentCivilizations } = useCounterToolStore();
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const [filteredUnits, setFilteredUnits] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const handleOpenModal = (unit) => {
    setSelectedUnit(unit);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedUnit(null);
  };

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
        setFilteredUnits(unitData.units);

        // Charger les types d'unités
        const typesResponse = await fetch("/database/database_unit_types.json");
        const typesData = await typesResponse.json();
        setUnitTypes(typesData.unit_types);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchData();
  }, []);

  const getUnitTypeNames = (typeIds) => {
    return typeIds
      .map((typeId) => {
        const type = unitTypes.find((t) => t.id === typeId);
        return type ? type.name_fr : "Type inconnu";
      })
      .join(", ");
  };

  const handleSearch = (value) => {
    setSearchValue(value);

    const filtered = units.filter(
      (unit) =>
        unit.name_fr?.toLowerCase().includes(value.toLowerCase()) ||
        unit.name_en?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredUnits(filtered);
  };

  return (
    <div>
      <h1>Recherche d'unités</h1>

      <AutoComplete
        style={{ width: 300, marginBottom: 20 }}
        value={searchValue}
        onChange={handleSearch}
        placeholder="Recherchez une unité..."
        options={filteredUnits.map((unit) => ({
          value: unit.name_fr || unit.name_en,
          label: unit.name_fr || unit.name_en,
        }))}
      />

      <div>
        <h2>Votre civilisation: {userCivilization || "Inconnue"}</h2>
        <Checkbox
          defaultChecked={displayOnlyUserUnits}
          onChange={(e) => setDisplayOnlyUserUnits(e.target.checked)}
          disabled={true}
        >
          Afficher seulement les unités de votre civilisation dans les unités de
          contre.
        </Checkbox>
        <div>Vous êtes à l'âge : {userAge}</div>
        <Button
          onClick={() =>
            userAge < 4 ? setUserAge(userAge + 1) : setUserAge(1)
          }
        >
          Avancer d'un âge
        </Button>
        <Checkbox
          defaultChecked={displayOnlyUserUnitsAgeOrLess}
          onChange={(e) => setDisplayOnlyUserUnitsAgeOrLess(e.target.checked)}
          disabled={true}
        >
          Afficher seulement les unités de votre âge ou moins dans les unités de
          contre.
        </Checkbox>
      </div>

      <div>
        <h3>Civilisations des adversaires:</h3>
        <ul>
          {opponentCivilizations.map((civId, index) => {
            const civ = allCivilizations.find((c) => c.id === civId);
            return <li key={index}>{civ ? civ.name : "Inconnu"}</li>;
          })}
        </ul>
        <Checkbox
          defaultChecked={displayOnlyOpponentUnits}
          onChange={(e) => setDisplayOnlyOpponentUnits(e.target.checked)}
          disabled={true}
        >
          Afficher seulement les unités de(s) (l')opposant(s)
        </Checkbox>
      </div>

      <Row gutter={[16, 16]} className="grid-container">
        {filteredUnits.map((unit) => (
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
