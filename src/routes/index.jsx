import React from "react";
import { Redirect } from "react-router-dom";

// Pages Clients
import ClientsDetail from "../pages/Clients/ClientsDetail";
import ClientsList from "../pages/Clients/List";

import ComprobantesDetail from "../pages/Comprobantes/Detail";
import ComprobantesList from "../pages/Comprobantes/List";

import FacturaDetalle from "../pages/Facturas/Detail";
import FacturaList from "../pages/Facturas/List";

// // Authentication related pages
import Login from "../pages/Authentication/Login";
import Logout from "../pages/Authentication/Logout";
// import Register from "../pages/Authentication/Register";
// import ForgetPwd from "../pages/Authentication/ForgetPassword";

// // Dashboard
import Dashboard from "../pages/Dashboard/index";
import DashboardSaas from "../pages/Dashboard-saas/index";
import DashboardCrypto from "../pages/Dashboard-crypto/index";
import Blog from "../pages/Dashboard-Blog/index";

// // Charts
import ChartApex from "../pages/Charts/Apexcharts";
import ChartistChart from "../pages/Charts/ChartistChart";
import ChartjsChart from "../pages/Charts/ChartjsChart";
import EChart from "../pages/Charts/EChart";
import SparklineChart from "../pages/Charts/SparklineChart";
import ChartsKnob from "../pages/Charts/charts-knob";
import ReCharts from "../pages/Charts/ReCharts";

import Pages404 from "../pages/Utility/pages-404";
import Pages500 from "../pages/Utility/pages-500";
import ContactsProfile from "../pages/Contacts/ContactsProfile/contacts-profile";

import UsuarioDetalle from "../pages/Usuarios/Detail";
import UsuarioList from "../pages/Usuarios/List";

import Backups from "../pages/Backups/List";
import Features from "../pages/Features/List";
import Help from "../pages/Help";
import ComprobantesHistorial from "../pages/Comprobantes/Historial";
import FacturasHistorial from "../pages/Facturas/Historial";

const authProtectedRoutes = [
  { path: "/dashboard", component: Dashboard },
  { path: "/dashboard-saas", component: DashboardSaas },
  { path: "/dashboard-crypto", component: DashboardCrypto },
  { path: "/blog", component: Blog },

  // Clients
  { path: "/clients/create", component: ClientsDetail },
  { path: "/clients/:id", component: ClientsDetail },
  { path: "/clients", component: ClientsList },

  // Comprobantes
  { path: "/journal-vouchers/create", component: ComprobantesDetail },
  { path: "/journal-vouchers/history/:id", component: ComprobantesHistorial },
  { path: "/journal-vouchers/:id", component: ComprobantesDetail },
  { path: "/journal-vouchers", component: ComprobantesList },

  // facturas
  { path: "/bills/create", component: FacturaDetalle },
  { path: "/bills/history/:id", component: FacturasHistorial },
  { path: "/bills/:id", component: FacturaDetalle },
  { path: "/bills", component: FacturaList },

  // usuarios
  { path: "/users/create", component: UsuarioDetalle },
  { path: "/users/:id", component: UsuarioDetalle },
  { path: "/users", component: UsuarioList },

  //backups
  { path: "/backups", component: Backups },

  //backups
  { path: "/features-flags", component: Features },
  { path: "/help", component: Help },

  { path: "/contacts-profile", component: ContactsProfile },

  //Charts
  { path: "/apex-charts", component: ChartApex },
  { path: "/chartist-charts", component: ChartistChart },
  { path: "/chartjs-charts", component: ChartjsChart },
  { path: "/e-charts", component: EChart },
  { path: "/sparkline-charts", component: SparklineChart },
  { path: "/charts-knob", component: ChartsKnob },
  { path: "/re-charts", component: ReCharts },

  //   // this route should be at the end of all other routes
  //   // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: () => <Redirect to="/clients" /> },
];

const publicRoutes = [
  { path: "/logout", component: Logout },
  { path: "/login", component: Login },

  // { path: "/forgot-password", component: ForgetPwd },
  // { path: "/register", component: Register },

  { path: "/pages-404", component: Pages404 },
  { path: "/pages-500", component: Pages500 },
];

export { authProtectedRoutes, publicRoutes };
