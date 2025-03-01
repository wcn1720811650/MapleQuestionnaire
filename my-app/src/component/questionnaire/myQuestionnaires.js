// src/pages/MyQuestionnaires.js
import React, { useEffect, useState } from 'react';
import QuestionnaireList from './QuestionnaireList/QuestionnaireList';
import axios from 'axios';

export default function MyQuestionnaires() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('User is not authenticated');
      }
      const response = await axios.get('/api/groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroups(response.data.groups);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setError(err.message || 'Failed to load groups');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) {
    return (
      <div>
        <h2>My Questionnaires</h2>
        <div className="loading">Loading groups...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>My Questionnaires</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  const handlePublish = async (questionnaireId, groupIds) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('User is not authenticated');
      await axios.post(
        '/api/questionnaires/publish',
        { questionnaireId, groupIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Questionnaire published successfully!');
    } catch (err) {
      console.error('Publish failed:', err);
      alert('Failed to publish questionnaire');
    }
  };

  return (
    <div className="my-questionnaires">
      <h2>My Questionnaires</h2>
      
      <QuestionnaireList
        filterFn={(q) => 
          Number(localStorage.getItem('userId')) === q.userId && 
          !q.isDeleted
        }
        showStar
        showDelete
        groups={groups} 
        onPublish={handlePublish}
      />
    </div>
  );
}