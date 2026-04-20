export function initMenu(){
document.querySelectorAll('.cat-hd').forEach(hd=>{
  hd.addEventListener('click',()=>{
    const c=hd.parentElement,was=c.classList.contains('open');
    document.querySelectorAll('.cat').forEach(x=>x.classList.remove('open'));
    if(!was)c.classList.add('open');
  });
});
const mImg=document.getElementById('mImg'),ph=document.getElementById('ph'),
      mOv=document.getElementById('mOv'),ovNm=document.getElementById('ovNm'),
      ovCal=document.getElementById('ovCal'),ovPr=document.getElementById('ovPr'),
      calFill=document.getElementById('calFill');
document.querySelectorAll('.item').forEach(item=>{
  item.addEventListener('click',()=>{
    const src=item.dataset.img,name=item.dataset.name,cal=+item.dataset.cal,price=item.dataset.price;
    mImg.classList.add('hidden');mOv.classList.remove('show');
    setTimeout(()=>{mImg.src=src;mImg.onload=()=>{mImg.classList.remove('hidden');ph.classList.add('gone');ovNm.textContent=name;ovCal.textContent=cal;ovPr.textContent=price;calFill.style.width=Math.min(100,Math.round(cal/300*100))+'%';mOv.classList.add('show');};},300);
    document.querySelectorAll('.item').forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
  });
});
document.getElementById('calSw').addEventListener('change',function(){
  document.querySelectorAll('.item-kcal').forEach(el=>el.classList.toggle('show',this.checked));
});
}
