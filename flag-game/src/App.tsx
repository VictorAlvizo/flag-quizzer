import React, { useState } from "react";
import "./App.css";
import StartScreen from "./components/StartScreen";
import GameScreen from "./components/GameScreen";

function App() {
  const [onStartScreen, setOnStartScreen] = useState<Boolean>(true);
  const [questions, setQuestions] = useState<number>(1);
  const [highscore, setHighscore] = useState<number>(0);

  return (
    <div className="App">
      {onStartScreen ? (
        <StartScreen
          setOnStartScreen={setOnStartScreen}
          setQuestions={setQuestions}
          highscore={highscore}
        ></StartScreen>
      ) : (
        <GameScreen
          setOnStartScreen={setOnStartScreen}
          setHighscore={setHighscore}
          currentHighscore={highscore}
          questions={questions}
        ></GameScreen>
      )}
    </div>
  );
}

export default App;
