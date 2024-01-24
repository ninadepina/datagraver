import fs from 'fs';

const rawData = fs.readFileSync('static/perioden.json', 'utf-8');
const data = JSON.parse(rawData);

const fractieCounts = {};

data.forEach((person) => {
    const beginYear = person.Beginjaar;
    const beginMonth = person.Beginmaand;
    const beginDay = person.Begindag;

    const fractie = person.Fractie;

    if (beginYear === '2023' && beginMonth === '12' && beginDay === '6') {
        fractieCounts[fractie] = (fractieCounts[fractie] || 0) + 1;
    }
});

const totalCount = Object.values(fractieCounts).reduce((acc, count) => acc + count, 0);

console.log('Fractie counts in the year 2023:', fractieCounts);
console.log('Total count:', totalCount);
