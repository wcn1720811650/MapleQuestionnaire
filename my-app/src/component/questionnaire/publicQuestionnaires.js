import React from 'react';
import QuestionnaireList from './QuestionnaireList/QuestionnaireList';

export default function PublicQuestionnaires() {

  return (
    <div>
      <h2>Public Questionnaires</h2>
      <QuestionnaireList
        filterFn={(q) => q.isPublic && q.isDeleted !== true}
        disableSwitch={true}
      />
    </div>
  );
}