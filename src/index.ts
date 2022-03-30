import * as fs from 'fs';
import { createStream, SAXStream } from 'sax';

import { ParserStrictness } from './constants';

const formatNode = (node: any): string => {
    try {
        return node?.name.toLowerCase();
    } catch(err) {
        console.error(err);
        return '';
    }
}

const createXmlStreamParser = (
    isParserStrict: boolean,
    options = {}
): SAXStream => {
    try {
        const streamParser = createStream(isParserStrict, options);

        streamParser.on('error', function (err: any) {
            console.error(err)
            streamParser._parser.resume();
        });

        streamParser.on('opentag', function (node) {
            console.debug(`tag: ${formatNode(node)}`);
        });

        streamParser.on('attribute', function(node) {
            console.debug(`attr: ${formatNode(node)}`);   
        });

        return streamParser;
    } catch (err) {
        throw err;
    }
}

const parse = (
    inputPath: string,
    outputPath: string = "intermediate.xml",
    options = {}
) => {
    try {
        const streamParser: SAXStream = createXmlStreamParser(ParserStrictness.LAX, {
            'trim': false,
            'normalize': false,
            'lowercase': false,
            'xmlns': true,
            'position': false,
            'strictEntities': true
        });

        fs.createReadStream(inputPath)
            .pipe(streamParser)
            .pipe(fs.createWriteStream(outputPath));

    } catch (err) {
        console.error(err);
    }
}

export const resolve = (inputPath: string) => {
    parse(inputPath);
}

resolve('vendor/oscal/src/metaschema/oscal_ssp_metaschema.xml');