export async function initBranches(){
const resp=await fetch('./data/branches.json');
const data=await resp.json();
document.querySelector('.br-grid').innerHTML=data.map((b,i)=>
`<div class="br-card rv d${i+1}"><div class="br-num">${b.index}</div><div class="br-name">${b.name}</div><div class="br-area">${b.region} · ${b.district}</div><div class="br-info">${b.address}<br>Daily &nbsp;·&nbsp; ${b.hours}</div></div>`
).join('');
}
