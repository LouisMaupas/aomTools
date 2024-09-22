import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";

const HttpNotFound = () => {
  return (
    <div style={styles.container}>
      <FontAwesomeIcon icon={faExclamationTriangle} style={styles.icon} />
      <h1 style={styles.title}>404 - Page Not Found</h1>
      <p style={styles.message}>
        Oups ! Il semble que la page que vous cherchez n'existe pas.
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
    backgroundColor: "#f0f2f5",
  },
  icon: {
    fontSize: "64px",
    color: "#ff4d4f",
    marginBottom: "20px",
  },
  title: {
    fontSize: "48px",
    fontWeight: "bold",
    marginBottom: "16px",
  },
  message: {
    fontSize: "18px",
    marginBottom: "32px",
    color: "#595959",
  },
  button: {
    fontSize: "16px",
  },
};

export default HttpNotFound;
