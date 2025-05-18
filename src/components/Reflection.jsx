import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Reflection.css";

const questions = [
  {
    id: "q1",
    text: "Which of these is okay to share online?",
    options: [
      { label: "Your home address 🏡", correct: false },
      { label: "Your favorite game 🎮", correct: true },
      { label: "Your full name 👶", correct: false },
    ],
  },
  {
    id: "q2",
    text: "What should you keep private?",
    options: [
      { label: "Your password 🔒", correct: true },
      { label: "Your favorite color 🎨", correct: false },
      { label: "Your favorite movie 🎬", correct: false },
    ],
  },
  {
    id: "q3",
    text: "Which of these is safest to share?",
    options: [
      { label: "A silly nickname 🤪", correct: true },
      { label: "Your school name 🏫", correct: false },
      { label: "Your street name 🏝️", correct: false },
    ],
  },
];

export default function Reflection() {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSelect = (questionId, selectedOption) => {
    setAnswers(prev => ({ ...prev, [questionId]: selectedOption }));
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const handleRestart = () => {
    navigate("/");
  };

  const getScore = () => {
    return questions.reduce((score, q) => {
      const selected = answers[q.id];
      const correct = q.options.find(o => o.correct)?.label;
      return selected === correct ? score + 1 : score;
    }, 0);
  };

  return (
    <div className="reflection-container">
      <h1 className="reflection-title">🎓 Let's Reflect!</h1>

      {questions.map(q => (
        <div key={q.id} className="question-block">
          <p className="question-text">{q.text}</p>
          <div className="options-container">
            {q.options.map(option => (
              <button
                key={option.label}
                className={`quiz-option ${answers[q.id] === option.label ? "selected" : ""}`}
                onClick={() => handleSelect(q.id, option.label)}
                disabled={showResults}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      ))}

      {!showResults ? (
        <button className="submit-btn" onClick={handleSubmit}>
          ✅ Check Answers
        </button>
      ) : (
        <div className="results">
          <p>🎉 You got <strong>{getScore()}</strong> out of <strong>{questions.length}</strong> correct!</p>
          <p className="explanation">
            It's important to protect private info like your real name, password, or where you live. Great job thinking before you share! 💡
          </p>
          <button className="restart-btn" onClick={handleRestart}>
            🔁 Back to Start
          </button>
        </div>
      )}
    </div>
  );
}
