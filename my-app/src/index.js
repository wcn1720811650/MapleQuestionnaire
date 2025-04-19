import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ThemeProvider } from '@mui/material/styles';
import theme from "./theme";
import Home from "./pages/home";
import Login from "./pages/login";
import DashboardLayoutBasic from "./pages/questionnaire";
import QuestionnaireQuiz from "./component/questionnaire/QuestionnaireQuiz"
import ConsultantDashboard from "./pages/ConsultantDashboard";
import SubmissionDetails from "./pages/SubmissionDetails";
import UserSuggestions from "./pages/UserSuggestions";
import ConsultantSuggestions from "./pages/ConsultantSuggestions";
import MyAnswers from "./pages/MyAnswers";
import AIPsychologicalAdvice from "./pages/AIPsychologicalAdvice";

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/questionnaire" element={<DashboardLayoutBasic/>} />
          <Route path="/quiz/:id" element={<QuestionnaireQuiz/>} />
          <Route path="/submissions" element={<ConsultantDashboard/>} />
          <Route path="/submissions/:userId/:questionnaireId" element={<SubmissionDetails/>} />
          <Route path="/user/suggestions" element={<UserSuggestions />} />
          <Route path="/consultantSuggestions" element={<ConsultantSuggestions />} />
          <Route path="/my-answers" element={<MyAnswers />} />
          <Route path="/ai-psychological-advice/:answerId" element={<AIPsychologicalAdvice />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

const rootElement = createRoot( document.getElementById("root") )
rootElement.render(<App />);
