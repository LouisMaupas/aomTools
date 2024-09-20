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
} from "@fortawesome/free-solid-svg-icons";
import { getCivilizationIcon } from "../../utils/iconUtils.jsx";

const { Text } = Typography;
const { Option } = Select;
const { Step } = Steps;

const CounterToolSelect = () => {
  const [civilizations, setCivilizations] = useState([]);
  const [loadingCivilization, setLoadingCivilization] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const { t } = useTranslation();
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

  const loadUserCivilization = () => {
    const localStorageCurrentCivs = localStorage.getItem(
      "current_civilisations"
    );
    const localStorageUserInfos = localStorage.getItem("userInfos");

    let userCiv = "";
    let opponents = [];

    if (localStorageCurrentCivs) {
      const parsedCurrentCivs = JSON.parse(localStorageCurrentCivs);
      userCiv = parsedCurrentCivs.user || "";
      opponents = parsedCurrentCivs.opponents || [];
    }

    if (!userCiv && localStorageUserInfos) {
      const parsedUserInfos = JSON.parse(localStorageUserInfos);
      userCiv = parsedUserInfos.fav_civilization || "";
    }

    setUserCivilization(userCiv || "");
    opponents.forEach((opponent, index) => {
      updateOpponentCivilization(index, opponent);
    });
    setLoadingCivilization(false);
  };

  useEffect(() => {
    loadUserCivilization();
  }, []);

  const updateLocalStorage = (userCiv, opponentCivs) => {
    const currentCivilisations = {
      user: userCiv,
      opponents: opponentCivs,
    };

    localStorage.setItem(
      "current_civilisations",
      JSON.stringify(currentCivilisations)
    );
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
    updateLocalStorage(value, opponentCivilizations);
    setCurrentStep(2);
  };

  const handleOpponentCivilizationChange = (index, value) => {
    updateOpponentCivilization(index, value);

    updateLocalStorage(
      userCivilization,
      opponentCivilizations.map((civ, idx) => (idx === index ? value : civ))
    );

    setCurrentStep(1);
  };

  const skipSelectAndGoCounterTool = () => {
    updateLocalStorage(null, [1, 2, 3, 4]);
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
                    <Col span={18}>
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
                        {/* {t("Retirer")} */}
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </Col>
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
            </div>

            <Button
              type="primary"
              block
              onClick={handleConfirmSelection}
              style={{ marginTop: "20px" }}
            >
              <FontAwesomeIcon icon={faCheckCircle} /> {t("Confirmer")}
            </Button>

            <Button
              type="link"
              danger
              onClick={skipSelectAndGoCounterTool}
              style={{ marginTop: "20px" }}
            >
              <FontAwesomeIcon icon={faArrowRight} />{" "}
              {t("Aller directement au Counter Tool")}
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CounterToolSelect;
