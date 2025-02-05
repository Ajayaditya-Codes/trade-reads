export type Book = {
  id: number;
  title: string;
  thumbnail: string;
  isbn: string;
  recommended?: boolean;
  genre: string[];
};
