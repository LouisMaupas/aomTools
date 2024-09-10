import React, { useEffect, useState } from "react";
import { Modal, Row, Col, Card } from "antd";
import analyzeUnit from "../../utils/analyzeUnit";

const { Meta } = Card;

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

  // Fonction pour charger les types d'unités depuis database_unit_types.json
  const fetchUnitTypes = async () => {
    const response = await fetch("/database/database_unit_types.json");
    const data = await response.json();
    setUnitTypes(data.unit_types);
  };

  // Fonction pour charger toutes les unités depuis database_units.json
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

  // Mapper les ID aux noms des types d'unités
  const getTypeName = (typeId) => {
    const type = unitTypes.find((t) => t.id === typeId);
    return type ? type.name_fr || type.name_en : `Type ${typeId}`;
  };

  // Mapper les ID aux noms des unités
  const getUnitName = (unitId) => {
    const u = allUnits.find((unit) => unit.id === unitId);
    return u ? u.name_fr || u.name_en : `Unité ${unitId}`;
  };

  return (
    <Modal
      title={unit.name_fr || unit.name_en}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
    >
      <Row gutter={[16, 16]} style={{ marginBottom: "20px" }}>
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
                    {getTypeName(typeId)} {/* Mapping des noms des types */}
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
      <div>
        <h3>Forces et faiblesses</h3>
        {unit.name_fr} tape de type {analysisResult?.attack_type.join(", ")}
        <div>
          <h4>Faiblesses</h4>
          <ul>
            <li>
              {unit.name_fr} a une mauvaise armure de{" "}
              {analysisResult?.armor_weakness.join(", ")}
            </li>
            <li>
              {unit.name_fr} craint{" "}
              {analysisResult?.type_weakness
                .map((typeId) => getTypeName(typeId)) // Mapping des types faibles
                .join(", ")}
            </li>
          </ul>
        </div>
        <div>
          <h4>Forces</h4>
          {unit.name_fr} va massacrer :
          <ul>
            <li>
              {unit.name_fr} va massacrer les{" "}
              {analysisResult?.type_bonus
                .map((typeId) => getTypeName(typeId)) // Mapping des types forts
                .join(", ")}
              <br />
              et les{" "}
              {analysisResult?.attack_bonus
                .map((unitId) => getUnitName(unitId)) // Mapping des unités bonus
                .join(", ")}
            </li>
          </ul>
        </div>
      </div>
      <div>
        <h3>Unités qui contre {unit.name_fr}</h3>
        <span>
          <i>En cours d'implémentation</i>
        </span>
      </div>
    </Modal>
  );
};

export default CounterToolModal;
