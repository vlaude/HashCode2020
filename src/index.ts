import { InputReader } from './input-reader';
import { Processor } from './processor';
import { Library } from './models/library.model';
import { ResultHandler } from './result-handler';

console.log(`Let's get started ! 🚀`);
let fileToRead = '';

const initFileToRead = () => {
    switch (process.argv[2]) {
        case 'a':
            fileToRead = 'input/a_example.txt';
            break;
        case 'b':
            fileToRead = 'input/b_read_on.txt';
            break;
        case 'c':
            fileToRead = 'input/c_incunabula.txt';
            break;
        case 'd':
            fileToRead = 'input/d_tough_choices.txt';
            break;
        case 'e':
            fileToRead = 'input/e_so_many.txt';
            break;
        case 'f':
            fileToRead = 'input/f_libraries_of_the_world.txt';
            break;
        default:
            fileToRead = 'input/d_tough_choices.txt';
            break;
    }
    console.log(`⚔️ File to read: ${fileToRead}`);
};

const main = async (filePath: string) => {
    const reader = new InputReader(filePath);
    const scanner = await reader.read();
    scanner.sortLibraries();
    const processor = new Processor(scanner);
    const resultHandler = new ResultHandler(scanner.books);

    console.log('   🏍 Start processing ...');
    while (processor.isScanning()) {
        const bestLibrary: Library | null = processor.getBestLibrary();
        // const bestLibrary: Library = processor.getRandomLibrary();

        if (!bestLibrary) {
            break;
        }

        const libraryResult = processor.process(bestLibrary);
        if (libraryResult.booksIndex.length > 0) {
            resultHandler.addResult(libraryResult);
        }
    }
    console.log('   👌 Done.');

    const score = resultHandler.getTotalScore();
    console.log(`👉 ${resultHandler.libraryResults.length} libraries were scanned.`);
    console.log(`👉 Your total score is: ⭐️${score}⭐️`);

    const outputFile = 'output/' + new Date().getTime() + '-output';
    console.log(`Saving result into ${outputFile} ...`);
    resultHandler.writeOutput(outputFile);
    console.log('💾 Result saves.');
};

initFileToRead();
main(fileToRead);
