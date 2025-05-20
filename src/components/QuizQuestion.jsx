import "../styles/QuizQuestion.css";

export default function QuizQuestion({ 
    question, 
    options, 
    explanations, 
    correct, 
    selected, 
    showExplanation, 
    onSelect 
}) {
    // Function to determine button class based on selection
    const getButtonClass = (index) => {
        if (selected === null) return "reflection-btn";
    
        if (index === correct) {
            return "reflection-btn reflection-btn-correct";
        }
    
        return selected === index && index !== correct 
            ? "reflection-btn reflection-btn-incorrect" 
            : "reflection-btn";
    };

    return (
        <>
            <h2>{question}</h2>
            {options.map((opt, idx) => (
                    <button
                        key={idx}
                        className={getButtonClass(idx)}
                        onClick={() => onSelect(idx)}
                        disabled={selected !== null}
                    >
                        {opt}
                    </button>
            ))}
            {showExplanation && (
                    <p className="reflection-feedback">
                        {explanations[selected]}
                    </p>
            )}
        </>
    );
}