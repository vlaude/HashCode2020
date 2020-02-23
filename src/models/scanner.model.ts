import { Library } from './library.model';
import { Book } from './book.model';

export class Scanner {
    daysForScanning: number;
    libraries: Library[];
    books: Book[];

    constructor(daysForScanning: number, libraries: Library[], books: Book[]) {
        this.daysForScanning = daysForScanning;
        this.libraries = libraries;
        this.books = books;
    }

    sortLibraries() {
        this.libraries.forEach(library => { library.sort() });
    }
}
