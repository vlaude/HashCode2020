import { createReadStream } from 'fs';
import { split, mapSync } from 'event-stream';

import { Scanner } from './models/scanner.model';
import { Book } from './models/book.model';
import { Library } from './models/library.model';

export class InputReader {
    filePath: string;
    currentLine: number;
    lastLine: string;

    nbBooks: number;
    nbLibrary: number;
    daysForScanning: number;

    books: Book[];
    libraries: Library[];

    constructor(filePath: string) {
        this.filePath = filePath;
        this.currentLine = 0;
        this.lastLine = '';
        this.nbBooks = 0;
        this.nbLibrary = 0;
        this.daysForScanning = 0;
        this.books = [];
        this.libraries = [];
    }

    async read(): Promise<Scanner> {
        console.log('Scanning the file ...');
        return new Promise((resolve, reject) => {
            const stream = createReadStream(this.filePath)
                .pipe(split())
                .pipe(
                    mapSync((line: string) => {
                        stream.pause();
                        switch (this.currentLine) {
                            case 0:
                                this.nbBooks = this.readNbBooks(line);
                                this.nbLibrary = this.readNbLibraries(line);
                                this.daysForScanning = this.readNbDaysForScanning(line);
                                break;
                            case 1:
                                this.books = this.readBooks(line);
                                break;
                            default:
                                if (this.currentLine % 2 !== 0) {
                                    this.libraries.push(
                                        this.readLibraryLines(this.libraries.length, [this.lastLine, line], this.books)
                                    );
                                }
                                break;
                        }

                        this.currentLine = this.currentLine + 1;
                        this.lastLine = line;

                        stream.resume();
                    })
                )
                .on('error', error => {
                    reject(error);
                })
                .on('end', () => {
                    this.currentLine = 0;
                    const scanner = new Scanner(this.daysForScanning, this.libraries, this.books);
                    console.log('File successfully scanned.');
                    resolve(scanner);
                });
        });
    }

    private readNbBooks(line: string): number {
        return Number(line.split(' ')[0]);
    }

    private readNbLibraries(line: string): number {
        return Number(line.split(' ')[1]);
    }

    private readNbDaysForScanning(line: string): number {
        return Number(line.split(' ')[2]);
    }

    private readBooks(line: string): Book[] {
        const scores = line.split(' ');
        if (scores.length !== this.nbBooks) {
            throw new Error('❌ Oh no an error !');
        }
        return scores.map((score, index) => new Book(index, Number(score)));
    }

    private readLibraryLines(nextIndex: number, lines: string[], books: Book[]): Library {

        const firstLineData = lines[0].split(' ');
        const secondLineData = lines[1].split(' ');
        const libBooks = books.filter(book => secondLineData.find(bookIndex => Number(bookIndex) === book.index));
        return new Library(nextIndex, Number(firstLineData[1]), Number(firstLineData[2]), libBooks);
    }
}
