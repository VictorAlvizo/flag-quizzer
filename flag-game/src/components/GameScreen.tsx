import React, { useEffect, useState } from "react";
import { Country } from "./Country";
import { CountryData } from "./CountryData";
import "./GameScreen.css";

interface GameScreenProps {
  setOnStartScreen: (value: Boolean) => void;
  setHighscore: (value: number) => void;
  currentHighscore: number; //Need to pass this as well to compare against new score
  questions: number;
}

const GameScreen = ({
  setOnStartScreen,
  setHighscore,
  currentHighscore,
  questions,
}: GameScreenProps) => {
  //States for tracking user performance
  const [questionNum, setQuestionNum] = useState<number>(0);
  const [correctNum, setCorrectNum] = useState<number>(0);
  const [incorrectNum, setIncorrectNum] = useState<number>(0);

  const countryData = CountryData.getInstance();
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    countryName: "United States of America",
    countryISO: "us",
  });

  useEffect(() => {
    //Prevent this data here from getting re-rendered
    countryData.createGame(questions);
    setSelectedCountry(countryData.getQuestion());
  }, []);

  //States for buttons and image
  const [options, setOptions] = useState<string[]>([]);

  const populateQuestions = () => {
    const answerIndex: Number = Math.floor(Math.random() * 4);
    const generatedOptions: string[] = [];

    for (let i = 0; i < 4; i++) {
      generatedOptions.push(
        answerIndex === i
          ? selectedCountry.countryName ?? "NULLSELECTED" //?? means incase its undefined, replace with this default value
          : countryData.getCountry().countryName ?? "NULLRANDOM"
      );
    }

    setOptions(generatedOptions); //Can't just push it directly as react schedules the update.
  };

  useEffect(() => {
    //Using useEffect as it waits for component to mount

    populateQuestions(); //To prevent re-render at initial stage
  }, [selectedCountry]); //Invoke whats encapsulated inside this useEffect() hook when selectedCountry gets updated

  const handleAnswer = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    var buttons = document.getElementsByTagName("button"); //Classname is variable, can't use that

    if (event.currentTarget.textContent === selectedCountry.countryName) {
      //Correct answer
      event.currentTarget.className = "BtnCorrect";
      setCorrectNum(correctNum + 1);
    } else {
      //Answer was wrong
      event.currentTarget.className = "BtnWrong";
      setIncorrectNum(incorrectNum + 1);

      //Find the right answer and make it green
      for (let i = 0; i < buttons.length; i++) {
        if (buttons[i].textContent === selectedCountry.countryName) {
          buttons[i].className = "BtnCorrect";
          break;
        }
      }
    }

    newQuestion();
  };

  async function newQuestion() {
    //Will wait asynchronously and then generate a new question
    await new Promise((resolve) => setTimeout(resolve, 800));

    //Reset all buttons to white css
    var buttons = document.getElementsByTagName("button");
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].className = "BtnOption";
    }

    if (questionNum === questions) {
      //Finished game
      if (correctNum > currentHighscore) {
        setHighscore(correctNum);
      }

      setOnStartScreen(true);
    } else {
      setQuestionNum(questionNum + 1);
    }

    setSelectedCountry(countryData.getQuestion()); //Generate a new question, useEffect() hook handles the rest
  }

  return (
    <div className="GameScreen">
      <div className="QuestionCounterContainer">
        <p className="Questions">
          Questions: {questionNum}/{questions}
        </p>
        <p className="Correct">Correct: {correctNum}</p>
        <p className="Incorrect">Incorrect: {incorrectNum}</p>
      </div>

      <img
        className="FlagQuestion"
        src={"https://flagcdn.com/w1280/" + selectedCountry.countryISO + ".png"}
        alt="Flag"
      ></img>

      <div className="ChoicesDiv">
        <button className="BtnOption" id="btn1" onClick={handleAnswer}>
          {options[0]}
        </button>
        <button className="BtnOption" id="btn2" onClick={handleAnswer}>
          {options[1]}
        </button>
        <button className="BtnOption" id="btn3" onClick={handleAnswer}>
          {options[2]}
        </button>
        <button className="BtnOption" id="btn4" onClick={handleAnswer}>
          {options[3]}
        </button>
      </div>
    </div>
  );
};

export default GameScreen;
