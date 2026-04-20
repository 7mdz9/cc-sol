export async function initMarquee(){
const resp=await fetch('./data/marquee.json');
const data=await resp.json();
const doubled=[...data,...data];
document.querySelector('.marquee-track').innerHTML=doubled.map(label=>`<span class="mi">${label}</span><div class="md"></div>`).join('');
}
