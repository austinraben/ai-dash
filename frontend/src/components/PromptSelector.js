import { useState, useEffect } from 'react';
import Game from './Game';

const sampleAnswers = {
  'Name basketball players who have won an NBA championship': ['LeBron James', 'Dirk Nowitzki', 'Michael Jordan', 'Alisa Miller'],
  'Name American football teams in the NFL': ['Patriots', 'Cowboys', 'Packers'],
  'Name countries that start with the letter A': ['Argentina', 'Australia', 'Austria'],
  'Name foods that are spicy': ['Chili', 'Curry', 'Wasabi'],
  'Name objects found in a kitchen': ['Fork', 'Knife', 'Spoon'],
  'Name programming languages that are popular': ['JavaScript', 'Python', 'Java'],
  'Name things that are hilariously weird': ['Clowns', 'Unicorns', 'Pineapple on pizza'],
};

const PromptSelector = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('http://localhost:3000/prompts/predefined');
        const data = await response.json();
        setPrompts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching prompts:', error);
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  const handleSelectPrompt = (e) => {
    const promptId = e.target.value;
    const prompt = prompts.find((p) => p._id === promptId);
    setSelectedPrompt(prompt);
    setGameStarted(false);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  }

  if (loading) {
    return <div>Loading prompts...</div>;
  }

  return (
    <div>
        <h2>Select a Prompt</h2>
            <select onChange={handleSelectPrompt}>
                <option value="">Choose a prompt...</option>
                    {prompts.map((prompt) => (
                    <option key={prompt._id} value={prompt._id}>
                        {prompt.text}
                    </option>
                    ))}
            </select>
            {selectedPrompt && !gameStarted && (
                <button onClick={handleStartGame}>Start Game</button>
            )}
            {gameStarted && (
                <Game 
                    selectedPrompt={selectedPrompt} 
                    correctAnswers={sampleAnswers[selectedPrompt?.text] || []}                
                />
            )}
        </div>
    );
};

export default PromptSelector;