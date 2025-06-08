import { useState, useEffect } from 'react'

const Game = ({ selectedPrompt, correctAnswers, resetGame }) => {
    const [timeLeft, setTimeLeft] = useState(30);
    const [answers, setAnswers] = useState([]);
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);
    const [showResetButton, setShowResetButton] = useState(false);

    useEffect(() => {
        setTimeLeft(30);
        setAnswers([]);
        setResults([]);
    }, [selectedPrompt])

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [timeLeft]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && timeLeft > 0) {
            const trimmedInput = input.trim().toLowerCase();
            const isCorrect = correctAnswers
            .map(a => a.toLowerCase())
            .includes(trimmedInput);  
            if (!answers.map(a => a.toLowerCase()).includes(trimmedInput)) {
                setResults([...results, { answer: input.trim(), isCorrect }]);
                setAnswers([...answers, input.trim()]);
            }      
            setInput('');
        }
    }

return (
    <div>
        <h2>{selectedPrompt.text}</h2>
        {timeLeft > 0 ? <p>Time left: {timeLeft} seconds</p> : <p>Time's up!</p>}
        {timeLeft > 0 ? (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={input}
                onChange={handleInputChange}
                placeholder="Type your answer"
                disabled={timeLeft === 0}
            />
            <button type="submit" disabled={timeLeft === 0}>
                Submit
            </button>
        </form>
        ) : (
         <button onClick={resetGame} style={{ marginTop: '20px' }}>
          Reset Game
         </button>
        )}
        <ul>
            {results.map((result, index) => (
                <li key={index} className={result.isCorrect ? 'correct' : 'incorrect'}>
                    {result.answer} {result.isCorrect ? '✓' : '✗'}
                </li>
            ))}
      </ul>
      {showResetButton && (
        <button onClick={resetGame} style={{ marginTop: '20px' }}>
          Reset Game
        </button>
      )}
    </div>
  );
};

export default Game