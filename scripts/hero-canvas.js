export function initHeroCanvas(){
// hero canvas particles
const cv=document.getElementById('hCanvas');
const cx2=cv.getContext('2d');
let W,H,pts=[];
function rsz(){W=cv.width=cv.offsetWidth;H=cv.height=cv.offsetHeight;}
rsz();window.addEventListener('resize',rsz);
for(let i=0;i<60;i++)pts.push({x:Math.random()*1400,y:Math.random()*900,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.4+.3,o:Math.random()*.3+.04,p:Math.random()*Math.PI*2});
function drawPts(){cx2.clearRect(0,0,W,H);pts.forEach((p,i)=>{p.p+=.007;p.x+=p.vx;p.y+=p.vy;if(p.x<0)p.x=W;if(p.x>W)p.x=0;if(p.y<0)p.y=H;if(p.y>H)p.y=0;const a=p.o*(0.55+0.45*Math.sin(p.p));cx2.beginPath();cx2.arc(p.x,p.y,p.r,0,Math.PI*2);cx2.fillStyle=`rgba(201,168,76,${a})`;cx2.fill();for(let j=i+1;j<pts.length;j++){const q=pts[j],dx=p.x-q.x,dy=p.y-q.y,d=Math.sqrt(dx*dx+dy*dy);if(d<130){cx2.beginPath();cx2.moveTo(p.x,p.y);cx2.lineTo(q.x,q.y);cx2.strokeStyle=`rgba(201,168,76,${(1-d/130)*.065})`;cx2.lineWidth=.5;cx2.stroke();}}});requestAnimationFrame(drawPts);}
drawPts();
}
