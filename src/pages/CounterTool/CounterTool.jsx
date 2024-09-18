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
import CounterToolModal from "../CounterToolModal/CounterToolModal";
import "./counterTool.css";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChessPawn,
  faHourglass,
  faHourglass1,
  faHourglassEnd,
  faMagnifyingGlass,
  faPlus,
  faPlusCircle,
  faSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faHourglass2 } from "@fortawesome/free-solid-svg-icons/faHourglass2";

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
  const [unitsToDisplay, setUnitsToDisplay] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const { t } = useTranslation();

  const [userCivilization, setUserCivilization] = useState(null);
  const [opponentCivilizations, setOpponentCivilizations] = useState([]);

  useEffect(() => {
    const fetchFilteredUnits = async () => {
      try {
        const unitResponse = await fetch("/database/database_units.json");
        const unitData = await unitResponse.json();

        const filteredUnits = displayOnlyOpponentUnits
          ? unitData.units.filter((unit) =>
              opponentCivilizations.includes(unit.civilization)
            )
          : unitData.units;

        setUnits(unitData.units);
      } catch (error) {
        console.error("Erreur lors du chargement des unités: ", error);
      }
    };

    if (opponentCivilizations.length > 0) {
      fetchFilteredUnits();
    }
  }, [displayOnlyOpponentUnits, opponentCivilizations]);

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

        const filteredUnits = displayOnlyOpponentUnits
          ? unitData.units.filter((unit) =>
              opponentCivilizations.includes(unit.civilization)
            )
          : unitData.units;

        setUnits(unitData.units);
        setFilteredUnits(filteredUnits);

        const typesResponse = await fetch("/database/database_unit_types.json");
        const typesData = await typesResponse.json();
        setUnitTypes(typesData.unit_types);
      } catch (error) {
        console.error("Erreur lors du chargement des données: ", error);
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

  useEffect(() => {
    const applyFilters = () => {
      const filtered = displayOnlyOpponentUnits
        ? units.filter((unit) =>
            opponentCivilizations.includes(unit.civilization)
          )
        : units;
      setFilteredUnits(filtered);
      setUnitsToDisplay(filtered);
    };

    if (units.length > 0) {
      applyFilters();
    }
  }, [units, displayOnlyOpponentUnits, opponentCivilizations]);

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

    const filtered = filteredUnits.filter(
      (unit) =>
        unit.name_fr?.toLowerCase().includes(value.toLowerCase()) ||
        unit.name_en?.toLowerCase().includes(value.toLowerCase())
    );
    setUnitsToDisplay(filtered);
  };

  const getCivilizationName = (civId) => {
    const civ = allCivilizations.find((c) => c.id === civId);
    return civ ? civ.name_fr || civ.name_en : t("Inconnu");
  };

  return (
    <div style={{ padding: "10px" }}>
      <Title level={2}>
        <FontAwesomeIcon icon={faMagnifyingGlass} />
        {""}
        {t("Recherche d'unités")}
      </Title>

      <Collapse style={{ marginBottom: 20 }}>
        <Panel header={t("Informations sur les civilisations")} key="1">
          <Card>
            <Row gutter={16} align="middle">
              <Col span={12}>
                <FontAwesomeIcon icon={faUser} />{" "}
                <Text strong>{t("Votre civilisation")}:</Text>
                <div>
                  {getCivilizationName(userCivilization) || t("Inconnue")}
                </div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ marginTop: 10 }}>
                    <Checkbox
                      checked={displayOnlyOpponentUnits}
                      onChange={(e) =>
                        setDisplayOnlyOpponentUnits(e.target.checked)
                      }
                    >
                      <FontAwesomeIcon icon={faSkullCrossbones} />
                      {t(
                        "Afficher seulement les unités potentielles des adversaires"
                      )}
                    </Checkbox>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <Checkbox
                      checked={displayOnlyUserUnits}
                      onChange={(e) =>
                        setDisplayOnlyUserUnits(e.target.checked)
                      }
                    >
                      <FontAwesomeIcon icon={faUser} />
                      {t(
                        "Afficher comme unités de contre, seulement les unités de votre civilisation"
                      )}
                    </Checkbox>
                  </div>
                  <Checkbox
                    style={{ marginTop: 10 }}
                    checked={displayOnlyUserUnitsAgeOrLess}
                    onChange={(e) =>
                      setDisplayOnlyUserUnitsAgeOrLess(e.target.checked)
                    }
                  >
                    <FontAwesomeIcon icon={faHourglassEnd} />{" "}
                    {t(
                      "Afficher comme unités de contre, seulement les unités de votre âge ou moins"
                    )}
                  </Checkbox>
                  <Text
                    style={{
                      color: displayOnlyUserUnitsAgeOrLess ? "black" : "grey",
                    }}
                  >
                    {t("Vous êtes à l'âge")} :{" "}
                    <span style={{ fontWeight: "bolder" }}>{userAge}</span>
                  </Text>
                  <Button
                    type="primary"
                    block
                    size="small"
                    onClick={() =>
                      userAge < 4 ? setUserAge(userAge + 1) : setUserAge(1)
                    }
                    style={{ marginTop: 5 }}
                    disabled={!displayOnlyUserUnitsAgeOrLess}
                  >
                    <FontAwesomeIcon icon={faPlusCircle} />
                    {t("Avancer d'un âge")}
                  </Button>
                </div>
              </Col>

              <Col span={12}>
                <Text strong>
                  <FontAwesomeIcon icon={faSkullCrossbones} />
                  {t("Civilisations des adversaires")}:
                </Text>
                <ul style={{ paddingLeft: 20, marginTop: 5 }}>
                  {opponentCivilizations.map((civId, index) => (
                    <li key={index}>{getCivilizationName(civId)}</li>
                  ))}
                </ul>
              </Col>
            </Row>
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
        {unitsToDisplay.map((unit) => (
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
          age={displayOnlyUserUnitsAgeOrLess && userAge}
          civ={displayOnlyUserUnits && userCivilization}
          visible={modalVisible}
          onClose={handleCloseModal}
          encyclopedia={false}
        />
      )}
    </div>
  );
};

export default CounterTool;
