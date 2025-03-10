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

  const handlePublish = async (qid, groupIds) => {
    try {
      if (!Number.isInteger(qid) || !Array.isArray(groupIds) || groupIds.length === 0) {
        alert('问卷ID和群组ID必须为有效的整数数组');
        return;
      }
  
      const response = await axios.post(
        '/api/questionnaires/publish',
        { questionnaireId: qid, groupIds },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
  
      console.log('Publish success:', response.data);
      await fetchGroups();
      alert('问卷发布成功');
    } catch (error) {
      let errorMessage = '发布失败，请稍后再试';
      if (error.response) {
        errorMessage = error.response.data?.error || error.response.statusText || errorMessage;
      } else if (error.request) {
        errorMessage = '无法连接到服务器，请检查网络';
      } else {
        errorMessage = error.message || errorMessage;
      }
  
      console.error('Publish failed:', errorMessage);
      alert(errorMessage);
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
        showPublish
      />
    </div>
  );
}