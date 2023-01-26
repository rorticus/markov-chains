import {useEffect, useState} from 'react'
import './App.css'
import {buildMarkovChain, generateText, MarkovChain, parseTokens} from "./markov";

const nGramLength = 3;

function App() {
  const [chain, setChain] = useState<MarkovChain | null>(null);
  const [text, setText] = useState<string | null>(null);
  
  useEffect(() => {
      fetch("./time-machine.txt").then(response => response.text()).then(text => {
          const chain: MarkovChain = {};
          text.split(/[\.\?\!]/).forEach(line => {
              const tokens = parseTokens(line, nGramLength);
              buildMarkovChain(chain, tokens, nGramLength);
          });
          
          setText(generateText(chain, nGramLength));
          setChain(chain);
      });
  }, []);

  return (
    <div className="App">
        {chain === null ? <p>Loading...</p> : <p>{text}</p>}
    </div>
  )
}

export default App
