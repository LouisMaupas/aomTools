import { useEffect, useState } from "react";
import { Button, Card, Select, Typography } from "antd";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
const { Title, Text } = Typography;
const { Option } = Select;

const Home = () => {
  const { userInfos, setUserInfos } = useStore();
  const [civilizations, setCivilizations] = useState([]);
  const [majorGods, setMajorGods] = useState([]);
  const [selectedCiv, setSelectedCiv] = useState(userInfos.civilization || "");
  const [selectedGod, setSelectedGod] = useState(userInfos.majorGod || "");
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();

  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const civResponse = await fetch("/database/database_civ.json");
        const civData = await civResponse.json();
        setCivilizations(civData.civilizations);
      } catch (error) {
        console.error("Erreur lors du chargement des civilisations:", error);
      }
    };

    const fetchMajorGods = async () => {
      try {
        const godResponse = await fetch("/database/database_major_gods.json");
        const godData = await godResponse.json();
        setMajorGods(godData.major_gods);
      } catch (error) {
        console.error("Erreur lors du chargement des dieux majeurs:", error);
      }
    };

    fetchCivilizations();
    fetchMajorGods();
  }, []);

  const handleSave = () => {
    const updatedUserInfos = {
      civilization: selectedCiv,
      majorGod: selectedGod,
    };
    setUserInfos(updatedUserInfos);
    localStorage.setItem("userInfos", JSON.stringify(updatedUserInfos));
    navigate("/counter-tool");
  };

  const filteredGods = majorGods.filter((god) => {
    const selectedCivObj = civilizations.find(
      (civ) => civ.name === selectedCiv
    );
    return selectedCivObj ? god.civilization === selectedCivObj.id : false;
  });

  return (
    <div style={{ padding: "20px" }}>
      <Card style={{ textAlign: "center", borderRadius: "10px" }}>
        <Title level={2}>
          {t("Sélectionnez votre civilisation et dieu majeur")}
        </Title>

        <div style={{ marginBottom: "20px" }}>
          <Text strong>Sélectionnez votre civilisation :</Text>
          <Select
            style={{ width: "100%", marginTop: "10px" }}
            value={selectedCiv}
            onChange={(value) => setSelectedCiv(value)}
            placeholder="Choisir une civilisation"
          >
            {civilizations.map((civ) => (
              <Option key={civ.id} value={civ.name}>
                {civ.name_fr || civ.name_en}
              </Option>
            ))}
          </Select>
        </div>

        {selectedCiv && (
          <div style={{ marginBottom: "20px" }}>
            <Text strong>Sélectionnez votre dieu majeur :</Text>
            <Select
              style={{ width: "100%", marginTop: "10px" }}
              value={selectedGod}
              onChange={(value) => setSelectedGod(value)}
              placeholder="Choisir un dieu majeur"
            >
              {filteredGods.map((god) => (
                <Option key={god.id} value={god.name}>
                  {god.name}
                </Option>
              ))}
            </Select>
          </div>
        )}

        <Button
          type="primary"
          block
          onClick={handleSave}
          disabled={!selectedCiv || !selectedGod}
        >
          Enregistrer et continuer
        </Button>
      </Card>
    </div>
  );
};

export default Home;
