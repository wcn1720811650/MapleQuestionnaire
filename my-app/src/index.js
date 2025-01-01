import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Navigate, Routes } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";
import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register"
import ForgotPasswordPage from "./pages/forgotPasswordPage";
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/forgetpassword" element={<ForgotPasswordPage/>} />

          <Route path="*" element={ <Navigate to="/" /> } />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const rootElement = createRoot( document.getElementById("root") )
rootElement.render(<App />);
