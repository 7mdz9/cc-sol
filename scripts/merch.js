export async function initMerch(){
const data=await fetch('./data/merch.json').then(r=>r.json());
const cards=await Promise.all(data.map(async item=>{
  const svgText=await fetch('./components/merch-svgs/'+item.svg).then(r=>r.text());
  return '<div class="mc rv '+item.revealClass+'"><div class="mc-img">'+svgText+'<div class="mc-layer">Coming Soon</div></div><div class="mc-name">'+item.name+'</div></div>';
}));
document.querySelector('.merch-grid').innerHTML=cards.join('');
}
