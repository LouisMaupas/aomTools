import React, { useState, useEffect } from "react";
import { Route, Routes, NavLink, useLocation } from "react-router-dom";
import { Layout, Menu, Drawer, Button, Dropdown, Space } from "antd";
import {
  MenuOutlined,
  HomeOutlined,
  ToolOutlined,
  GlobalOutlined,
  DownOutlined,
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

  const handleLogoClick = () => {
    alert("Clicked!");
  };

  const handleMenuClick = () => {
    closeDrawer();
  };

  const handleLanguageChange = (lng) => {
    console.log("lang will be = ", lng);
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

          <div className="logo-container" onClick={handleLogoClick}>
            <img src="/favicon.png" alt="Logo" className="logo-img" />
            <span className="logo-text">AOM Tools</span>
          </div>

          <Dropdown menu={{ items }} trigger={["click"]}>
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <GlobalOutlined />
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
              <NavLink to="/counter-tool-select">Counter Tool</NavLink>
            </Menu.Item>
          </Menu>
        </Drawer>
      </Header>

      <Content style={{ padding: "20px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/learn-counter" element={<LearnCounter />} />
          <Route path="/counter-tool" element={<CounterTool />} />
          <Route path="/counter-tool-select" element={<CounterToolSelect />} />
        </Routes>
      </Content>
    </Layout>
  );
};

export default App;
