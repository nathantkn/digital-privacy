import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mikeAvatar from "../assets/mike.webp";
import "../styles/Reflection.css";

const questions = [
  {
    question: "Which of these is okay to share online?",
    options: ["Your favorite color 🎨", "Your home address 🏠", "Your full name 🧑"],
    correct: 0,
    explanations: [
      "Yes! Favorite colors are fun and safe to share. 🎨",
      "Oops! Home addresses are private. Keep them safe! 🏠",
      "Yikes! Full names are best kept secret online. 🧑",
    ],
  },
  {
    question: "Which is safer to share with a new online friend?",
    options: ["Your pet's name 🐶", "What school you go to 🏫", "Your house number 🔢"],
    correct: 0,
    explanations: [
      "Right! Pet names are usually fine. 🐶",
      "Not quite! School info is private. 🏫",
      "Oops! Don’t share your address numbers online. 🔢",
    ],
  },
  {
    question: "What should you never post online?",
    options: ["A silly nickname 🤪", "Your exact location 📍", "A photo of your lunch 🍔"],
    correct: 1,
    explanations: [
      "Silly nicknames are okay — and fun! 🤪",
      "Correct! Location sharing can be risky. 📍",
      "Lunch photos are usually safe (and yummy)! 🍔",
    ],
  },
];

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
    }, 2000);
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
        <img src={mikeAvatar} alt="Mike" className="reflection-mike" />

        {!quizDone ? (
          <>
            <h2>{currentQuestion.question}</h2>
            {currentQuestion.options.map((opt, idx) => (
              <button
                key={idx}
                className="reflection-btn"
                onClick={() => handleChoice(idx)}
                disabled={selected !== null}
              >
                {opt}
              </button>
            ))}
            {showExplanation && (
              <p className="reflection-feedback">
                {currentQuestion.explanations[selected]}
              </p>
            )}
          </>
        ) : (
          <>
            <h2>🎉 You got {score} out of {questions.length} correct!</h2>
            <p>
              Remember: It’s smart to keep private info like your real name, address, and passwords to yourself.
              You're now a privacy pro! 🧠🔐
            </p>
            <button onClick={retryReflection} className="reflection-restart-btn">🔁 Retry Reflection</button>
            <button onClick={restartApp} className="reflection-restart-btn">🏁 Restart App</button>
          </>
        )}
      </div>
    </div>
  );
}
