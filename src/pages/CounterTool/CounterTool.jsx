import { useState, useEffect } from "react";
import { Card, Row, Col, Checkbox, Button, AutoComplete, Typography, Collapse } from "antd";
import useCounterToolStore from "../../store/counterTool";
import CounterToolModal from "../CounterToolModal/CounterToolModal";
import "./counterTool.css";

const { Meta } = Card;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const CounterTool = () => {
  const [userAge, setUserAge] = useState(1);
  const [units, setUnits] = useState([]);
  const [unitTypes, setUnitTypes] = useState([]);
  const [allCivilizations, setAllCivilizations] = useState([]);
  const [displayOnlyUserUnits, setDisplayOnlyUserUnits] = useState(true);
  const [displayOnlyUserUnitsAgeOrLess, setDisplayOnlyUserUnitsAgeOrLess] = useState(false);
  const [displayOnlyOpponentUnits, setDisplayOnlyOpponentUnits] = useState(true);
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
        const civResponse = await fetch("/database/database_civ.json");
        const civData = await civResponse.json();
        setAllCivilizations(civData.civilizations);

        const unitResponse = await fetch("/database/database_units.json");
        const unitData = await unitResponse.json();
        setUnits(unitData.units);
        setFilteredUnits(unitData.units);

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
    <div style={{ padding: "10px" }}>
      <Title level={2}>Recherche d'unités</Title>

      <Collapse defaultActiveKey={["1"]} style={{ marginBottom: 20 }}>
        <Panel header="Informations sur les civilisations" key="1">
          <Card>
            <Row gutter={16} align="middle">
              <Col span={12}>
                <Text strong>Votre civilisation :</Text>
                <div>{userCivilization || "Inconnue"}</div>
                <div style={{ marginTop: 10 }}>
                  <Text>Vous êtes à l'âge : {userAge}</Text>
                  <Button
                    type="primary"
                    block
                    size="small"
                    onClick={() => (userAge < 4 ? setUserAge(userAge + 1) : setUserAge(1))}
                    style={{ marginTop: 5 }}
                  >
                    Avancer d'un âge
                  </Button>
                </div>
              </Col>

              <Col span={12}>
                <Text strong>Civilisations des adversaires :</Text>
                <ul style={{ paddingLeft: 20, marginTop: 5 }}>
                  {opponentCivilizations.map((civId, index) => {
                    const civ = allCivilizations.find((c) => c.id === civId);
                    return <li key={index}>{civ ? civ.name_fr || civ.name_en : "Inconnu"}</li>;
                  })}
                </ul>
              </Col>
            </Row>

            <div style={{ marginTop: 10 }}>
              <Checkbox
                defaultChecked={displayOnlyUserUnits}
                onChange={(e) => setDisplayOnlyUserUnits(e.target.checked)}
                disabled={true}
              >
                Afficher seulement les unités de votre civilisation
              </Checkbox>
              <Checkbox
                style={{ marginLeft: 15 }}
                defaultChecked={displayOnlyUserUnitsAgeOrLess}
                onChange={(e) => setDisplayOnlyUserUnitsAgeOrLess(e.target.checked)}
                disabled={true}
              >
                Afficher seulement les unités de votre âge ou moins
              </Checkbox>
            </div>

            <div style={{ marginTop: 10 }}>
              <Checkbox
                defaultChecked={displayOnlyOpponentUnits}
                onChange={(e) => setDisplayOnlyOpponentUnits(e.target.checked)}
                disabled={true}
              >
                Afficher seulement les unités des adversaires
              </Checkbox>
            </div>
          </Card>
        </Panel>
      </Collapse>

      <AutoComplete
        style={{ width: "100%", marginBottom: 20 }}
        value={searchValue}
        onChange={handleSearch}
        placeholder="Recherchez une unité..."
        options={filteredUnits.map((unit) => ({
          value: unit.name_fr || unit.name_en,
          label: unit.name_fr || unit.name_en,
        }))}
      />

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
            <Card hoverable style={{ width: "100%", marginBottom: 20 }}>
              <Meta
                title={unit.name_fr || unit.name_en}
                description={`Type: ${getUnitTypeNames(unit.type)} | Âge : ${unit.Age}`}
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
