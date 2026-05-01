export function initAtmosphere() {
  const track = document.getElementById("atmTrack");
  if (!track) return;

  const phrases = [
    "Bluewaters Island",
    "Mamsha Al Saadiyat",
    "Kite Beach Dubai",
    "Yas Bay Abu Dhabi",
    "Al Bateen Ladies Club",
    "Warm · Natural · Refreshing",
  ];

  const buildSet = () => phrases.map(phrase => (
    `<span class="atm-phrase">${phrase}</span><span class="atm-sep" aria-hidden="true">◆</span>`
  )).join("");

  track.innerHTML = buildSet() + buildSet();
}
