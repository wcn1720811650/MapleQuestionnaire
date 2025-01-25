// src/pages/AllQuestionnaires.jsx
import React from 'react';
import QuestionnaireList from './QuestionnaireList/QuestionnaireList';

export default function AllQuestionnaires() {

  return (
    <div>
      <h2>All Questionnaires</h2>
      <QuestionnaireList
        filterFn={(q) => q.isDeleted !== true}
        showStar
        showDelete
      />
    </div>
  );
}
