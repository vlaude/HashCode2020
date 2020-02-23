import { InputReader } from './input-reader';
import { Processor } from './models/processor.model';
import { Library } from './models/library.model';
import { ResultHandler } from './models/result-handler.model';

console.log(`Let's get started ! 🚀`);

const main = async (filePath: string) => {
    const reader = new InputReader(filePath);
    const scanner = await reader.read();
    const processor = new Processor(scanner);
    const resultHandler = new ResultHandler(scanner.books);

    console.log('Start processing ...');
    while (processor.isScanning()) {
        const bestLibrary: Library = processor.getBestLibrary();

        if (!bestLibrary) {
            break;
        }

        bestLibrary.sort();
        const libraryResult = processor.process(bestLibrary);
        if (libraryResult.booksIndex.length > 0) {
            resultHandler.addResult(libraryResult);
        }
    }
    console.log('Done.');

    const score = resultHandler.getTotalScore();
    console.log(`${resultHandler.libraryResults.length} libraries were scanned.`);
    console.log(`Your total score is: ${score}`);

    const outputFile = 'output/' + new Date().getTime() + '-output';
    console.log(`Saving result into ${outputFile} ...`);
    resultHandler.writeOutput(outputFile);
    console.log('Result saves.');
};

main('input/f_libraries_of_the_world.txt');
