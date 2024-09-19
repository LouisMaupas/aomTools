import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBuildingColumns,
  faAnkh,
  faSnowflake,
  faCompassDrafting,
} from "@fortawesome/free-solid-svg-icons";

export const getCivilizationIcon = (civId) => {
  switch (civId) {
    case 1:
      return <FontAwesomeIcon icon={faBuildingColumns} color="#664343" />;
    case 2:
      return <FontAwesomeIcon icon={faAnkh} color="#CD5C08" />;
    case 3:
      return <FontAwesomeIcon icon={faSnowflake} color="#7EACB5" />;
    case 4:
      return <FontAwesomeIcon icon={faCompassDrafting} color="#A5B68D" />;
    default:
      return null;
  }
};
