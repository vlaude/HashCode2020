import { Book } from './book.model';

export class Library {
    index: number;
    signUpProcess: number;
    shipPerDay: number;
    books: Book[];

    constructor(index: number, signUpProcess: number, shipPerDay: number, books: Book[]) {
        this.index = index;
        this.signUpProcess = signUpProcess;
        this.shipPerDay = shipPerDay;
        this.books = books;
    }

    sort() {
        this.books.sort((a, b) => (a.score > b.score ? -1 : 1));
    }

}
