import { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  Checkbox,
  Button,
  AutoComplete,
  Typography,
  Collapse,
} from "antd";
import useCounterToolStore from "../../store/counterTool";
import CounterToolModal from "../CounterToolModal/CounterToolModal";
import "./counterTool.css";
import { useTranslation } from "react-i18next";

const { Meta } = Card;
const { Title, Text } = Typography;
const { Panel } = Collapse;

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
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filteredUnits, setFilteredUnits] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();

  const [userCivilization, setUserCivilization] = useState(null);
  const [opponentCivilizations, setOpponentCivilizations] = useState([]);

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
        console.error("Error loading data : ", error);
      }
    };

    fetchData();

    const currentCivData = localStorage.getItem("current_civilisations");
    if (currentCivData) {
      const parsedCivData = JSON.parse(currentCivData);
      setUserCivilization(parsedCivData.user);
      setOpponentCivilizations(parsedCivData.opponents || []);
    }
  }, []);

  const getUnitTypeNames = (typeIds) => {
    return typeIds
      .map((typeId) => {
        const type = unitTypes.find((t) => t.id === typeId);
        return type ? type.name_fr : t("Type inconnu");
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

  const getCivilizationName = (civId) => {
    const civ = allCivilizations.find((c) => c.id === civId);
    return civ ? civ.name_fr || civ.name_en : t("Inconnu");
  };

  return (
    <div style={{ padding: "10px" }}>
      <Title level={2}>{t("Recherche d'unités")}</Title>

      <Collapse style={{ marginBottom: 20 }}>
        <Panel header={t("Informations sur les civilisations")} key="1">
          <Card>
            <Row gutter={16} align="middle">
              <Col span={12}>
                <Text strong>{t("Votre civilisation")}:</Text>
                <div>
                  {getCivilizationName(userCivilization) || t("Inconnue")}
                </div>
                <div style={{ marginTop: 10 }}>
                  <Text>
                    {t("Vous êtes à l'âge")} : {userAge}
                  </Text>
                  <Button
                    type="primary"
                    block
                    size="small"
                    onClick={() =>
                      userAge < 4 ? setUserAge(userAge + 1) : setUserAge(1)
                    }
                    style={{ marginTop: 5 }}
                  >
                    {t("Avancer d'un âge")}
                  </Button>
                </div>
              </Col>

              <Col span={12}>
                <Text strong>{t("Civilisations des adversaires")}:</Text>
                <ul style={{ paddingLeft: 20, marginTop: 5 }}>
                  {opponentCivilizations.map((civId, index) => (
                    <li key={index}>{getCivilizationName(civId)}</li>
                  ))}
                </ul>
              </Col>
            </Row>

            <div style={{ marginTop: 10 }}>
              <Checkbox
                defaultChecked={displayOnlyUserUnits}
                onChange={(e) => setDisplayOnlyUserUnits(e.target.checked)}
                disabled={true}
              >
                {t("Afficher seulement les unités de votre civilisation")}
              </Checkbox>
              <Checkbox
                style={{ marginLeft: 15 }}
                defaultChecked={displayOnlyUserUnitsAgeOrLess}
                onChange={(e) =>
                  setDisplayOnlyUserUnitsAgeOrLess(e.target.checked)
                }
                disabled={true}
              >
                {t("Afficher seulement les unités de votre âge ou moins")}
              </Checkbox>
            </div>

            <div style={{ marginTop: 10 }}>
              <Checkbox
                defaultChecked={displayOnlyOpponentUnits}
                onChange={(e) => setDisplayOnlyOpponentUnits(e.target.checked)}
                disabled={true}
              >
                {t("Afficher seulement les unités des adversaires")}
              </Checkbox>
            </div>
          </Card>
        </Panel>
      </Collapse>

      <AutoComplete
        style={{ width: "100%", marginBottom: 20 }}
        value={searchValue}
        onChange={handleSearch}
        placeholder={t("Recherchez une unité...")}
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
                description={`Type: ${getUnitTypeNames(unit.type)} | Âge : ${
                  unit.Age
                }`}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {selectedUnit && (
        <CounterToolModal
          unit={selectedUnit}
          age={userAge}
          civ={userCivilization}
          visible={modalVisible}
          onClose={handleCloseModal}
          encyclopedia={false}
        />
      )}
    </div>
  );
};

export default CounterTool;
