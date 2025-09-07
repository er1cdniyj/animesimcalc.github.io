// Parsing/formatting helpers

export function parseNumberWithSuffix(input) {
    if (!input) return NaN;
    if (/^[0-9.]+e[0-9]+$/i.test(input)) return parseFloat(input);
    input = input.toString().trim().toLowerCase();
    const suffixes = { k:1e3,m:1e6,b:1e9,t:1e12,qd:1e15,qn:1e18,sx:1e21,sp:1e24,oc:1e27,no:1e30,dc:1e33 };
    let suffix = '', numberPart = input;
    for (const s in suffixes) {
        if (input.endsWith(s)) { suffix = s; numberPart = input.slice(0, -s.length); break; }
    }
    const number = parseFloat(numberPart);
    return isNaN(number) ? NaN : suffix ? number * suffixes[suffix] : number;
}

export function abbreviateNumber(num) {
    const units = [
        {v:1e33,s:"Dc"},{v:1e30,s:"No"},{v:1e27,s:"Oc"},{v:1e24,s:"Sp"},
        {v:1e21,s:"Sx"},{v:1e18,s:"Qn"},{v:1e15,s:"Qd"},{v:1e12,s:"T"},
        {v:1e9,s:"B"},{v:1e6,s:"M"},{v:1e3,s:"K"}
    ];
    for (const {v,s} of units) if (num >= v) return (num/v).toFixed(2)+s;
    return (Number.isFinite(num) ? num : 0).toString();
}

export function formatNumber(num) {
    if (num >= 1000000) return (num/1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num/1000).toFixed(1) + 'K';
    return (Number.isFinite(num) ? num : 0).toString();
}

export function formatTime(minutes) {
    if (minutes < 60) return `${minutes.toFixed(1)} minutes`;
    const hours = minutes / 60;
    if (hours < 24) return `${hours.toFixed(1)} hours`;
    const days = hours / 24;
    return `${days.toFixed(1)} days`;
}
