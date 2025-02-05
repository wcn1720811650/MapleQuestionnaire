import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";
import Home from "./pages/home";
import Login from "./pages/login";
import DashboardLayoutBasic from "./pages/questionnaire";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/questionnaire" element={<DashboardLayoutBasic/>} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const rootElement = createRoot( document.getElementById("root") )
rootElement.render(<App />);
