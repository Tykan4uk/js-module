import { Genre } from "../models/Genre";

export class dropDownService {
  static genres: Genre[] | undefined;

  static getGenres = async (): Promise<Genre[] | undefined> => {
    let result: Genre[] | undefined;

    if (this.genres === undefined) {
      const response = await fetch('https://musicality-api.azurewebsites.net/DropDown/GetGenres').catch(() => { });

      result = (response?.ok ?? false) ? await response?.json() : undefined;

      this.genres = result;
    } else {
      result = this.genres;
    }

    return result;
  }
}