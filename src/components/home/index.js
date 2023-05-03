import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import "./index.css";
import {
  Layout as LayoutAnt,
  Select,
  Avatar,
  Menu,
  Dropdown,
  Space,
  Divider,
} from "antd";

import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  FunctionOutlined,
  DatabaseOutlined,
  FundOutlined,
  CalculatorOutlined,
  ProjectOutlined,
  StrikethroughOutlined,
  SettingOutlined,
  DiffOutlined,
  UserAddOutlined,
  UsergroupAddOutlined,
  GlobalOutlined,
  UserOutlined,
  UnlockOutlined,
  LogoutOutlined,
  DashboardOutlined,
  ImportOutlined,
  CalendarOutlined,
  FieldTimeOutlined,
  FileDoneOutlined,
  DollarOutlined,
  SnippetsOutlined,
  FileExcelOutlined
} from "@ant-design/icons";

import Component from "../component/index";
import Department from "../department/index";
import Coefficient from "../coefficient/index";
// import AccountPlan from '../accountPlan/index';
import Employee from "../employee/index";
import Project from "../project/index";

import Currency from "../currency/index";
import CostCenter from "../costCenter/index";
import AccountsReportChart from "../accountsReportChart/index";
import EmployeeDetails from "../employee/employeeDetails";
import EmployeeByDepartment from "../department/employeeByDepartment";
import Calculate from "../calculate";
import Dashboard from "../dashboard";
import Import from "../import";
import Users from "../users";
import TimeTable from "../timeTable";
import DayTable from "../dayTable";

import { useTranslation } from "react-i18next";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
  useParams,
  useRouteMatch,
  useLocation,
} from "react-router-dom";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { HOME_PAGE } from "../../constant";
import constants from "../../constant";

import GE from "../../assets/logos/ge.png"; // with import
import EN from "../../assets/logos/en.png"; // with import
import RU from "../../assets/logos/ru.png"; // with import
import Declaration from "../declaration";
import DeclarationPension from "../declaration/declarationPension";
import Report from "../report";

const { Header, Sider, Content } = LayoutAnt;

const { SubMenu } = Menu;

const { Option } = Select;

function Home() {
  let history = useHistory();
  let url = useRouteMatch();
  let location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [activeUrl, setActiveUrl] = useState([]);
  const [user, setUser] = useState({});

  const { t, i18n } = useTranslation();

  useEffect(() => {
    let usString = localStorage.getItem("payrollAppUser");
    let us = JSON.parse(usString);
    setUser(us);

    if (location.pathname == "/payroll/component") {
      setActiveUrl(["1"]);
    }

    if (location.pathname == "/payroll/coefficient") {
      setActiveUrl(["2"]);
    }
    // if( location.pathname == '/Reports/accountPlan'){
    //   setActiveUrl(['4']);
    // }
    if (location.pathname == "/payroll/employee") {
      setActiveUrl(["3"]);
    }
    if (location.pathname == "/payroll/project") {
      setActiveUrl(["4"]);
    }
    if (location.pathname == "/payroll/costCenter") {
      setActiveUrl(["5"]);
    }
    if (location.pathname == "/payroll/accountsReportChart") {
      setActiveUrl(["6"]);
    }
    if (location.pathname == "/payroll/department") {
      setActiveUrl(["7"]);
    }
    if (location.pathname == "/payroll/calculate") {
      setActiveUrl(["8"]);
    }
    if (location.pathname == "/payroll/dashboard") {
      setActiveUrl(["9"]);
    }
    if (location.pathname == "/payroll/import") {
      setActiveUrl(["10"]);
    }
    if (location.pathname == "/payroll/users") {
      setActiveUrl(["11"]);
    }
    if (location.pathname == "/payroll/timeTable") {
      setActiveUrl(["12"]);
    }
    if (location.pathname == "/payroll/currency") {
      setActiveUrl(["13"]);
    }
  }, []);

  const toggle = () => {
    setCollapsed(!collapsed);
  };

  const ClickGoPage = (e, name) => {
    console.log("ClickGoPage", e.key, name);
    // setActiveUrl({name: e.key})
    setActiveUrl([e.key]);
    history.push(`${HOME_PAGE}/${name}`);
  };

  const handleChange = ({ key }) => {
    i18n.changeLanguage(key);
  };

  const logOut = async () => {
    let token = localStorage.getItem("payrollAppLogintoken");
    axios.defaults.headers.common = { Authorization: `Bearer ${token}` };
    const result = await axios.post(
      constants.API_PREFIX + "/api/Account/logout"
    );
    console.log("resultresultresult", result);
    localStorage.removeItem("payrollAppLogintoken");
    localStorage.removeItem("payrollAppUser");
    // history.push(`${HOME_PAGE}`); ???
    window.location.reload();
  };

  const languageMenu = (
    <Menu onClick={handleChange}>
      <Menu.Item key="ge">
        <Space>
          <img width={25} height={20} alt="GE" src={GE} /> <span>Georgian</span>
        </Space>
      </Menu.Item>
      <Menu.Item key="en">
        <Space>
          <img width={25} height={20} alt="EN" src={EN} /> <span>English</span>
        </Space>
      </Menu.Item>
      <Menu.Item key="ru">
        <Space>
          <img width={25} height={20} alt="RU" src={RU} /> <span>Russian</span>
        </Space>
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu>
      <Menu.Item>
        <Space>
          <UserOutlined /> Settings
        </Space>
      </Menu.Item>
      <Menu.Item>
        <Space>
          <UnlockOutlined />
          Change Password
        </Space>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item onClick={logOut}>
        <Space>
          <LogoutOutlined />
          Log Out
        </Space>
      </Menu.Item>
    </Menu>
  );

  return (
    <LayoutAnt>
      <Sider
        className="site-layout"
        style={{
          height: "100%",
          position: "sticky",
          top: 0,
        }}
        theme="light"
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={260}
      >
        <div className="logo">
          {/* <img alt="aaa" style={{width:'100%', height: 'auto'}} src={"http://static1.squarespace.com/static/595bc3af29687ff67d144e54/t/5fff75649475673f7e479897/1610577255521/Payroll+logo.png?format=1500w"} /> */}
          {/* <img alt="aaa" style={{width:'100%', height: 'auto'}} src={Logo} /> */}
        </div>
        <Menu selectedKeys={activeUrl} theme="light" mode="inline">
          <Menu.Item
            key="9"
            icon={<DashboardOutlined />}
            onClick={(e) => ClickGoPage(e, "dashboard")}
          >
            {t(`dashboard`)}
          </Menu.Item>
          <Menu.Item
            key="8"
            icon={<CalculatorOutlined />}
            onClick={(e) => ClickGoPage(e, "calculate")}
          >
            {t(`calculation`)}
          </Menu.Item>
          <Menu.Item
            key="1"
            icon={<FundOutlined />}
            name="component"
            onClick={(e) => ClickGoPage(e, "component")}
          >
            {t(`component`)}
          </Menu.Item>
          <Menu.Item
            key="2"
            icon={<FunctionOutlined />}
            onClick={(e) => ClickGoPage(e, "coefficient")}
          >
            {t(`coefficient`)}
          </Menu.Item>
          {/* <Menu.Item key="4" icon={<AccountBookOutlined />} onClick={clickAccountPlan}>
          accountPlan
          </Menu.Item> */}
          <Menu.Item
            key="3"
            icon={<UserAddOutlined />}
            onClick={(e) => ClickGoPage(e, "employee")}
          >
            {t(`employee`)}
          </Menu.Item>

          <Menu.Item
            key="10"
            icon={<ImportOutlined />}
            onClick={(e) => ClickGoPage(e, "import")}
          >
            {t(`import`)}
          </Menu.Item>

          <Menu.Item
            key="40"
            icon={<FileExcelOutlined />}
            onClick={(e) => ClickGoPage(e, "report")}
          >
            {t(`Report`)}
          </Menu.Item>

          <SubMenu
            key="sub7"
            title={t(`declarations`)}
            icon={<SnippetsOutlined />}
          >
            <Menu.Item
              key="20"
              icon={<FileDoneOutlined />}
              onClick={(e) => ClickGoPage(e, "declaration")}
            >
              {t(`Standart `)}
            </Menu.Item>
            <Menu.Item
              key="30"
              icon={<FileDoneOutlined />}
              onClick={(e) => ClickGoPage(e, "declarationPension")}
            >
              {t(`Pension`)}
            </Menu.Item>
          </SubMenu>

          <SubMenu
            key="sub2"
            title={t(`timeKeeping`)}
            icon={<CalendarOutlined />}
          >
            <Menu.Item
              key="14"
              icon={<CalendarOutlined />}
              onClick={(e) => ClickGoPage(e, "timeTable")}
            >
              {t(`timeTable`)}
            </Menu.Item>
            <Menu.Item
              key="15"
              icon={<FieldTimeOutlined />}
              onClick={(e) => ClickGoPage(e, "dayTable")}
            >
              {t(`dayTable`)}
            </Menu.Item>
          </SubMenu>

          {user?.roles?.admin ? (
            <Menu.Item
              key="11"
              icon={<UsergroupAddOutlined />}
              onClick={(e) => ClickGoPage(e, "users")}
            >
              {t(`users`)}
            </Menu.Item>
          ) : (
            ""
          )}

          <SubMenu key="sub1" title={t(`setting`)} icon={<SettingOutlined />}>
            <Menu.Item
              key="4"
              icon={<ProjectOutlined />}
              onClick={(e) => ClickGoPage(e, "project")}
            >
              {t(`project`)}
            </Menu.Item>
            <Menu.Item
              key="5"
              icon={<StrikethroughOutlined />}
              onClick={(e) => ClickGoPage(e, "costCenter")}
            >
              {t(`costCenter`)}
            </Menu.Item>
            <Menu.Item
              key="6"
              icon={<DiffOutlined />}
              onClick={(e) => ClickGoPage(e, "accountsReportChart")}
            >
              accountsReportChart
            </Menu.Item>
            <Menu.Item
              key="7"
              icon={<DatabaseOutlined />}
              onClick={(e) => ClickGoPage(e, "department")}
            >
              {t(`department`)}
            </Menu.Item>
            <Menu.Item
              key="13"
              icon={<DollarOutlined />}
              onClick={(e) => ClickGoPage(e, "currency")}
            >
              {t(`currency`)}
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>

      <LayoutAnt className="site-layout">
        <Header
          style={{
            // position: 'fixed',
            zIndex: 1,
            width: "100%",
            backgroundColor: "#f5f7f7",
          }}
          className="site-layout-background"
        >
          {/* <div style={{ display: "flex"}}> */}

          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: toggle,
            }
          )}

          <div style={{ float: "right", right: 0 }}>
            {/* <Select defaultValue="en" style={{ width: 120 }} onChange={handleChange}>
              <Option value="en">En</Option>
              <Option value="ge">Ge</Option>

            </Select> */}

            <div style={{ display: "flex" }}>
              <div>
                {" "}
                <Dropdown overlay={userMenu}>
                  <div style={{ cursor: "pointer" }}>
                    <Space>
                      <Avatar size={32} icon={<UserOutlined />} />
                      <span>{user?.firstName}</span>
                    </Space>
                  </div>
                </Dropdown>
              </div>
              <div style={{ marginTop: 5, marginLeft: 15 }}>
                {" "}
                <Dropdown overlay={languageMenu}>
                  <div onClick={(e) => e.preventDefault()}>
                    <GlobalOutlined
                      style={{
                        fontSize: "26px",
                        color: "#1f91ff",
                        cursor: "pointer",
                      }}
                    />
                  </div>
                </Dropdown>
              </div>
            </div>
          </div>

          {/* </div> */}
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: "35px 16px",
            // padding: 18,
            // minHeight: 280,
            // textAlign: "center"
          }}
        >
          <Switch>
            <Route exact path="/">
              <Redirect to={`${HOME_PAGE}/dashboard`} />
            </Route>
            <Route path={`${HOME_PAGE}/component`}>
              <Component />
            </Route>

            <Route path={`${HOME_PAGE}/coefficient`}>
              <Coefficient />
            </Route>
            {/* <Route path={`${HOME_PAGE}/accountPlan`}>
              <AccountPlan />
            </Route> */}
            <Route exact path={`${HOME_PAGE}/employee`}>
              <Employee />
            </Route>
            <Route exact path={`${HOME_PAGE}/Employee/Add`}>
              <EmployeeDetails />
            </Route>
            <Route exact path={`${HOME_PAGE}/Employee/Edit/:id`}>
              <EmployeeDetails />
            </Route>
            <Route path={`${HOME_PAGE}/project`}>
              <Project />
            </Route>
            <Route path={`${HOME_PAGE}/costCenter`}>
              <CostCenter />
            </Route>
            <Route path={`${HOME_PAGE}/accountsReportChart`}>
              <AccountsReportChart />
            </Route>
            <Route path={`${HOME_PAGE}/department`}>
              <Department />
            </Route>
            <Route path={`${HOME_PAGE}/calculate`}>
              <Calculate />
            </Route>
            <Route path={`${HOME_PAGE}/employeeByDepartment/:id`}>
              <EmployeeByDepartment />
            </Route>
            <Route path={`${HOME_PAGE}/dashboard`}>
              <Dashboard />
            </Route>
            <Route path={`${HOME_PAGE}/import`}>
              <Import />
            </Route>
            <Route path={`${HOME_PAGE}/report`}>
              <Report />
            </Route>
            <Route path={`${HOME_PAGE}/declaration`}>
              <Declaration />
            </Route>
            <Route path={`${HOME_PAGE}/declarationPension`}>
              <DeclarationPension />
            </Route>
            <Route path={`${HOME_PAGE}/timeTable`}>
              <TimeTable />
            </Route>
            <Route path={`${HOME_PAGE}/dayTable`}>
              <DayTable />
            </Route>
            <Route path={`${HOME_PAGE}/users`}>
              <Users />
            </Route>
            <Route path={`${HOME_PAGE}/currency`}>
              <Currency />
            </Route>
          </Switch>
        </Content>
      </LayoutAnt>
    </LayoutAnt>
  );
}
export default Home;
