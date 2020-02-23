import { Book } from './book.model';
import { Library } from './library.model';
import { Scanner } from './scanner.model';
import { LibraryResult } from './library-result.interface';

export class Processor {
    scanner: Scanner;
    private currentDay: number;
    availableBooks: Book[];
    availableLibraries: Library[];

    constructor(scanner: Scanner) {
        this.scanner = scanner;
        this.currentDay = 0;
        this.availableBooks = scanner.books;
        this.availableLibraries = scanner.libraries;
    }

    /**
     * Retourne la meilleure librairie à scanner parmis celles disponibles.
     */
    getBestLibrary(): Library {
        return this.availableLibraries[Math.floor(Math.random() * this.availableLibraries.length)];
    }

    /**
     * Scan une librairie.
     * @param library
     */
    process(library: Library): LibraryResult {
        this.currentDay = this.currentDay + library.signUpProcess;
        const daysLeft = this.scanner.daysForScanning - this.currentDay;

        const booksIndex = [];

        for (let i = 0; i < daysLeft; i = i + 1) {
            const book = library.books[i];
            if (book && this.availableBooks.indexOf(book) >= 0) {
                booksIndex.push(library.books[i].index);
                this.availableBooks.splice(this.availableBooks.indexOf(book), 1);
            } else {
                break;
            }
        }

        this.availableLibraries.splice(this.availableLibraries.indexOf(library), 1);

        return {
            index: library.index,
            nbBooks: booksIndex.length,
            booksIndex,
        };
    }

    isScanning(): boolean {
        return this.currentDay < this.scanner.daysForScanning;
    }
}
