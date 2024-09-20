import { useEffect, useState } from "react";
import {
  Modal,
  Row,
  Col,
  Card,
  Collapse,
  Typography,
  Spin,
  Switch,
  Tooltip,
} from "antd";
import { useTranslation } from "react-i18next";
import analyzeUnit from "../../utils/analyzeUnit";
import getBestUnits from "../../utils/getBestUnits";
import { InfoCircleOutlined } from "@ant-design/icons";
import { getWeaponFromArmors, translateWeapons } from "../../utils/misc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFan,
  faShield,
  faTags,
  faThumbsDown,
  faThumbsUp,
} from "@fortawesome/free-solid-svg-icons";

const { Meta } = Card;
const { Panel } = Collapse;
const { Text, Title } = Typography;

const unitTypeIcons = {
  1: "/img/infantry_icon.jpg",
  2: "/img/infantry_icon.jpg",
  3: "/img/infantry_icon.jpg",
  4: "/img/infantry_icon.jpg",
};

const getUnitIcon = (typeId) => {
  return unitTypeIcons[typeId] || null;
};

const CounterToolModal = ({
  unit,
  visible,
  onClose,
  age,
  civ,
  encyclopedia,
}) => {
  const [analysisResult, setAnalysisResult] = useState();
  const [unitTypes, setUnitTypes] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [bestUnits, setBestUnits] = useState([]);
  const [switchChecked, setSwitchChecked] = useState(false);
  const { i18n, t } = useTranslation();

  const fetchUnitTypes = async () => {
    const response = await fetch("/database/database_unit_types.json");
    const data = await response.json();
    setUnitTypes(data.unit_types);
  };

  const fetchUnits = async () => {
    const response = await fetch("/database/database_units.json");
    const data = await response.json();
    setAllUnits(data.units);
  };

  useEffect(() => {}, [switchChecked]);

  useEffect(() => {
    fetchUnitTypes();
    fetchUnits();
  }, []);

  useEffect(() => {
    const analyze = async () => {
      const result = await analyzeUnit(unit);
      setAnalysisResult(result);
    };

    if (unit) {
      analyze();
    }
  }, [unit]);

  useEffect(() => {
    const fetchBestUnits = async () => {
      if (unit) {
        const bestUnitsResult = await getBestUnits(unit, 5, age, civ);
        setBestUnits(bestUnitsResult);
      }
    };

    fetchBestUnits();
  }, [unit]);

  const getTypeName = (typeId) => {
    const type = unitTypes.find((t) => t.id === typeId);
    return type ? type.name_fr || type.name_en : `Type ${typeId}`;
  };

  const getUnitName = (unitId) => {
    const u = allUnits.find((unit) => unit.id === unitId);
    return u ? u.name_fr || u.name_en : `Unité ${unitId}`;
  };

  const getTrainingBuildings = (trainedAtArray) => {
    return trainedAtArray && trainedAtArray.length
      ? trainedAtArray.join(", ")
      : t("unknown");
  };

  return (
    <Modal
      title={unit.name_fr || unit.name_en}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Collapse style={{ marginBottom: "20px" }}>
        <Panel
          header={
            <>
              {" "}
              <FontAwesomeIcon icon={faTags} />{" "}
              <Text strong> {t("Détails de")} </Text>
              {unit.name_fr}
            </>
          }
          key="1"
        >
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card bordered={false}>
                <Meta
                  title={t("Types")}
                  description={unit.type
                    .map((typeId) => (
                      <span key={typeId}>
                        {/* <img
                          src={getUnitIcon(typeId)}
                          alt={`${typeId}`}
                          style={{ width: "24px", marginRight: "8px" }}
                        /> */}
                        {getTypeName(typeId)}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr], [])}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Meta title={t("Âge")} description={`${unit.Age}`} />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Meta
                  title={t("Trained at")}
                  description={`${unit.trained_at}`}
                />
              </Card>
            </Col>
          </Row>
        </Panel>
      </Collapse>
      {analysisResult ? (
        <>
          <Collapse style={{ marginBottom: "20px" }}>
            <Panel
              header={
                <>
                  <FontAwesomeIcon icon={faThumbsUp} color="" />{" "}
                  <FontAwesomeIcon icon={faThumbsDown} color="" />{" "}
                  <Text strong> {t("Forces et Faiblesses de")} </Text>
                  {unit.name_fr}
                </>
              }
              key="1"
            >
              <Switch
                checkedChildren={t("Résumé")}
                unCheckedChildren={t("Détails")}
                defaultChecked
                onChange={() => setSwitchChecked(!switchChecked)}
              />
              {!switchChecked ? (
                <>
                  <div>
                    <Text strong>
                      {t("Type d'attaque de ")} {unit.name_en} :{" "}
                    </Text>
                    {analysisResult?.attack_type &&
                      translateWeapons(
                        analysisResult?.attack_type,
                        i18n.language
                      ).join(", ")}
                    .
                  </div>
                  <div>
                    <Title level={5}>
                      {" "}
                      <FontAwesomeIcon icon={faThumbsUp} color="green" />{" "}
                      {t("Faiblesses")}
                    </Title>
                    <ul>
                      <li>
                        {t("Les dégâts de type ")} :
                        <br />
                        <Text strong>
                          {analysisResult?.armor_weakness &&
                            getWeaponFromArmors(
                              analysisResult?.armor_weakness,
                              i18n.language
                            ).join(", ")}
                        </Text>
                        <br />
                        {t(" sont efficace contre ")}
                        {unit.name_fr}
                      </li>
                      <li>
                        {unit.name_fr} {t("craint")} :
                        <br />
                        <Text strong>
                          {analysisResult?.type_weakness
                            .map((typeId) => getTypeName(typeId))
                            .join(", ")}
                          .
                        </Text>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Title level={5}>
                      {" "}
                      <FontAwesomeIcon icon={faThumbsDown} color="red" />{" "}
                      {t("Forces")}
                    </Title>
                    <ul>
                      <li>
                        {unit.name_fr} {t("contre les")} :{" "}
                        <Text strong>
                          {analysisResult?.attack_bonus
                            .map((unitId) => getUnitName(unitId))
                            .join(", ")}
                        </Text>
                        <br />
                        {unit.name_fr} {t("a un bonus contre les")} :{" "}
                        <Text strong>
                          {analysisResult?.type_bonus
                            .map((typeId) => getTypeName(typeId))
                            .join(", ")}
                        </Text>
                      </li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <Text strong>
                      {t("Type")}
                      {unit?.type > 1 && "s"} :{" "}
                    </Text>
                    {unit?.type?.map((typeId) => (
                      <span key={typeId}>
                        {getTypeName(typeId)}
                        {typeId !== unit?.type[unit.type.length - 1] && ", "}
                      </span>
                    ))}
                  </div>

                  <div>
                    <Title level={5}>
                      {" "}
                      <FontAwesomeIcon icon={faShield} color="grey" />{" "}
                      {t("Armures")}
                    </Title>
                    <ul>
                      <li>
                        <Text strong>{t("Hack Armor")}: </Text>
                        {unit?.armors?.armor_hack}%
                      </li>
                      <li>
                        <Text strong>{t("Pierce Armor")}: </Text>
                        {unit?.armors?.armor_pierce}%
                      </li>
                      <li>
                        <Text strong>{t("Crush Armor")}: </Text>
                        {unit?.armors?.armor_crush}%
                      </li>
                    </ul>
                  </div>

                  <div>
                    <Title level={5}>
                      {" "}
                      <FontAwesomeIcon icon={faFan} /> {t("Attaques")}
                    </Title>
                    <ul>
                      <li>
                        <Text strong>{t("Hack Damage")}: </Text>
                        {unit?.attacks?.hack}
                      </li>
                      <li>
                        <Text strong>{t("Pierce Damage")}: </Text>
                        {unit?.attacks?.pierce}
                      </li>
                      <li>
                        <Text strong>{t("Crush Damage")}: </Text>
                        {unit?.attacks?.crush}
                      </li>
                      {Object.keys(unit?.attacks || {})
                        .filter((attackKey) => attackKey.startsWith("attack_"))
                        .map((attackKey) => {
                          const attackValue = unit.attacks[attackKey];
                          const unitTypeId = unit.attacks[attackKey][0];

                          const bonusPercentage = attackKey.split("_")[1];

                          const unitTypeName = getTypeName(unitTypeId);
                          return (
                            <li key={attackKey}>
                              <Text strong>
                                {t("Bonus Damage")} (x {bonusPercentage}%):{" "}
                              </Text>
                              {unitTypeName ? unitTypeName : t("Unknown Type")}
                            </li>
                          );
                        })}
                    </ul>
                  </div>
                </>
              )}
            </Panel>
          </Collapse>

          <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "20px" }}>
            <Panel
              header={
                <span>
                  {unit.name_fr} <Text strong>{t("est contré par... ")} </Text>
                  <Tooltip
                    title={t(
                      `Le calcul se base sur le type d'armure le plus faible de ${unit.name_fr}.`
                    )}
                  >
                    <InfoCircleOutlined style={{ marginLeft: 8 }} />
                  </Tooltip>
                </span>
              }
              key="1"
            >
              <ul>
                {bestUnits.map((bestUnit) => (
                  <li key={bestUnit.id}>
                    <Text strong>
                      {t(bestUnit.name_fr || bestUnit.name_en)}
                    </Text>{" "}
                    {t("trained at age")} {bestUnit.Age} {"on"}{" "}
                    <Text strong>
                      {getTrainingBuildings(bestUnit.trained_at)}
                    </Text>
                    .
                  </li>
                ))}
              </ul>
            </Panel>
          </Collapse>
        </>
      ) : (
        <div>
          <Spin /> {t("Loading ....")}
        </div>
      )}
    </Modal>
  );
};

export default CounterToolModal;
