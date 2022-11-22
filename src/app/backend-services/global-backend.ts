import { HttpHeaders } from '@angular/common/http';


export const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
  })
};

export type Partial<T> = {
    [P in keyof T]?: T[P];
}

export const BASE_API_URL = 'https://api.scorelisto.com';
