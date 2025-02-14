// src/pages/AllQuestionnaires.js
import React from 'react';
import QuestionnaireList from './QuestionnaireList/QuestionnaireList';

export default function MyQuestionnaires() {

  return (
    <div>
      <h2>My Questionnaires</h2>
      <QuestionnaireList
        filterFn={(q) => Number(localStorage.getItem('userId')) === q.userId && !q.isDeleted}
        showStar
        showDelete
      />
      <div>
      </div>
    </div>
  );
}
