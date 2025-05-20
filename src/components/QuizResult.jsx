import "../styles/QuizResult.css";

const finalMessage = [
    "Oops! It seems you need to learn more about privacy. Don't worry, you can try again! 📚",
    "Oh no! It looks like you need to learn more about privacy. Try again!",
    "You're getting there! Keep practicing to be a privacy pro! 🛡️",
    "Good work! You’re learning to be smart online! 💻",
    "Great job! You know how to keep your info safe! 🧠🔐",
]

export default function QuizResult({ score, totalQuestions, onRetry, onRestart }) {
    return (
        <>
            <h2>🎉 You got {score} out of {totalQuestions} correct!</h2>
            <p>
                {finalMessage[score]} <br />
                Remember: It's smart to keep private info like your real name, address, and passwords to yourself.
            </p>
            <div className="reflection-buttons-container">
                    <button onClick={onRetry} className="reflection-restart-btn">🔁 Retry Reflection</button>
                    <button onClick={onRestart} className="reflection-restart-btn">🏁 Restart App</button>
            </div>
        </>
    );
}