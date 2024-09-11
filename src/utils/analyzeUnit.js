const fetchUnitTypes = async () => {
  const response = await fetch("/database/database_unit_types.json");
  const data = await response.json();
  return data.unit_types;
};

const analyzeUnit = async (unit) => {
  // Partie 1: Charger les types d'unités via fetch
  const unitTypes = await fetchUnitTypes();

  // Partie 2: Déterminer les armures les plus faibles
  const armors = unit.armors;
  const armorValues = {
    armor_hack: armors.armor_hack,
    armor_pierce: armors.armor_pierce,
    armor_crush: armors.armor_crush,
  };

  const minArmorValue = Math.min(...Object.values(armorValues));

  // Trouver les types d'armures les plus faibles
  const armorWeakness = Object.keys(armorValues).filter(
    (key) => armorValues[key] === minArmorValue
  );

  // Partie 3: Déterminer la plus grande attaque entre hack, pierce, crush et divine
  const attacks = unit.attacks;
  const attackValues = {
    hack: attacks.hack,
    pierce: attacks.pierce,
    crush: attacks.crush,
    divine: attacks.divine
  };

  const maxAttackValue = attackValues.divine ? attackValues.divine : Math.max(...Object.values(attackValues));

  // Trouver les types d'attaques avec la valeur maximale
  const attackType =  attackValues.divine ? Object.keys(attackValues) === "divine" : Object.keys(attackValues).filter(
    (key) => attackValues[key] === maxAttackValue
  );

  // Partie 4: Bonus d'attaque (tous les `attack_valeur` >= 100)
  const attackBonus = [];
  for (const [key, value] of Object.entries(attacks)) {
    if (key.startsWith("attack_") && Number(key.split("_")[1]) >= 100) {
      attackBonus.push(...value);
    }
  }

  // Partie 5: Déterminer les types faibles (weak_against) et types forts (strong_against)
  const typeWeakness = new Set();
  const typeBonus = new Set();

  unit.type.forEach((typeId) => {
    const unitType = unitTypes.find((t) => t.id === typeId);
    if (unitType) {
      unitType.weak_against.forEach((weakId) => typeWeakness.add(weakId));
      unitType.strong_against.forEach((strongId) => typeBonus.add(strongId));
    }
  });

  return {
    armor_weakness: armorWeakness,
    type_weakness: Array.from(typeWeakness),
    type_bonus: Array.from(typeBonus),
    attack_type: attackType,
    attack_bonus: attackBonus,
  };
};

export default analyzeUnit;
