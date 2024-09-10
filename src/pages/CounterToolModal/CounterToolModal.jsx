import React from "react";
import { Modal, Row, Col, Card } from "antd";

const { Meta } = Card;

const CounterToolModal = ({ unit, visible, onClose }) => {
  const unitTypeIcons = {
    1: "/img/infantry_icon.jpg",
    2: "/img/infantry_icon.jpg",
    3: "/img/infantry_icon.jpg",
    4: "/img/infantry_icon.jpg",
  };

  const getUnitIcon = (typeId) => {
    return unitTypeIcons[typeId] || null;
  };

  return (
    <Modal
      title={unit.name_fr || unit.name_en}
      visible={visible}
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

      <h3>Unités qui contre {unit.name_fr}</h3>
      <ul></ul>
    </Modal>
  );
};

export default CounterToolModal;
