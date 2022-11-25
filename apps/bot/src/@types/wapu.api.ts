export interface Timestampable {
  at: number;
}

export interface ApiResponse<
  T extends Record<string, any> = Record<string, any>
> extends Timestampable {
  code: number;
  data: T;
}

export interface ApiResponseError extends Timestampable {
  code: number;
  message: string;
  error?: { [key: string]: any };
}

export interface PagedResponse<
  T extends Record<string, any> = Record<string, any>
> extends ApiResponse {
  data: T[];
  previousPage: number;
  nextPage?: number;
}

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
