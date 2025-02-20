// src/pages/StarQuestionnaires.jsx
import React from 'react';
import QuestionnaireList from './QuestionnaireList/QuestionnaireList';

export default function StarQuestionnaires() {

  return (
    <div>
      <h2>Star Questionnaires</h2>
      <QuestionnaireList
        filterFn={(q) => Number(localStorage.getItem('userId')) === q.userId && q.isStarred === true && q.isDeleted !== true}
      />
    </div>
  );
}
