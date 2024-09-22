import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const HttpNotFound = () => {
  return (
    <div style={styles.container}>
      <FontAwesomeIcon icon={faExclamationTriangle} style={styles.icon} />
      <h1 style={styles.title}>404</h1>
      <p style={styles.subtitle}>Page Non Trouvée</p>
      <p style={styles.message}>
        Oups ! La page que vous cherchez semble introuvable.
      </p>
      <Link to="/">
        <Button type="primary" size="large" style={styles.button}>
          Retour à l'accueil
        </Button>
      </Link>
    </div>
  );
};

const styles = {
  container: {
    padding: "0 20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    textAlign: "center",
    backgroundColor: "#f0f2f5",
  },
  icon: {
    fontSize: "80px",
    color: "#ff4d4f",
    marginBottom: "20px",
  },
  title: {
    fontSize: "72px",
    fontWeight: "700",
    margin: "0",
  },
  subtitle: {
    fontSize: "24px",
    fontWeight: "500",
    marginBottom: "16px",
  },
  message: {
    fontSize: "16px",
    marginBottom: "24px",
    color: "#595959",
  },
  button: {
    fontSize: "16px",
    padding: "0 40px",
    height: "40px",
  },
};

export default HttpNotFound;
