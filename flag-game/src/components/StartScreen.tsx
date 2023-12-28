import React, { useEffect, useState } from "react";
import "./StartScreen.css";
import { CountryData } from "./CountryData";
import { Country } from "./Country";
import { IoLogoReact, IoLogoGithub } from "react-icons/io5";

interface StartScreenProps {
  setOnStartScreen: (value: Boolean) => void;
  setQuestions: (value: number) => void;
  highscore: number;
}

const StartScreen = ({
  setOnStartScreen,
  setQuestions,
  highscore,
}: StartScreenProps) => {
  const inputRef = React.useRef<HTMLInputElement>(null); //Control input properties

  //This is to retrieve a country a show in the <img> tag
  const countryData = CountryData.getInstance();
  const [countryFlag, setCurrentCountry] = useState<Country>(
    countryData.getCountry()
  );

  useEffect(() => {
    const newFlagTimer = setInterval(() => {
      setCurrentCountry(countryData.getCountry());
    }, 1500);

    return () => clearInterval(newFlagTimer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    inputRef.current?.blur(); //Mainly for when user hits enter, de-focus input bar

    let questionCount = inputRef.current?.valueAsNumber ?? 0;
    if (questionCount > 0) {
      setQuestions(questionCount);
      setOnStartScreen(false);
    } else {
      alert("There must be at least 1 question");
    }
  };

  return (
    <div className="StartScreen">
      <header className="GameTitle">What's That Flag!</header>

      <form
        className="UserData"
        name="startForm"
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        <input
          type="number"
          className="UserNameInput"
          name="inputBox"
          placeholder="Enter # of Questions"
          ref={inputRef}
          min={1}
          max={206}
        ></input>
        <button className="StartGameBtn" type="submit">
          Start Game
        </button>
      </form>

      <div className="ScoreTextDiv">
        <p>High Score: {highscore}/207</p>
      </div>

      <img
        className="RandomFlagImg"
        src={"https://flagcdn.com/w1280/" + countryFlag.countryISO + ".png"}
        alt={countryFlag.countryName}
        title={countryFlag.countryName}
      ></img>

      <span
        className="FooterCredit"
        onClick={() => window.open("https://github.com/VictorAlvizo")}
      >
        Made with <IoLogoReact /> by Victor Alvizo <IoLogoGithub />
      </span>
    </div>
  );
};

export default StartScreen;
