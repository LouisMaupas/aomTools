import React, { useState, useEffect } from "react";
import { Route, Routes, NavLink, useLocation } from "react-router-dom";
import { Layout, Menu, Drawer, Button, Dropdown, Space } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  ToolOutlined,
  GlobalOutlined,
  HeartOutlined,
  BookOutlined as Book,
} from "@ant-design/icons";
import Home from "./pages/Home/Home";
import SelectCiv from "./pages/SelectCiv/SelectCiv";
import useStore from "./store/store";
import "./App.css";
import LearnCounter from "./pages/LearnCounter/LearnCounter";
import CounterTool from "./pages/CounterTool/CounterTool";
import CounterToolSelect from "./pages/CounterToolSelect/CounterToolSelect";
import { useTranslation } from "react-i18next";
import i18n from "./i18n";
import Preferences from "./pages/Preferences/Preferences";

const { Header, Content } = Layout;

const App = () => {
  const { setActiveTab } = useStore();
  const location = useLocation();
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { i18n, t } = useTranslation();
  const [language, setLanguage] = useState(i18n.language);

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname, setActiveTab]);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const handleMenuClick = () => {
    closeDrawer();
  };

  const handleLanguageChange = (lng) => {
    i18n.changeLanguage(lng).then(() => setLanguage(lng));
  };

  const items = [
    {
      label: <a onClick={() => handleLanguageChange("en")}>English</a>,
      key: "0",
    },
    {
      label: <a onClick={() => handleLanguageChange("fr")}>Français</a>,
      key: "1",
    },
    {
      label: <a onClick={() => handleLanguageChange("es")}>Español</a>,
      key: "2",
    },
  ];

  return (
    <Layout className="app">
      <Header className="header">
        <div className="header-container">
          <Button
            type="primary"
            icon={<MenuOutlined />}
            onClick={showDrawer}
            className="menu-button"
          />

          <div className="logo-container">
            <NavLink to="/" exact="true">
              <img src="/favicon.png" alt="Logo" className="logo-img" />
              <span className="logo-text">AOM Tools</span>
            </NavLink>
          </div>

          <Dropdown menu={{ items }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <GlobalOutlined style={{ color: "white" }} />
              </Space>
            </a>
          </Dropdown>
        </div>

        <Drawer
          title="Navigation"
          placement="left"
          onClose={closeDrawer}
          open={drawerVisible}
        >
          <Menu
            mode="vertical"
            defaultSelectedKeys={[location.pathname]}
            selectedKeys={[location.pathname]}
            onClick={handleMenuClick}
          >
            <Menu.Item key="/" icon={<HomeOutlined />}>
              <NavLink to="/" exact="true">
                {t("Home")}
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/counter-tool-select" icon={<ToolOutlined />}>
              <NavLink to="/counter-tool-select">{t("Counter tool")}</NavLink>
            </Menu.Item>
            <Menu.Item key="/preferences" icon={<HeartOutlined />}>
              <NavLink to="/preferences">{t("Préférences")}</NavLink>
            </Menu.Item>
            <Menu.Item key="/encyclopedia" icon={<Book />}>
              <NavLink to="/encyclopedia">
                {t("Encyclopédie [en construction]")}
              </NavLink>
            </Menu.Item>
          </Menu>
        </Drawer>
      </Header>

      <Content style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/learn-counter" element={<LearnCounter />} />
          <Route path="/counter-tool" element={<CounterTool />} />
          <Route path="/counter-tool-select" element={<CounterToolSelect />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
