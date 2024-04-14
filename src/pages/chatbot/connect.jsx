import React, { useState, useEffect } from 'react';
import axios from 'axios';

const GyanAi = () => {
  const [inputValue, setInputValue] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [typingIndex, setTypingIndex] = useState(-1); // Index to track typing progress
  const [buttonDisabled, setButtonDisabled] = useState(false); // State to disable the send button
  const [isTyping, setIsTyping] = useState(false); // State to track typing status
 

  useEffect(() => {
    if (chatHistory.length > 0) {
      setIsTyping(false); // Reset typing status when response is received
    }
  }, [chatHistory]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || buttonDisabled) return;

    setLoading(true);
    setIsTyping(true); // AI is typing

    try {
      const question = encodeURIComponent(inputValue);
      const apiUrl = `https://proxy.cors.sh/https://gitagpt.org/api/ask/gita?q=${question}&email=null&locale=en`
      const { data } = await axios.get(apiUrl, {
        headers: {
          'x-cors-api-key': 'temp_5b13b894b970cb9ec711055cb183349b',
        }
      });

      const words = data.response.split(' ');
      const typingEffect = `${words.join(' ')}`;

      setChatHistory([{ question: inputValue, response: typingEffect }]);
      setInputValue('');
      setTypingIndex(0); 

      setTimeout(() => {
        setLoading(false);
        setButtonDisabled(false); // Re-enable the send button
        document.body.style.backgroundColor = '#fff'; // Revert background color
      }, 15000); // 15 seconds timeout

      document.body.style.backgroundColor = '#000'; // Dark background color
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
      setButtonDisabled(false); // Re-enable the send button in case of error
      setIsTyping(false); // AI stopped typing
    }
  };

  useEffect(() => {
    if (typingIndex >= 0) {
      const timer = setTimeout(() => {
        setTypingIndex((prevIndex) => prevIndex + 1); // Move to next word
      }, 45); 

      return () => clearTimeout(timer);
    }
  }, [typingIndex]);

  return (
    <div className='gita-chat-container'>
      <h1>Chitzy AI Chat Bot</h1>
      <div className="chat-container">
        {chatHistory.length === 0 && (
          <p className="empty-state">Start typing your question to begin the conversation...It's still in testing phase due to less amount of data </p>
        )}
        {chatHistory.map((chat, index) => (
          <div key={index} className="chat-item">
            <p> <span className='ai-name'>You:   </span> {chat.question}</p>
            <p>
              <span className='ai-name'>Chitzy Bot:  </span> 
              {loading ? '...' : chat.response.substr(0, typingIndex)}
            </p>
          </div>
        ))}
        {isTyping && (
          <div className="chat-item">
            <p><span className='ai-name'>Chitzy Bot: </span> Typing...</p>
          </div>
        )}
      </div>
      <br />
      <br />
      
      <form onSubmit={handleSubmit} className='ai-form'>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your question..."
          disabled={loading} 
          style={{color: 'black'}}
        />
        <button type="submit" disabled={loading || buttonDisabled}>
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default GyanAi;
