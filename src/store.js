// Տվյալների պահպանում (localStorage) եւ կատեգորիաներ
const KEY = "expense-tracker:v1";

export const CATS = {
  food:   { label: "Սնունդ",       color: "#9B1D3F" },
  trans:  { label: "Տրանսպորտ",    color: "#2F6F8F" },
  home:   { label: "Տուն",         color: "#F4A73B" },
  fun:    { label: "Ժամանց",       color: "#6B8E4E" },
  health: { label: "Առողջություն", color: "#7A5CA8" },
  other:  { label: "Այլ",          color: "#8A97A3" },
};

const today = () => new Date().toISOString().slice(0, 10);

const SEED = [
  { amt: 4200,  cat: "food",   note: "Շուկա՝ մրգեր և բանջարեղեն" },
  { amt: 300,   cat: "trans",  note: "Մետրո" },
  { amt: 18500, cat: "home",   note: "Կոմունալ վճարներ" },
  { amt: 3500,  cat: "fun",    note: "Կինո" },
  { amt: 5200,  cat: "health", note: "Դեղատուն" },
].map((x, i) => ({ ...x, id: i + 1, date: today() }));

export function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return SEED;
}

export function save(items) {
  try {
    localStorage.setItem(KEY, JSON.stringify(items));
  } catch {}
}

export const newId = (items) => items.reduce((m, x) => Math.max(m, x.id), 0) + 1;
export { today };
