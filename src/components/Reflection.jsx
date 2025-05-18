import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mikeAvatar from "../assets/mike.webp";
import "../styles/Reflection.css";

const questions = [
  {
    text: "Which of these is okay to share online?",
    options: [
      { text: "Your home address 🏠", correct: false },
      { text: "Your favorite game 🎮", correct: true },
      { text: "Your full name 👤", correct: false },
    ],
    explanation: "It’s okay to share things like your favorite game, but not private details like your address or full name.",
  },
  {
    text: "What should you keep private?",
    options: [
      { text: "Your password 🔐", correct: true },
      { text: "Your favorite color 🎨", correct: false },
      { text: "Your favorite movie 🎥", correct: false },
    ],
    explanation: "Passwords help protect your accounts, so they should stay secret!",
  },
  {
    text: "Which of these is safest to share?",
    options: [
      { text: "A silly nickname 🤪", correct: true },
      { text: "Your school name 🏫", correct: false },
      { text: "Your street name 🏝️", correct: false },
    ],
    explanation: "Nicknames are fun and safe. Things like your school or street name can reveal too much!",
  },
];

function Reflection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const navigate = useNavigate();

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (option) => {
    setSelected(option);
    setIsCorrect(option.correct);
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setIsCorrect(null);
      setShowExplanation(false);
    } else {
      navigate("/"); // or a summary page
    }
  };

  const retryQuestion = () => {
    setSelected(null);
    setIsCorrect(null);
    setShowExplanation(false);
  };

  return (
    <div className="reflection-container">
      <div className="quiz-box">
        <img src={mikeAvatar} alt="Mike" className="mike-icon" />
        <h2>{currentQuestion.text}</h2>

        <div className="answers">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={showExplanation}
              className={`answer-btn ${selected === option ? (option.correct ? "correct" : "incorrect") : ""}`}
            >
              {option.text}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="feedback">
            <p>{currentQuestion.explanation}</p>
            {isCorrect ? (
              <button onClick={handleNext}>Next Question</button>
            ) : (
              <button onClick={retryQuestion}>Try Again</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reflection;
