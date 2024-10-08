const translations = {
  en: {
    hack: "hack",
    pierce: "pierce",
    crush: "crush",
    divine: "divine",
  },
  "fr-FR": {
    hack: "tranchant",
    pierce: "perçant",
    crush: "écrasement",
    divine: "divine",
  },
  fr: {
    hack: "tranchant",
    pierce: "perçant",
    crush: "écrasement",
    divine: "divine",
  },
  de: {
    hack: "hacken",
    pierce: "durchbohren",
    crush: "zerschmettern",
    divine: "divine",
  },
};

/**
 * Takes an array of armor strings and returns an array of weapon strings
 * translated to the given language.
 *
 * @param {string[]} armor - An array of armor strings.
 * @param {string} lang - The language to translate to. Defaults to "en".
 * @returns {string[]} An array of weapon strings translated to the given
 * language.
 */
const getWeaponFromArmors = (armor, lang = "en") => {
  return armor.map(
    (element) => translations[lang][element.split("_").at(-1)] || ""
  );
};

/**
 * Takes an array of weapon strings and returns an array of translated weapon
 * strings in the given language.
 *
 * @param {string[]} weapon - An array of weapon strings.
 * @param {string} lang - The language to translate to. Defaults to "en".
 * @returns {string[]} An array of translated weapon strings in the given
 * language.
 */
const translateWeapons = (weapons, lang = "en") => {
  return weapons.map((element) => translations[lang][element] || "");
};

export { getWeaponFromArmors, translateWeapons };
