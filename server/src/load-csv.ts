import fs from 'fs';

export function loadCsv(filePath: string): any[] {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const fields = splitContentToFields(fileContent);
        if (fields.length > 1) {
            return createObjects(fields.shift() as string[], fields);
        }
        return [];
    } catch {
        return [];
    }
}

function splitContentToFields(content: string): string[][] {
    return content
        // split to rows
        .split(/(\r*\n)+/gm)
        // exclude empty rows
        .filter(row => {
            return !/(\r*\n)+/gm.test(row);
        })
        // split to fields and remove quotes
        .map(row => {
            return row.split(',').map(field => field.replace(/^"(.*)"$/, '$1'))
        });
}

function createObjects(fieldNames: string[], fieldValues: string[][]): any[] {
    return fieldValues.map(values => {
        const resultObject: any = {};
        fieldNames.forEach((fieldName, idx) => {
            resultObject[fieldName] = values[idx];
        });
        return resultObject;
    });
}