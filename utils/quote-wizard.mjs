// The logic of the quote page (components/QuoteWizard.jsx). The packages, prices and texts are in
// messages/nl/pages/offerte.json under "wizard".

export const STEPS = ['need', 'sector', 'features', 'payment', 'timing'];

export const emptyAnswers = () => ({ need: '', sector: '', features: [], payment: '', timing: '' });

const isAnswered = (answers, key) => key === 'features' ? answers.features.length > 0 : Boolean(answers[key]);

// The first question after `from` without an answer, or the proposal (STEPS.length) when all are answered.
export function nextStep(answers, from = -1) {
    for (let index = from + 1; index < STEPS.length; index += 1) {
        if (!isAnswered(answers, STEPS[index])) return index;
    }
    return STEPS.length;
}

// Sectors without their own packages use the general ones.
const packagesFor = (wizard, sector) => wizard.sectors[sector]?.packages || wizard.packages;

/*
 * The cheapest package that covers every chosen feature. A webshop or custom project, or a feature that no package
 * covers, gets the custom package: a fixed price after a short call.
 */
export function recommend(wizard, answers) {
    const wanted = answers.features.filter(feature => feature !== 'none');
    const match = answers.need !== 'custom'
        && packagesFor(wizard, answers.sector).find(item => wanted.every(feature => item.covers.includes(feature)));
    return match || wizard.custom;
}

/*
 * The answers a ?pakket= link fills in. It takes the same values as the quote buttons (?offerte=): a package
 * ("premium"), a sector ("kapper") or both ("kapper-premium"), plus "op-maat" and "eenmalig".
 */
export function prefill(wizard, value) {
    const answers = emptyAnswers();
    let rest = String(value || '').trim().toLowerCase();
    const sector = Object.keys(wizard.sectors).find(key => rest === key || rest.startsWith(`${key}-`));
    if (sector) {
        answers.sector = sector;
        rest = rest.slice(sector.length + 1);
    }
    if (rest === 'op-maat') answers.need = 'custom';
    else if (rest === 'eenmalig') answers.payment = 'onetime';
    else {
        const item = packagesFor(wizard, sector).find(pkg => pkg.key === rest);
        if (item) answers.features = item.covers.length ? [...item.covers] : ['none'];
    }
    return answers;
}

export const euro = value => `€${new Intl.NumberFormat('nl-BE').format(value)}`;

/*
 * The price of the recommended package as one line, for the page and the email. The texts come from the wizard JSON.
 * One-time payment only has a published price where one exists (taxi); restaurant reservations and ordering are only
 * offered per month.
 */
export function priceLine(wizard, item, payment) {
    const { prices } = wizard;
    if (!item.monthly) return prices.custom;
    if (payment === 'onetime' && !item.monthlyOnly) {
        return item.oneTime ? prices.oneTimeFrom.replace('{price}', euro(item.oneTime)) : prices.custom;
    }
    return prices.monthly.replace('{price}', euro(item.monthly));
}
