export function initReveal(){
const obs=new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('in');}),{threshold:.08});
document.querySelectorAll('.rv,.rl,.rr').forEach(el=>obs.observe(el));
}
