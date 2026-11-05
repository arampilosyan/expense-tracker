import "./style.css";
import { CATS, load, save, newId, today } from "./store.js";

let items = load();

const $ = (id) => document.getElementById(id);
const fmt = (n) => n.toLocaleString("en-US").replace(/,/g, "\u202F");
const esc = (s) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const fmtDate = (iso) =>
  new Date(iso + "T00:00:00").toLocaleDateString("hy-AM", { day: "numeric", month: "short" });

// Կատեգորիաների ընտրացանկ
for (const [key, c] of Object.entries(CATS)) {
  $("cat").append(new Option(c.label, key));
}

function render() {
  const month = today().slice(0, 7);
  const thisMonth = items.filter((x) => x.date.startsWith(month));
  const total = thisMonth.reduce((s, x) => s + x.amt, 0);

  $("month").textContent =
    new Date().toLocaleDateString("hy-AM", { month: "long", year: "numeric" }) + "՝ ծախսերը";
  $("total").innerHTML = `${fmt(total)}<small>֏</small>`;
  $("sub").textContent = thisMonth.length
    ? `${thisMonth.length} ծախս այս ամիս`
    : "Դեռ ծախս չկա";

  const sums = {};
  thisMonth.forEach((x) => (sums[x.cat] = (sums[x.cat] || 0) + x.amt));
  const keys = Object.keys(sums).sort((a, b) => sums[b] - sums[a]);

  $("bar").innerHTML = keys
    .map((k) => `<span style="flex-grow:${sums[k]};background:${CATS[k].color}" title="${CATS[k].label}"></span>`)
    .join("");

  $("cats").innerHTML = keys
    .map(
      (k) => `<li>
        <i class="dot" style="background:${CATS[k].color}"></i>
        <span>${CATS[k].label}</span>
        <span class="pct">${Math.round((sums[k] / total) * 100)}%</span>
        <span class="amt">${fmt(sums[k])} ֏</span>
      </li>`
    )
    .join("");

  $("list").innerHTML = thisMonth.length
    ? thisMonth
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id)
        .map(
          (x) => `<li>
            <i class="dot" style="background:${CATS[x.cat].color}"></i>
            <span>
              <span class="note">${esc(x.note) || CATS[x.cat].label}</span>
              <span class="meta">${CATS[x.cat].label} · ${fmtDate(x.date)}</span>
            </span>
            <span class="amt">${fmt(x.amt)} ֏</span>
            <button class="del" data-id="${x.id}" aria-label="Հեռացնել ծախսը">Հեռացնել</button>
          </li>`
        )
        .join("")
    : `<li class="empty">Ավելացրու առաջին ծախսը վերեւի ձեւով։</li>`;
}

$("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const amt = parseInt($("amt").value, 10);
  if (!amt || amt < 1) return;
  items.push({ id: newId(items), amt, cat: $("cat").value, note: $("note").value.trim(), date: today() });
  save(items);
  $("amt").value = "";
  $("note").value = "";
  $("amt").focus();
  render();
});

$("list").addEventListener("click", (e) => {
  const btn = e.target.closest(".del");
  if (!btn) return;
  items = items.filter((x) => x.id !== Number(btn.dataset.id));
  save(items);
  render();
});

render();
