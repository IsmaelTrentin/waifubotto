export interface CharacterSchema {
  _id: number;
  name: string;
  japaneseName?: string;
  aliases: string[];
  image: string;
  favorites: number;
  animeography: CharacterResource[];
  mangaography: CharacterResource[];
  description: string;
}

export interface CharacterResource {
  id: number;
  title: string;
  image: string;
  link: string;
}
