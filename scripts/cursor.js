export function initCursor(){
const isCoarsePointer=window.matchMedia('(pointer: coarse)').matches;
const isTouch='ontouchstart' in window||navigator.maxTouchPoints>0;
if(isCoarsePointer||isTouch){
  return;
}
const C=document.getElementById('C'),CR=document.getElementById('CR');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;C.style.left=mx+'px';C.style.top=my+'px';});
(function loop(){rx+=(mx-rx)*.1;ry+=(my-ry)*.1;CR.style.left=rx+'px';CR.style.top=ry+'px';requestAnimationFrame(loop);})();
document.querySelectorAll('a,.sup-btn,.item,.cat-hd,.mc,.br-card').forEach(el=>{
  el.addEventListener('mouseenter',()=>{C.classList.add('big');CR.classList.add('big');});
  el.addEventListener('mouseleave',()=>{C.classList.remove('big');CR.classList.remove('big');});
});
}
