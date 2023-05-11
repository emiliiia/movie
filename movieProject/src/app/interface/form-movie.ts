export interface FormMovie{
  id: number;
  name: string;
  year: number;
  genre: string;
  boxOfficeFees: number;
  country: string;
  company: string;
  cast: [];
  description: string;
  director: string;
  addedDate: Date;
  isFavourite: boolean;
}
