// import fs from "fs";
import { promises as fs } from 'fs';
import { PDFParse } from "pdf-parse";

/**
 * Extract text from pdf file
 * @param {string} filepath - Path to pdf file 
 * @returns {Promise<{text:string, numPages:number}>}
 */

export const extractTextFromPDF = async (filepath) => {
    try {
        const dataBuffer = await fs.readFile(filepath);
        //pdf-parse expects a Unit8Array, not a Buffer
        const parser = new PDFParse(new Uint8Array(dataBuffer));
        const data = await parser.getText();

        return {
            text : data.text,
            numPages: data.numpages,
            info: data.info
        };
    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error('Failed to extract text from PDF');
    }
};