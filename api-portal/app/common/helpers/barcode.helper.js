// const bwipjs = require('bwip-js');
// const logger = require('../classes/logger.class');
// const appRoot = require('app-root-path');
// const path = require('path');
// const fontDir = path.normalize(`${appRoot}/app/common/fonts`);
// const create = async (text, includetext = true) => {
//     try {
//         console.log(__dirname + '/app/common/fonts/Roboto-Bold.ttf')
//         bwipjs.loadFont('ROBOTO',
//             require('fs').readFileSync(fontDir + '/Roboto-Bold.ttf', 'binary'));
//         const buffer = await bwipjs.toBuffer({
//             bcid: 'code128',
//             text,
//             scale: 5,
//             height: 5,
//             includetext,
//             textxalign: 'center',
//             textsize: 6,
//             textgaps:2,
//             textyoffset:1,
//             textfont: 'ROBOTO',
//         })
//         const barcodeBase64 = `data:image/png;base64,${buffer.toString('base64')}`;
//         return barcodeBase64;
//     } catch (error) {
//         logger.error(error, { 'function': 'barcode.helper.create' });
//         return null;
//     }
// };

// Require svg64
const svg64 = require('svg64');
var JsBarcode = require('jsbarcode');
const { DOMImplementation, XMLSerializer } = require('xmldom');

const xmlSerializer = new XMLSerializer();
const document = new DOMImplementation().createDocument('http://www.w3.org/1999/xhtml', 'html', null);
const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

const create = (text, includetext = true) => {
    JsBarcode(svgNode, text, {
        xmlDocument: document,
        displayValue: includetext,
        width: 5,
        // fontOptions: "bold italic",
        fontSize: 60,
        height: 150,
        format: 'CODE39',
    });

    const svgText = xmlSerializer.serializeToString(svgNode);

    // This is your SVG in base64 representation
    const base64fromSVG = svg64(svgText);
    return base64fromSVG;
};

module.exports = {
    create,
};
