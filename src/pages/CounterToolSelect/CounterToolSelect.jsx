import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, Typography, Row, Col, Card, Modal, Steps } from "antd";
import useStore from "../../store/store";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faCheckCircle,
  faSkull,
  faSquarePlus,
  faTrash,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { getCivilizationIcon } from "../../utils/iconUtils.jsx";

const { Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const CounterToolSelect = () => {
  const [civilizations, setCivilizations] = useState([]);
  const [majorGods, setMajorGods] = useState([]);
  const [loadingCivilization, setLoadingCivilization] = useState(true);
  const [gods, setGods] = useState({}); // État pour stocker les dieux majeurs sélectionnés
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();
  const {
    userCivilization,
    setUserCivilization,
    opponentCivilizations,
    addOpponentCivilization,
    removeOpponentCivilization,
    updateOpponentCivilization,
  } = useStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCivilizationsAndGods = async () => {
      try {
        const civResponse = await fetch("/database/database_civ.json");
        const civData = await civResponse.json();
        setCivilizations(civData.civilizations);

        const godResponse = await fetch("/database/database_major_gods.json");
        const godData = await godResponse.json();
        setMajorGods(godData.major_gods);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      }
    };

    fetchCivilizationsAndGods();
  }, []);

  const updateLocalStorage = (userCiv, userGod, opponentCivs, opponentGods) => {
    const currentCivilisations = {
      user: userCiv,
      userGod: userGod,
      opponents: opponentCivs,
      opponentsGods: opponentGods,
    };

    localStorage.setItem("current_civilisations", JSON.stringify(currentCivilisations));
  };

  const handleConfirmSelection = () => {
    if (!userCivilization || opponentCivilizations.some((civ) => !civ)) {
      Modal.confirm({
        title: t("Une ou plusieurs civilisations manquent"),
        content: !userCivilization
          ? t(
              "Vous n'avez pas sélectionné votre civilisation. Voulez-vous continuer ?"
            )
          : t(
              "Vous n'avez pas sélectionné de civilisation pour les adversaires. Voulez-vous tout de même continuer ?"
            ),
        onOk() {
          navigate("/counter-tool");
        },
        onCancel() {},
      });
    } else {
      navigate("/counter-tool");
    }
  };

  const handleUserCivilizationChange = (value) => {
    setUserCivilization(value);
    updateLocalStorage(value, gods["user"], opponentCivilizations, Object.values(gods).filter((_, index) => index !== "user"));
    setCurrentStep(2);
  };

  const handleOpponentCivilizationChange = (index, value) => {
    updateOpponentCivilization(index, value);
    updateLocalStorage(
      userCivilization,
      gods["user"],
      opponentCivilizations.map((civ, idx) => (idx === index ? value : civ)),
      Object.values(gods).filter((_, idx) => idx !== "user")
    );

    setCurrentStep(1);
  };

  const handleGodChange = (index, value) => {
    const updatedGods = {
      ...gods,
      [index]: value,
    };
    setGods(updatedGods);
    updateLocalStorage(userCivilization, updatedGods["user"], opponentCivilizations, Object.values(updatedGods).filter((_, idx) => idx !== "user"));
  };

  const filteredGodsForCiv = (civId) => {
    return majorGods.filter((god) => god.civilization === civId);
  };

  const skipSelectAndGoCounterTool = () => {
    updateLocalStorage(null, null, [1, 2, 3, 4], []);
    navigate("/counter-tool");
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row justify="center">
        <Col xs={24} md={20} lg={16}>
          <Card style={{ textAlign: "center", borderRadius: "10px" }}>
            <Steps current={currentStep} style={{ marginBottom: "20px" }}>
              <Step title={t("Ajouter des adversaires")} />
              <Step title={t("Choisir votre civilisation")} />
              <Step title={t("Accéder au Counter Tool")} />
            </Steps>

            <div style={{ marginBottom: "20px" }}>
              <Text strong style={{ fontSize: "15px" }}>
                <FontAwesomeIcon icon={faSkull} />{" "}
                {t("I) Sélectionnez les civilisations des adversaires")}
              </Text>
              {opponentCivilizations.map((civilization, index) => (
                <div key={index} style={{ margin: "10px 0" }}>
                  <Row gutter={[16, 16]}>
                    <Col span={14}>
                      <Select
                        style={{ width: "100%" }}
                        value={civilization || undefined}
                        onChange={(value) =>
                          handleOpponentCivilizationChange(index, value)
                        }
                        placeholder={`${t("Adversaire")} ${index + 1}`}
                      >
                        <Option value="">
                          {t("Sélectionner une civilisation")}
                        </Option>
                        {civilizations.map((civ) => (
                          <Option key={civ.id} value={civ.id}>
                            {getCivilizationIcon(civ.id)} {civ.name_fr}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Button
                        danger
                        block
                        onClick={() => removeOpponentCivilization(index)}
                        style={{ display: "flex" }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
                    {civilization && (
                      <Col span={4}>
                        <Button
                          type="dashed"
                          onClick={() => setCurrentStep(3)}
                          block
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </Button>
                        {/* Menu déroulant pour sélectionner le dieu majeur */}
                        {currentStep === 3 && (
                          <Select
                            style={{ width: "100%", marginTop: "10px" }}
                            value={gods[index] || undefined}
                            onChange={(value) => handleGodChange(index, value)}
                            placeholder={t("Sélectionner le dieu majeur")}
                          >
                            <Option value="">{t("Sélectionner un dieu")}</Option>
                            {filteredGodsForCiv(civilization).map((god) => (
                              <Option key={god.id} value={god.id}>
                                {god.name}
                              </Option>
                            ))}
                          </Select>
                        )}
                      </Col>
                    )}
                  </Row>
                </div>
              ))}

              <Button
                type="dashed"
                block
                onClick={() => {
                  addOpponentCivilization();
                  setCurrentStep(1);
                }}
                style={{ marginTop: "10px" }}
              >
                <FontAwesomeIcon icon={faSquarePlus} />{" "}
                {t("Ajouter un ou des adversaire(s)")}
              </Button>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <FontAwesomeIcon icon={faUser} />{" "}
              <Text strong style={{ fontSize: "15px" }}>
                {t("II) Sélectionnez votre civilisation")}
              </Text>
              <Select
                style={{ width: "100%", marginTop: "10px" }}
                value={loadingCivilization ? undefined : userCivilization}
                onChange={handleUserCivilizationChange}
                placeholder={t("Sélectionner votre civilisation")}
              >
                <Option value="">{t("Sélectionner une civilisation")}</Option>
                {civilizations.map((civ) => (
                  <Option key={civ.id} value={civ.id}>
                    {getCivilizationIcon(civ.id)} {civ.name_fr}
                  </Option>
                ))}
              </Select>

              {/* Bouton pour choisir le dieu majeur de l'utilisateur */}
              {userCivilization && (
                <div style={{ marginTop: "10px" }}>
                  <Button type="dashed" onClick={() => setCurrentStep(3)}>
                    <FontAwesomeIcon icon={faPlus} /> {t("Ajouter votre dieu majeur")}
                  </Button>
                  {currentStep === 3 && (
                    <Select
                      style={{ width: "100%", marginTop: "10px" }}
                      value={gods["user"] || undefined}
                      onChange={(value) => handleGodChange("user", value)}
                      placeholder={t("Sélectionner votre dieu majeur")}
                    >
                      <Option value="">{t("Sélectionner un dieu")}</Option>
                      {filteredGodsForCiv(userCivilization).map((god) => (
                        <Option key={god.id} value={god.id}>
                          {god.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </div>
              )}
            </div>

            <Button
              type="primary"
              block
              onClick={handleConfirmSelection}
              style={{ marginTop: "20px" }}
            >
              <FontAwesomeIcon icon={faCheckCircle} /> {t("Confirmer")}
            </Button>
            <div>
              <Button
                type="link"
                danger
                onClick={skipSelectAndGoCounterTool}
                style={{ marginTop: "20px" }}
              >
                <FontAwesomeIcon icon={faArrowRight} />{" "}
                {t("Aller directement au Counter Tool")}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CounterToolSelect;
