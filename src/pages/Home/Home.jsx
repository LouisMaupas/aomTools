import { useEffect, useState } from "react";
import { Card, Typography, Row, Col, List } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCivilizationIcon } from "../../utils/iconUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faTools,
  faHome,
  faBook,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";

const { Title, Text, Paragraph } = Typography;

const HomePage = () => {
  const { t } = useTranslation();
  const [civilization, setCivilization] = useState(null);
  const [god, setGod] = useState(null);
  const [civilizations, setCivilizations] = useState([]);
  const [majorGods, setMajorGods] = useState([]);

  useEffect(() => {
    const storedUserInfos = JSON.parse(localStorage.getItem("userInfos")) || {};
    setCivilization(storedUserInfos.fav_civilization || "");
    setGod(storedUserInfos.fav_majorGod || "");

    const fetchCivilizationsAndGods = async () => {
      try {
        const civResponse = await fetch("/database/database_civ.json");
        const civData = await civResponse.json();
        setCivilizations(civData.civilizations);

        const godResponse = await fetch("/database/database_major_gods.json");
        const godData = await godResponse.json();
        setMajorGods(godData.major_gods);
      } catch (error) {
        console.error("Erreur lors du chargement des données", error);
      }
    };

    fetchCivilizationsAndGods();
  }, []);

  const userCiv = civilizations.find((civ) => civ.id === civilization);
  const userGod = majorGods.find((g) => g.id === god);

  return (
    <div style={{ padding: "20px" }}>
      <Card
        style={{
          textAlign: "center",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <Title level={2}>{t("Bienvenue sur Aom Tools")} !</Title>
        <Text strong>
          {t("Civilisation favorite")} : {getCivilizationIcon(civilization)}{" "}
          {userCiv ? userCiv.name_fr : t("Inconnue")}
        </Text>
        <br />
        <Text strong>
          {t("Dieu majeur favori")} : <FontAwesomeIcon icon={faBolt} />{" "}
          {userGod ? userGod.name : t("Inconnu")}
        </Text>
      </Card>

      <Row justify="center">
        <Col xs={24} sm={18} md={12}>
          <Card
            style={{
              textAlign: "center",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <Paragraph style={{ textAlign: "left" }}>
              {t(
                "Cet outil permet de connaitre facilement les unités les plus efficaces contre chaque unité du jeu. Vous pouvez également sélectionner votre civilisation favorite dans préférences."
              )}
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Row justify="center">
        <Col xs={24} sm={18} md={12}>
          <Card style={{ textAlign: "center", borderRadius: "10px" }}>
            <List
              size="large"
              header={<div>{t("Outils")}</div>}
              bordered
              dataSource={[
                { name: t("Accueil"), icon: faHome, path: "/" },
                {
                  name: t("Counter Tool"),
                  icon: faTools,
                  path: "/counter-tool-select",
                },
                { name: t("Préférences"), icon: faHeart, path: "/preferences" },
                {
                  name: t("Encyclopédie [en construction]"),
                  icon: faBook,
                  path: "/preferences",
                },
              ]}
              renderItem={(item) => (
                <List.Item>
                  <Link to={item.path} style={{ fontSize: "18px" }}>
                    <FontAwesomeIcon icon={item.icon} /> {item.name}
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>

      <Row justify="center">
        <Col xs={24} sm={18} md={12}>
          <Card
            style={{
              textAlign: "center",
              borderRadius: "10px",
              marginBottom: "20px",
            }}
          >
            <Title level={2}>{t("Changements")}</Title>
            <Title level={3}>{t("A venir")}</Title>
            <Title level={4}>{t("Corrections")}</Title>
            <Paragraph style={{ textAlign: "left" }}>
              <List>
                <ul>
                  <li>
                    {t(
                      "Correction d'un bug faisant planter l'application en l'absence de nom de l'unité dans la langue séléctionnée."
                    )}
                  </li>
                  <li>
                    {t(
                      "Selection correcte des noms des unités dans la langue séléctionnée."
                    )}
                  </li>
                </ul>
              </List>
            </Paragraph>
            <Title level={4}>{t("Fonctionnalitées")}</Title>
            <Paragraph style={{ textAlign: "left" }}>
              <List>
                <ul>
                  <li>{t("Ajout des images manquantes.")}</li>
                  <li>{t("Amélioration de l'UI.")}</li>
                  <li>{t("Amélioration des performances.")}</li>
                  <li>
                    {t(
                      "Algorithme counter units : prendre en compte l'évolution des statistiques par age."
                    )}
                  </li>
                  <li>
                    {t(
                      "Algorithme counter units : prendre en compte les bonus sur des unités spécifiques."
                    )}
                  </li>
                  <li>{t("Base de données : ajout des héros atlantéens.")}</li>
                  <li>{t("Base de données : ajout des unités manquantes.")}</li>
                  <li>{t("Base de données : ajout des unités navals.")}</li>
                  <li>
                    {t(
                      "Counter Tool : préciser les dieux majeuurs lors de la séléction des civilisations."
                    )}
                  </li>
                  <li>
                    {t(
                      "Counter Tool : en cas de 1v1 pouvoir alterner entre le profil de l'utilisateur et de l'adversaire."
                    )}
                  </li>
                  <li>
                    {t(
                      "Counter Tool : en cas de 1v1 ajout d'un récap du matchup (stratégies à adopter, forces et faiblesses du panthéon)."
                    )}
                  </li>
                  <li>{t("Ajout de l'encyclopédie.")}</li>
                  <li>{t("Ajout de la section reliques")}</li>
                </ul>
              </List>
            </Paragraph>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
