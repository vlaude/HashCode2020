import { createWriteStream, writeFileSync } from 'fs';

import { LibraryResult } from './library-result.interface';
import { Book } from './book.model';

export class ResultHandler {
    books: Book[];
    libraryResults: LibraryResult[];

    constructor(books: Book[]) {
        this.books = books.slice();
        this.libraryResults = [];
    }

    addResult(libraryResult: LibraryResult) {
        this.libraryResults.push(libraryResult);
    }

    getTotalScore(): number {
        let score = 0;
        const resultLength = this.libraryResults.length;
        for (let i = 0; i < resultLength; i = i + 1) {
            const booksLength = this.libraryResults[i].booksIndex.length;
            for (let j = 0; j < booksLength; j = j + 1) {
                const book = this.books.find(b => b.index === this.libraryResults[i].booksIndex[j]);
                score = score + (book?.score || 0);
            }
        }
        return score;
    }

    writeOutput(destination: string) {
        writeFileSync(destination, '');
        const writer = createWriteStream(destination);
        writer.write(this.libraryResults.length + '\n');
        const resultLength = this.libraryResults.length;
        for (let i = 0; i < resultLength; i = i + 1) {
            const result = this.libraryResults[i];
            writer.write(result.index + ' ' + result.booksIndex.length + '\n');
            let booksIndexToString = result.booksIndex.toString();
            booksIndexToString = booksIndexToString.split(',').join(' ');
            writer.write(booksIndexToString + '\n');
        }
    }
}
