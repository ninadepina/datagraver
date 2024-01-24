import fs from 'fs';
import { extractPersonData } from './personen.js';

const rawData = fs.readFileSync('static/perioden.json', 'utf-8');
const periodenData = JSON.parse(rawData);

const extractedData = extractPersonData();
const genderCounts = {};

const isInTweedeKamer = (person, periodenData, year) => {
    for (const period of periodenData) {
        const beginYear = parseInt(period.Beginjaar);
        const endYear = period.Eindjaar ? parseInt(period.Eindjaar) : year;
        // prettier-ignore
        if (year >= beginYear && year <= endYear && person.Persoon_id === period.Persoon_id) {
            return true;
        }
    }
    return false;
};

for (let year = 1815; year <= 2024; year++) {
    let menCount = 0;
    let womenCount = 0;
    let nonBinaryCount = 0;

    for (const person of extractedData) {
        if (isInTweedeKamer(person, periodenData, year)) {
            switch (person.Geslacht) {
                case 'm':
                    menCount++;
                    break;
                case 'v':
                    womenCount++;
                    break;
                case 'x':
                    nonBinaryCount++;
                    break;
            }
        }
    }

    genderCounts[year] = {
        men: menCount,
        women: womenCount,
        non_binary: nonBinaryCount
    };
}

fs.writeFileSync('static/geslachtPerJaar.json', JSON.stringify(genderCounts, null, 2));
