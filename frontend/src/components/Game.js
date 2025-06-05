import { useState, useEffect } from 'react'

const Game = ({ selectedPrompt, correctAnswers }) => {
    const [timeLeft, setTimeLeft] = useState(30);
    const [answers, setAnswers] = useState([]);
    const [input, setInput] = useState('');
    const [results, setResults] = useState([]);

    useEffect(() => {
        if (selectedPrompt && timeLeft > 0) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [selectedPrompt, timeLeft]);

    const handleInputChange = (e) => {
        setInput(e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const isCorrect = correctAnswers.map(a => a.toLowerCase()).includes(input.trim().toLowerCase());            setResults([...results, { answers: input.trim(), isCorrect }])
            setResults([...results, { answer: input.trim(), isCorrect }]);
            setAnswers([...answers, input.trim()]);
            setInput('');
        }
    }

    if (!selectedPrompt) {
        return <div>Select a prompt to start the game!</div>;
    }

return (
    <div>
        <h2>{selectedPrompt.text}</h2>
        <p>Time left: {timeLeft} seconds</p>
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Type your answer"
            />
            <button type="submit">Submit</button>
        </form>
        <ul>
            {results.map((result, index) => (
                <li key={index} style={{ color: result.isCorrect ? 'green' : 'red' }}>
                    {result.answer} {result.isCorrect ? '✓' : '✗'}
                </li>
            ))}
      </ul>
    </div>
  );
};

export default Game