// src/pages/RecycleBin.jsx
import React from 'react';
import QuestionnaireList from './QuestionnaireList/QuestionnaireList';

export default function RecycleBin() {

  return (
    <div>
      <h2>Recycle Bin</h2>
      <QuestionnaireList
        filterFn={(q) => q.isDeleted === true}
        showRestore
        showDeleteForever
      />
    </div>
  );
}
