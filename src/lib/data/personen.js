import fs from 'fs';

const rawData = fs.readFileSync('static/personen.json', 'utf-8');
const data = JSON.parse(rawData);

const extractPersonData = () => {
    const newListOfPersons = data.map((person) => {
        return {
            Persoon_id: person.Persoonnummer,
            Geslacht: person.Geslacht
        };
    });

    return newListOfPersons;
};

export { extractPersonData };
