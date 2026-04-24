export function initHeroCanvas(){
const cv=document.getElementById('hCanvas');
if(!cv||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
const hero=cv.closest('#hero');
const cx2=cv.getContext('2d');
let W,H,pts=[],rafId=0,running=false,resizeTimer=0;
const queueResize=()=>{
  window.clearTimeout(resizeTimer);
  resizeTimer=window.setTimeout(()=>{
    rsz();
    syncPts();
  },150);
};
function rsz(){
  const dpr=Math.min(window.devicePixelRatio||1,2);
  const cssW=Math.max(Math.round(cv.clientWidth||cv.getBoundingClientRect().width||0),1);
  const cssH=Math.max(Math.round(cv.clientHeight||cv.getBoundingClientRect().height||0),1);
  cv.width=Math.floor(cssW*dpr);
  cv.height=Math.floor(cssH*dpr);
  cx2.setTransform(1,0,0,1,0,0);
  cx2.scale(dpr,dpr);
  W=cssW;H=cssH;
}
function syncPts(){
  const count=window.innerWidth<640?25:60;
  if(pts.length!==count){mkPts();return;}
  pts.forEach((p)=>{
    p.x=Math.min(Math.max(p.x,0),Math.max(W,1));
    p.y=Math.min(Math.max(p.y,0),Math.max(H,1));
  });
}
function mkPts(){
  pts=[];
  const count=window.innerWidth<640?25:60;
  for(let i=0;i<count;i++)pts.push({x:Math.random()*Math.max(W,1),y:Math.random()*Math.max(H,1),vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.4+.3,o:Math.random()*.3+.04,p:Math.random()*Math.PI*2});
}
function drawPts(){
  if(!running)return;
  const nextW=Math.max(Math.round(cv.clientWidth||cv.getBoundingClientRect().width||0),1);
  const nextH=Math.max(Math.round(cv.clientHeight||cv.getBoundingClientRect().height||0),1);
  if(nextW!==W||nextH!==H){
    rsz();
    syncPts();
  }
  cx2.clearRect(0,0,W,H);
  pts.forEach((p,i)=>{
    p.p+=.007;p.x+=p.vx;p.y+=p.vy;
    if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;
    const a=p.o*(0.55+0.45*Math.sin(p.p));
    cx2.beginPath();cx2.arc(p.x,p.y,p.r,0,Math.PI*2);cx2.fillStyle=`rgba(201,168,76,${a})`;cx2.fill();
    for(let j=i+1;j<pts.length;j++){
      const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);
      if(d<130){cx2.beginPath();cx2.moveTo(p.x,p.y);cx2.lineTo(q.x,q.y);cx2.strokeStyle=`rgba(201,168,76,${(1-d/130)*.065})`;cx2.lineWidth=.5;cx2.stroke();}
    }
  });
  rafId=requestAnimationFrame(drawPts);
}
function start(){
  if(running)return;
  running=true;
  rafId=requestAnimationFrame(drawPts);
}
function stop(){
  running=false;
  if(rafId)cancelAnimationFrame(rafId);
  rafId=0;
}
rsz();
mkPts();
window.addEventListener('resize',queueResize);
if(window.ResizeObserver&&hero){
  const ro=new ResizeObserver(()=>queueResize());
  ro.observe(hero);
}
new IntersectionObserver(([entry])=>{if(entry?.isIntersecting)start();else stop();}).observe(cv);
}
