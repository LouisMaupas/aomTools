import { useEffect, useState } from "react";
import { Card, Typography, Row, Col, List } from "antd";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getCivilizationIcon } from "../../utils/iconUtils"; // Import de l'icône des civilisations
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBolt,
  faCog,
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
    // Charger les informations de l'utilisateur depuis localStorage
    const storedUserInfos = JSON.parse(localStorage.getItem("userInfos")) || {};
    setCivilization(storedUserInfos.fav_civilization || "");
    setGod(storedUserInfos.fav_majorGod || "");

    // Fetcher les civilisations et les dieux
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

  // Trouver les noms de civilisation et de dieu favoris
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
        <Title level={2}>{t("Bienvenue")} !</Title>
        <Text strong>
          {t("Votre civilisation favorite")} :{" "}
          {getCivilizationIcon(civilization)}{" "}
          {userCiv ? userCiv.name_fr : t("Inconnue")}
        </Text>
        <br />
        <Text strong>
          {t("Votre dieu favori")} : <FontAwesomeIcon icon={faBolt} />{" "}
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
                "Cet outil permet de connaitre facilement les counters les plus efficaces pour chaque unité du jeu. Vous pouvez sélectionner votre civilisation favorite dans l'onglet Préférences, ce qui permet de filtrer les unités que vous souhaitez."
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
    </div>
  );
};

export default HomePage;
