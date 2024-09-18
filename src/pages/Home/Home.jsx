import { useEffect, useState } from "react";
import { Button, Card, Select, Typography } from "antd";
import useStore from "../../store/store";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBolt, faScroll } from "@fortawesome/free-solid-svg-icons";
const { Text } = Typography;
const { Option } = Select;

const Home = () => {
  const { userInfos, setUserInfos } = useStore();

  const storedUserInfos = JSON.parse(localStorage.getItem("userInfos")) || {};
  const [civilizations, setCivilizations] = useState([]);
  const [majorGods, setMajorGods] = useState([]);

  const [selectedCiv, setSelectedCiv] = useState(
    storedUserInfos.fav_civilization || ""
  );
  const [selectedGod, setSelectedGod] = useState(
    storedUserInfos.fav_majorGod || ""
  );

  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCivilizations = async () => {
      try {
        const civResponse = await fetch("/database/database_civ.json");
        const civData = await civResponse.json();
        setCivilizations(civData.civilizations);
      } catch (error) {
        console.error("error loading civilizations", error);
      }
    };

    const fetchMajorGods = async () => {
      try {
        const godResponse = await fetch("/database/database_major_gods.json");
        const godData = await godResponse.json();
        setMajorGods(godData.major_gods);
      } catch (error) {
        console.error("error loading major gods", error);
      }
    };

    fetchCivilizations();
    fetchMajorGods();
  }, []);

  const handleSave = () => {
    const updatedUserInfos = {
      fav_civilization: selectedCiv,
      fav_majorGod: selectedGod,
    };
    setUserInfos(updatedUserInfos);
    localStorage.setItem("userInfos", JSON.stringify(updatedUserInfos));
    navigate("/counter-tool-select");
  };

  const filteredGods = majorGods.filter((god) => {
    const selectedCivObj = civilizations.find((civ) => civ.id === selectedCiv);
    return selectedCivObj ? god.civilization === selectedCivObj.id : false;
  });

  return (
    <div className="main-content">
      <Card style={{ textAlign: "center", borderRadius: "10px" }}>
        <div style={{ marginBottom: "20px" }}>
          <Text strong>
            <FontAwesomeIcon icon={faScroll} />{" "}
            {t("Sélectionnez votre civilisation")} :
          </Text>
          <Select
            style={{ width: "100%", marginTop: "10px" }}
            value={selectedCiv}
            onChange={(value) => setSelectedCiv(value)}
            placeholder={t("Choisir une civilisation")}
          >
            {civilizations.map((civ) => (
              <Option key={civ.id} value={civ.id}>
                {civ.name_fr || civ.name_en}
              </Option>
            ))}
          </Select>
        </div>

        {selectedCiv && (
          <div style={{ marginBottom: "20px" }}>
            <Text strong>
              <FontAwesomeIcon icon={faBolt} /> Sélectionnez votre dieu majeur :
            </Text>
            <Select
              style={{ width: "100%", marginTop: "10px" }}
              value={selectedGod}
              onChange={(value) => setSelectedGod(value)}
              placeholder="Choisir un dieu majeur"
            >
              {filteredGods.map((god) => (
                <Option key={god.id} value={god.id}>
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
          {t("Enregistrer et continuer")}
        </Button>
      </Card>
    </div>
  );
};

export default Home;
