// components/questionnaire/QuestionnaireQuiz.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import SingleChoiceRender from '../questionType/SingleChoiceRender';
import MultipleChoiceRender from '../questionType/MultipleChoiceRender';
import TextRender from '../questionType/TextRender';
import { Button } from '@mui/material';
export default function QuestionnaireQuiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        const response = await axios.get(`/api/questionnaires/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setQuestionnaire(response.data);
      } catch (error) {
        console.error('Failed to obtain questionnaire:', error);
        navigate('/questionnaire'); 
      }
    };
    fetchQuestionnaire();
  }, [id, navigate]);

  const handleAnswer = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log('Answers to submit:', answers);
      await axios.post(
        `/api/questionnaires/${id}/submit`,
        { answers },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      alert('Submission successful!');
      navigate('/questionnaire');
    } catch (error) {
      console.error('Submission failed:', error);
    }
  };

  if (!questionnaire) return <div>Loading...</div>;

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        {questionnaire.title}
      </Typography>

      {questionnaire.questions.map((question) => (
        <Box key={question.id} mb={3} sx={{ border: '1px solid #eee', p: 2 }}>
            <Typography variant="subtitle1">{question.text}</Typography>
            {question.type === 'singleChoice' && (
            <SingleChoiceRender 
                question={question} 
                onAnswer={handleAnswer} 
                isReadOnly={false} 
            />
            )}
            {question.type === 'multipleChoice' && (
            <MultipleChoiceRender 
                question={question} 
                onAnswer={handleAnswer} 
                isReadOnly={false} 
            />
            )}
            {question.type === 'text' && (
            <TextRender 
                question={question} 
                onAnswer={handleAnswer} 
                isReadOnly={false} 
            />
            )}
        </Box>
        ))}

      <Box mt={4} display="flex" justifyContent="flex-end">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleSubmit} 
        >
          Submit your answer sheet
        </Button>
      </Box>
    </Box>
  );
}