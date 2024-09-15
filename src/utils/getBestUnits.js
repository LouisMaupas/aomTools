const fetchUnits = async () => {
  const response = await fetch("/database/database_units.json");
  const data = await response.json();
  return data.units;
};

/**
 * Function to get the X best units against a target unit
 * @param {Object} targetUnit - The unit to counter.
 * @param {number} X - The number of best counter units to return.
 * @param {number} [age] - (Optional) The maximum age the units can have.
 * @param {number} [civId] - (Optional) The civilization ID to filter units.
 * @returns {Promise<Array>} - A promise that resolves to the top X units that are most effective against the target.
 */
const getBestUnits = async (targetUnit, X, age, civId) => {
  const units = await fetchUnits(); // Fetch units asynchronously

  // 1. Filter units based on the civilization ID if provided
  let filteredUnits = units;
  if (civId !== undefined && civId !== null && civId !== false) {
    filteredUnits = filteredUnits.filter((unit) => unit.civilization === civId);
    console.log(
      `Units after civilization filter (civId=${civId}):`,
      filteredUnits
    );
  }

  // 2. Filter units based on the maximum age if provided
  if (age !== undefined && age !== null && age !== false) {
    filteredUnits = filteredUnits.filter((unit) => unit.Age <= age);
    console.log(`Units after age filter (maxAge=${age}):`, filteredUnits);
  }

  // 3. If there are no units left after filtering, return an empty array
  if (filteredUnits.length === 0) {
    console.log("No units available after applying filters.");
    return [];
  }

  // 4. Find the weakest armor type (armor_hack, armor_pierce, armor_crush) of the target unit
  const weakestArmorType = getWeakestArmorType(targetUnit.armors);

  // 5. Calculate damage and sort units based on their effectiveness against the target unit
  const sortedUnits = filteredUnits
    .filter((unit) => unit.id !== targetUnit.id) // Exclude the target unit itself
    .map((unit) => ({
      unit,
      damage: calculateDamageAgainstUnit(unit, targetUnit, weakestArmorType),
    }))
    .sort((a, b) => b.damage - a.damage); // Sort by the calculated damage

  // 6. Return the top X units (or fewer if less than X units are available)
  return sortedUnits.slice(0, X).map((entry) => entry.unit);
};

/**
 * Function to calculate the total damage a unit can deal to a target unit.
 * This includes both standard attacks (hack, pierce, crush) and any bonus attacks.
 * @param {Object} unit - The attacking unit.
 * @param {Object} targetUnit - The target unit.
 * @param {string} weakestArmorType - The weakest armor type of the target unit.
 * @returns {number} - The total effective damage the unit can deal to the target unit.
 */
const calculateDamageAgainstUnit = (unit, targetUnit, weakestArmorType) => {
  // Base damage is the attack value for the weakest armor type (hack, pierce, or crush)
  const baseDamage = unit.attacks[weakestArmorType] || 0;

  // Bonus damage is treated as a multiplier to the base damage
  let bonusMultiplier = 1;

  for (const [attackKey, attackValues] of Object.entries(unit.attacks)) {
    if (attackKey.startsWith("attack_")) {
      const attackValue = Number(attackKey.split("_")[1]);
      if (attackValue >= 100) {
        // Check if the target unit's type is in the bonus attack's list
        if (attackValues.some((typeId) => targetUnit.type.includes(typeId))) {
          // Multiply the base damage by the bonus value
          bonusMultiplier *= attackValue / 100;
        }
      }
    }
  }

  // Return the total damage (base damage multiplied by all bonus factors)
  return baseDamage * bonusMultiplier;
};

/**
 * Function to get the weakest armor type of a unit.
 * @param {Object} armors - The armor values of the unit.
 * @returns {string} - The type of armor that is the weakest.
 */
const getWeakestArmorType = (armors) => {
  const { armor_hack, armor_pierce, armor_crush } = armors;

  // Determine the weakest armor value
  const minArmorValue = Math.min(armor_hack, armor_pierce, armor_crush);

  // Return the corresponding armor type
  if (minArmorValue === armor_hack) return "hack";
  if (minArmorValue === armor_pierce) return "pierce";
  return "crush";
};

export default getBestUnits;
