import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, Typography, Row, Col, Card } from "antd";
import useStore from "../../store/store";

const { Title, Text } = Typography;
const { Option } = Select;

const CounterToolSelect = () => {
  const [civilizations, setCivilizations] = useState([]);
  const {
    userCivilization,
    setUserCivilization,
    opponentCivilizations,
    addOpponentCivilization,
    removeOpponentCivilization,
    updateOpponentCivilization,
    userInfos,
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const response = await fetch("/database/database_civ.json");
        const data = await response.json();
        setCivilizations(data.civilizations);
      } catch (error) {
        console.error("Erreur lors du chargement des civilisations:", error);
      }
    };

    fetchCivilizations();
  }, []);

  useEffect(() => {
    const localStorageUserInfos = localStorage.getItem("userInfos");
    if (localStorageUserInfos?.fav_civilization) {
      setUserCivilization(userInfos.fav_civilization);
    } else if (userInfos?.civilization) {
      setUserCivilization(userInfos.civilization);
    }
  }, [userInfos]);

  const handleConfirmSelection = () => {
    if (opponentCivilizations.length === 0 || !userCivilization) {
      alert(
        "Veuillez sélectionner au moins une civilisation d'adversaire et la vôtre."
      );
    } else {
      navigate("/counter-tool");
    }
  };

  const setCurrentCivilisation = () => {
    const localStorageUserInfos = localStorage.getItem("userInfos");
    const user_civ = localStorageUserInfos.fav_civilization;
    const current_civilizations = {
      user: user_civ, // FIXME vérifier que l'user n'a pas selectionner une courante civ si il en a pas alors on pernds localstorage
      opponents: [],
    };
    localStorage.setItem(
      "current_civilisations",
      JSON.stringify(current_civilizations)
    );
  };

  useEffect(() => {
    setCurrentCivilisation();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="center">
        <Col xs={24} md={20} lg={16}>
          <Card style={{ textAlign: "center", borderRadius: "10px" }}>
            <Title level={2}>Sélection des civilisations</Title>

            <div style={{ marginBottom: "20px" }}>
              <Text strong>
                Sélectionnez les civilisations des adversaires :
              </Text>
              {opponentCivilizations.map((civilization, index) => (
                <div key={index} style={{ margin: "10px 0" }}>
                  <Row gutter={[16, 16]}>
                    <Col span={18}>
                      <Select
                        style={{ width: "100%" }}
                        value={civilization}
                        onChange={(value) =>
                          updateOpponentCivilization(index, value)
                        }
                        placeholder={`Adversaire ${index + 1}`}
                      >
                        <Option value="">Sélectionner une civilisation</Option>
                        {civilizations.map((civ) => (
                          <Option key={civ.id} value={civ.name_fr}>
                            {civ.name_fr}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Button
                        danger
                        block
                        onClick={() => removeOpponentCivilization(index)}
                      >
                        Retirer
                      </Button>
                    </Col>
                  </Row>
                </div>
              ))}

              <Button
                type="dashed"
                block
                onClick={addOpponentCivilization}
                style={{ marginTop: "10px" }}
              >
                Ajouter un adversaire
              </Button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <Text strong>Sélectionnez votre civilisation :</Text>
              <Select
                style={{ width: "100%", marginTop: "10px" }}
                value={userCivilization}
                onChange={(value) => setUserCivilization(value)}
                placeholder="Sélectionner votre civilisation"
              >
                <Option value="">Sélectionner une civilisation</Option>
                {civilizations.map((civ) => (
                  <Option key={civ.id} value={civ.id}>
                    {civ.name_fr}
                  </Option>
                ))}
              </Select>
            </div>

            <Button
              type="primary"
              block
              onClick={handleConfirmSelection}
              style={{ marginTop: "20px" }}
            >
              Confirmer et obtenir des conseils
            </Button>
          </Card>

          <Button
            type="link"
            danger
            onClick={() => navigate("/counter-tool")}
            style={{ marginTop: "20px" }}
          >
            OSEF, GO COUNTER TOOL
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default CounterToolSelect;
