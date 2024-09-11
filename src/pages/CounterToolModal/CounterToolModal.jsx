import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Card, Collapse, Typography } from "antd";
import { useTranslation } from "react-i18next";
import analyzeUnit from "../../utils/analyzeUnit";
import getBestUnits from "../../utils/getBestUnits";

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

const CounterToolModal = ({ unit, visible, onClose }) => {
  const [analysisResult, setAnalysisResult] = useState();
  const [unitTypes, setUnitTypes] = useState([]);
  const [allUnits, setAllUnits] = useState([]);
  const [bestUnits, setBestUnits] = useState([]);
  const { t } = useTranslation();

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
        const bestUnitsResult = await getBestUnits(unit, 5);
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
      <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "20px" }}>
        <Panel header="Détails de l'unité" key="1">
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card bordered={false}>
                <Meta
                  title="Type d'unité"
                  description={unit.type
                    .map((typeId) => (
                      <span key={typeId}>
                        <img
                          src={getUnitIcon(typeId)}
                          alt={`${typeId}`}
                          style={{ width: "24px", marginRight: "8px" }}
                        />
                        {getTypeName(typeId)}
                      </span>
                    ))
                    .reduce((prev, curr) => [prev, ", ", curr])}
                />
              </Card>
            </Col>
            <Col span={12}>
              <Card bordered={false}>
                <Meta title="Âge" description={`${unit.Age}`} />
              </Card>
            </Col>
          </Row>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "20px" }}>
        <Panel header="Forces et Faiblesses" key="1">
          <div>
            <Text strong>Type d'attaque : </Text>
            {analysisResult?.attack_type.join(", ")}
          </div>
          <div>
            <Title level={5}>Faiblesses</Title>
            <ul>
              <li>
                <Text strong>{unit.name_fr} a une mauvaise armure de : </Text>
                {analysisResult?.armor_weakness.join(", ")}
              </li>
              <li>
                <Text strong>{unit.name_fr} craint : </Text>
                {analysisResult?.type_weakness
                  .map((typeId) => getTypeName(typeId))
                  .join(", ")}
              </li>
            </ul>
          </div>
          <div>
            <Title level={5}>Forces</Title>
            <ul>
              <li>
                <Text strong>{unit.name_fr} va massacrer : </Text>
                {analysisResult?.type_bonus
                  .map((typeId) => getTypeName(typeId))
                  .join(", ")}
                <br />
                <Text strong>Bonus contre : </Text>
                {analysisResult?.attack_bonus
                  .map((unitId) => getUnitName(unitId))
                  .join(", ")}
              </li>
            </ul>
          </div>
        </Panel>
      </Collapse>

      <Collapse defaultActiveKey={["1"]} style={{ marginBottom: "20px" }}>
        <Panel header={`Unités qui contre ${unit.name_fr}`} key="1">
          <ul>
            {bestUnits.map((bestUnit) => (
              <li key={bestUnit.id}>
                <Text strong>{t(bestUnit.name_fr || bestUnit.name_en)}</Text> -{" "}
                {t("trained_at")}: {getTrainingBuildings(bestUnit.trained_at)} -{" "}
                {t("age")}: {bestUnit.Age}
              </li>
            ))}
          </ul>
        </Panel>
      </Collapse>
    </Modal>
  );
};

export default CounterToolModal;
