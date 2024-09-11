import React, { useState, useEffect } from "react";
import useStore from "../../store/store";

const SelectCiv = () => {
  const { userInfos, setUserInfos, loadUserInfosFromStorage } = useStore();
  const [civilization, setCivilization] = useState(
    userInfos.civilization || ""
  );
  const [majorGod, setMajorGod] = useState(userInfos.majorGod || "");

  useEffect(() => {
    loadUserInfosFromStorage();
  }, [loadUserInfosFromStorage]);

  const handleSave = () => {
    const newUserInfos = { civilization, majorGod };
    setUserInfos(newUserInfos);
    localStorage.setItem("userInfos", JSON.stringify(newUserInfos));
    alert("Vos choix ont été sauvegardés !");
  };

  return (
    <div>
      <h1>Sélectionnez votre civilisation et dieu majeur favoris</h1>
      <div>
        <label>
          Civilisation :
          <select
            value={civilization}
            onChange={(e) => setCivilization(e.target.value)}
          >
            <option value="">Sélectionner</option>
            <option value="Egyptien">Egyptien</option>
            <option value="Grec">Grec</option>
            <option value="Norse">Norse</option>
            <option value="Atlante">Atlante</option>
          </select>
        </label>
      </div>
      <div>
        <label>
          Dieu majeur :
          <select
            value={majorGod}
            onChange={(e) => setMajorGod(e.target.value)}
          >
            <option value="">Sélectionner</option>
            <option value="Zeus">Zeus</option>
            <option value="Ra">Ra</option>
            <option value="Odin">Odin</option>
            <option value="Kronos">Kronos</option>
          </select>
        </label>
      </div>
      <button onClick={handleSave}>Sauvegarder</button>
    </div>
  );
};

export default SelectCiv;
