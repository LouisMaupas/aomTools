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
  faSign,
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
                "Cet outil permet d’identifier facilement les unités les plus efficaces contre chaque type d’unité du jeu. Vous pouvez également sélectionner votre civilisation favorite dans les préférences."
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
                  path: "/encyclopedia",
                },
                {
                  name: t("Reliques [en construction]"),
                  icon: faSign,
                  path: "/relics",
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
            <Title level={3}>{t("Changements à venir")}</Title>
            <Title level={4}>{t("Corrections")}</Title>
            <Paragraph style={{ textAlign: "left" }}>
              <List>
                <ul>
                  <li>
                    {t(
                      "Correction d'un bug qui faisait planter l'application en cas d'absence du nom d'une unité dans la langue sélectionnée."
                    )}
                  </li>
                  <li>
                    {t(
                      "Sélection correcte des noms des unités dans la langue choisie."
                    )}
                  </li>
                  <li>{t("Amélioration de la gestion du cache.")}</li>
                </ul>
              </List>
            </Paragraph>
            <Title level={4}>{t("Fonctionnalités")}</Title>
            <Paragraph style={{ textAlign: "left" }}>
              <List>
                <ul>
                  <li>{t("Ajout des images manquantes.")}</li>
                  <li>{t("Amélioration de l'interface utilisateur.")}</li>
                  <li>{t("Optimisation des performances.")}</li>
                  <li>
                    {t(
                      "Algorithme des contre d'unités : prise en compte de l'évolution des statistiques selon l'âge."
                    )}
                  </li>
                  <li>
                    {t(
                      "Algorithme des contre d'unités : prise en compte des bonus spécifiques contre certaines unités."
                    )}
                  </li>
                  <li>{t("Base de données : ajout des héros atlantes.")}</li>
                  <li>{t("Base de données : ajout des unités manquantes.")}</li>
                  <li>{t("Base de données : ajout des unités navales.")}</li>
                  <li>
                    {t(
                      "Counter Tool : préciser les dieux majeurs lors de la sélection des civilisations."
                    )}
                  </li>
                  <li>
                    {t(
                      "Counter Tool : en 1v1, permettre d'alterner entre le profil de l'utilisateur et celui de l'adversaire."
                    )}
                  </li>
                  <li>
                    {t(
                      "Counter Tool : en 1v1, ajout d'un récapitulatif du matchup (stratégies recommandées, forces et faiblesses du panthéon)."
                    )}
                  </li>
                  <li>{t("Ajout de l'encyclopédie.")}</li>
                  <li>{t("Ajout de la section reliques.")}</li>
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
