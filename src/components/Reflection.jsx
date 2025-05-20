import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mikeAvatar from "../assets/mike-animated.png";
import "../styles/Reflection.css";
import QuizQuestion from "./QuizQuestion";
import QuizResult from "./QuizResult";
import { questions } from "../data/quizData";

export default function Reflection() {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizDone, setQuizDone] = useState(false);
  const navigate = useNavigate();

  const handleChoice = (index) => {
    if (selected !== null) return;

    setSelected(index);
    setShowExplanation(true);

    if (index === questions[current].correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowExplanation(false);
      setSelected(null);
      if (current + 1 < questions.length) {
        setCurrent(current + 1);
      } else {
        setQuizDone(true);
      }
    }, 3000);
  };

  const restartApp = () => navigate("/");
  const retryReflection = () => {
    setCurrent(0);
    setScore(0);
    setSelected(null);
    setShowExplanation(false);
    setQuizDone(false);
  };

  const currentQuestion = questions[current];

  return (
    <div className="reflection-outer-box">
      <div className="reflection-inner-box">
        <img src={mikeAvatar} className="reflection-mike" />

        {!quizDone ? (
          <QuizQuestion
            question={currentQuestion.question}
            options={currentQuestion.options}
            explanations={currentQuestion.explanations}
            correct={currentQuestion.correct}
            selected={selected}
            showExplanation={showExplanation}
            onSelect={handleChoice}
          />
        ) : (
          <QuizResult 
            score={score} 
            totalQuestions={questions.length}
            onRetry={retryReflection}
            onRestart={restartApp}
          />
        )}
      </div>
    </div>
  );
}
