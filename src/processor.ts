import { Book } from './models/book.model';
import { Library } from './models/library.model';
import { Scanner } from './models/scanner.model';
import { LibraryResult } from './models/library-result.interface';

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
     * On prend la lib qui donne le plus de points selon le jour actuel et les livres encore dispos.
     */
    getBestLibrary(): Library | null {
        const daysOff = this.scanner.daysForScanning - this.currentDay;

        let maxScore = 0;
        let libIndexWithMaxScore = -1;

        const availableLibrariesLength = this.availableLibraries.length;
        for (let i = 0; i < availableLibrariesLength; i = i + 1) {
            const lib = this.availableLibraries[i];

            const nbBooks = (daysOff - lib.signUpProcess) * lib.shipPerDay;

            const booksScore = lib.books.filter((b, index) => index <= nbBooks).map(b => b.score);
            const totalLibScore = booksScore.reduce((a, b) => a + b, 0);

            if (maxScore < totalLibScore) {
                maxScore = totalLibScore;
                libIndexWithMaxScore = lib.index;
            }
        }
        return this.availableLibraries.find(l => l.index = libIndexWithMaxScore) || null;

    }

    getRandomLibrary(): Library {
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

            // Check si le livre est dispo
            if (book && this.availableBooks.find(b => b.index === book.index)) {
                booksIndex.push(book.index);
                // Le livre n'est plus dispo
                this.availableBooks.splice(this.availableBooks.findIndex(b => b.index === book.index), 1);
            } else {
                break;
            }
        }

        // La lib n'est plus dispo
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
