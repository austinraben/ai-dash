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
  const [aiPrompt, setAiPrompt] = useState(null);
  const [allAIPrompts, setAllAIPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAI, setLoadingAI] = useState(false);
  const [selectedType, setSelectedType] = useState('predefined');
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchAllAIPrompts = async () => {
    try {
      const response = await fetch('http://localhost:3000/crewai/all-prompts');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data.prompts || [];
    } catch (error) {
      console.error('Error fetching all AI prompts:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await fetch('http://localhost:3000/prompts/predefined');
        const data = await response.json();
        setPrompts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching predefined prompts:', error);
        setLoading(false);
      }
    };
    fetchPrompts();
  }, []);

  useEffect(() => {
    const fetchAiPrompt = async () => {
      if (selectedType === 'ai-generate' && selectedCategory && !aiPrompt) {
        setLoadingAI(true);
        try {
          const response = await fetch(`http://localhost:3000/crewai/generate-prompt?category=${encodeURIComponent(selectedCategory)}`);
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          const data = await response.json();
          if (data.prompt && data.answers && !data.error) {
            const newAiPrompt = { _id: Date.now().toString(), text: data.prompt, answers: data.answers };
            setAiPrompt(newAiPrompt);
            setSelectedPrompt(newAiPrompt);
            const allPrompts = await fetchAllAIPrompts();
            setAllAIPrompts(allPrompts);
          } else {
            alert(`Error generating AI prompt: ${data.error || 'Unknown error'}`);
          }
        } catch (error) {
          alert(`Failed to generate AI prompt: ${error.message}`);
          console.error('AI prompt fetch error:', error);
        } finally {
          setLoadingAI(false);
        }
      }
    };
    fetchAiPrompt();
  }, [selectedType, selectedCategory, aiPrompt]);

  useEffect(() => {
    if (selectedType === 'ai-previous') {
      fetchAllAIPrompts().then(setAllAIPrompts);
    }
  }, [selectedType]);

  const handleSelectType = (e) => {
    const type = e.target.value;
    setSelectedType(type);
    setSelectedPrompt(null);
    setGameStarted(false);
    if (type === 'predefined') setAiPrompt(null);
    if (type !== 'ai-generate') setSelectedCategory('');
  };

  const handleSelectPrompt = (e) => {
    const promptId = e.target.value;
    let prompt;
    if (selectedType === 'predefined') {
      prompt = prompts.find((p) => p._id === promptId);
      prompt.answers = sampleAnswers[prompt.text] || [];
    } else if (selectedType === 'ai-generate') {
      prompt = aiPrompt;
    } else {
      prompt = allAIPrompts.find((p) => p._id === promptId);
    }
    setSelectedPrompt(prompt);
    setGameStarted(false);
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  if (loading) {
    return <div>Loading prompts...</div>;
  }

  return (
    <div>
      {!gameStarted ? (
        <>
          <h2>Select a Prompt Type</h2>
          <select onChange={handleSelectType} value={selectedType}>
            <option value="predefined">Predefined Prompt</option>
            <option value="ai-generate">Generate AI Prompt</option>
            <option value="ai-previous">Previous AI Prompt</option>
          </select>
          <div>
            {selectedType === 'predefined' && (
              <select onChange={handleSelectPrompt} value={selectedPrompt?._id || ''}>
                <option value="">Choose a prompt...</option>
                {prompts.map((prompt) => (
                  <option key={prompt._id} value={prompt._id}>
                    {prompt.text}
                  </option>
                ))}
              </select>
            )}
            {selectedType === 'ai-generate' && (
              <>
                <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
                  <option value="">Choose a category...</option>
                  <option value="Geography">Geography</option>
                  <option value="Food">Food</option>
                  <option value="Basketball">Basketball</option>
                  <option value="American Football">American Football</option>
                  <option value="Weird Facts">Weird Facts</option>
                </select>
                {loadingAI && <div>Loading AI prompt...</div>}
              </>
            )}
            {selectedType === 'ai-previous' && (
              <select onChange={handleSelectPrompt} value={selectedPrompt?._id || ''}>
                <option value="">Choose a previous prompt...</option>
                {allAIPrompts.map((prompt) => (
                  <option key={prompt._id} value={prompt._id}>
                    {prompt.text}
                  </option>
                ))}
              </select>
            )}
          </div>
          {selectedPrompt && !gameStarted && (
            <button onClick={handleStartGame}>Start Game</button>
          )}
        </>
      ) : (
        <Game
          selectedPrompt={selectedPrompt}
          correctAnswers={selectedPrompt.answers || sampleAnswers[selectedPrompt.text] || []}
          resetGame={() => {
            setGameStarted(false);
            setSelectedPrompt(null);
            setSelectedType('predefined');
            setSelectedCategory('');
            setAiPrompt(null);
          }}
        />
      )}
    </div>
  );
};

export default PromptSelector;