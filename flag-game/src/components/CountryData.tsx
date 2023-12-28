import Countries from "./countries.json";
import { Country } from "./Country";

type CountryMap = {
  [countryName: string]: string;
};

//Singleton class linking JSON country name with country ISO code
export class CountryData {
  private static instance: CountryData;
  private countryMap: CountryMap = {}; //[country name, country ISO] to be used by API for image
  private countryArr: string[] = []; //Array functions as a map [index, name] name to be used in countryMap

  private questionCountriesArr: string[] = []; //Will be used in GameScreen as questions
  private currentCountry: Country | undefined;

  private constructor() {
    Countries.map((countryRecord) => {
      this.countryMap[countryRecord.country] =
        countryRecord.iso_code.toLowerCase(); //API needs ISO codes to be lowercase
      this.countryArr.push(countryRecord.country); //Push country name onto array
    });
  }

  public static getInstance(): CountryData {
    if (!CountryData.instance) {
      CountryData.instance = new CountryData();
    }

    return this.instance;
  }

  public createGame(questions: number) {
    if (questions > this.countryArr.length) {
      alert(
        "Developer: The max number of questions is " +
          this.countryArr.length +
          "!"
      );
      return;
    }
    let copyArr = Object.assign([], this.countryArr); //Create a temp copy to choose my random # countries

    for (let i = 0; i < questions + 1; i++) {
      let chosenIndex: number = Math.floor(Math.random() * copyArr.length);

      this.questionCountriesArr[i] = copyArr[chosenIndex];
      copyArr.splice(chosenIndex, 1);
    }
  }

  public getCountry(index: number = -1): Country {
    //Returns a country from all available, or specific
    //If -1, get a random country
    if (index === -1) {
      do {
        index = Math.floor(Math.random() * this.countryArr.length);
      } while (this.countryArr[index] === this.currentCountry?.countryName);
    }

    const returnCountry: Country = {
      countryName: this.countryArr[index],
      countryISO: this.countryMap[this.countryArr[index]],
    };

    return returnCountry;
  }

  public getQuestion(): Country {
    //Returns a country from a limited subset
    let chosenIndex: number = Math.floor(
      //Still need index to remove it from array
      Math.random() * this.questionCountriesArr.length
    );

    this.currentCountry = {
      countryName: this.questionCountriesArr[chosenIndex],
      countryISO: this.countryMap[this.questionCountriesArr[chosenIndex]],
    };

    this.questionCountriesArr.splice(chosenIndex, 1); //Remove from array of available questions
    return this.currentCountry;
  }
}
