import React, { useEffect } from "react";
import { Route, Routes, NavLink, useLocation } from "react-router-dom";
import { Layout, Menu } from "antd";
import { HomeOutlined, ToolOutlined, ReadOutlined } from "@ant-design/icons";
import Home from "./pages/Home/Home";
import SelectCiv from "./pages/SelectCiv/SelectCiv";
import useStore from "./store/store";
import "./App.css";
import LearnCounter from "./pages/LearnCounter/LearnCounter";
import CounterTool from "./pages/CounterTool/CounterTool";
import CounterToolSelect from "./pages/CounterToolSelect/CounterToolSelect";

const { Header, Content } = Layout;

const App = () => {
  const { setActiveTab } = useStore();
  const location = useLocation();

  useEffect(() => {
    setActiveTab(location.pathname);
  }, [location.pathname, setActiveTab]);

  return (
    <Layout className="app">
      <Header className="header">
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[location.pathname]}
          selectedKeys={[location.pathname]}
        >
          <Menu.Item key="/" icon={<HomeOutlined />}>
            <NavLink to="/" exact="true">
              Home
            </NavLink>
          </Menu.Item>
          <Menu.Item key="/counter-tool-select" icon={<ToolOutlined />}>
            <NavLink to="/counter-tool-select">Counter Tool</NavLink>
          </Menu.Item>
          <Menu.Item key="/learn-counter" icon={<ReadOutlined />}>
            <NavLink to="/learn-counter">Learn counters</NavLink>
          </Menu.Item>
        </Menu>
      </Header>

      <Content style={{ padding: "20px", marginTop: "64px" }}>
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
