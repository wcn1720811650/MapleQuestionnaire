// components/questionnaire/UserQuestionnaires.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import UserQuestionnaireList from './QuestionnaireList/UserQuestionnaireList'; 

export default function UserQuestionnaires() {
  const [userQuestionnaires, setUserQuestionnaires] = useState([]);

  useEffect(() => {
    const fetchUserQuestionnaires = async () => {
      try {
        const response = await axios.get('/api/questionnaires/user-questionnaires', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setUserQuestionnaires(response.data);
      } catch (error) {
        console.error('Failed to obtain user questionnaire:', error);
      }
    };
    fetchUserQuestionnaires();
  }, []);

  return (
    <div>
      <h2>My Questionnaire</h2>
      <UserQuestionnaireList list={userQuestionnaires} /> 
    </div>
  );
}