export async function initSupport(){
const resp=await fetch('./data/contact.json');
const data=await resp.json();
document.querySelector('.sup-btns').innerHTML=data.channels.map(ch=>
`<a href="${ch.href}" class="sup-btn"><span class="sb-ic">${ch.emoji}</span><div class="sb-tx"><span class="sb-lbl">${ch.label}</span><span class="sb-val">${ch.value}</span></div><span class="sb-arr">→</span></a>`
).join('');
document.querySelector('.sup-hrs-tx').innerHTML=data.hours.map(h=>`${h.days} &nbsp;·&nbsp; ${h.time}`).join('<br>');
}
