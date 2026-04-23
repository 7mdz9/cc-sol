function buildMenuPicture(id, name) {
  return `
    <picture>
      <source
        type="image/webp"
        srcset="
          public/assets/menu/optimized/${id}-480.webp 480w,
          public/assets/menu/optimized/${id}-800.webp 800w,
          public/assets/menu/optimized/${id}-1200.webp 1200w
        "
        sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 1200px"
      />
      <img
        src="public/assets/menu/optimized/${id}-800.jpg"
        srcset="
          public/assets/menu/optimized/${id}-480.jpg 480w,
          public/assets/menu/optimized/${id}-800.jpg 800w,
          public/assets/menu/optimized/${id}-1200.jpg 1200w
        "
        sizes="(max-width: 640px) 480px, (max-width: 1024px) 800px, 1200px"
        alt="${name}"
        width="800"
        height="1200"
        loading="lazy"
        decoding="async"
      />
    </picture>
  `;
}

export async function initMenu(){
const resp=await fetch('./data/menu.json');
const data=await resp.json();
document.getElementById('menuCats').innerHTML=data.categories.map((cat,index)=>
`<div class="cat">
  <div class="cat-hd">
    <div class="cat-main">
      <span class="cat-idx">${String(index+1).padStart(2,'0')}</span>
      <div class="cat-copy">
        <span class="cat-nm">${cat.name}</span>
        <span class="cat-ct">${cat.items.length} items</span>
      </div>
    </div>
    <div class="cat-ic-wrap"><div class="cat-ic">+</div></div>
  </div>
  <div class="cat-body">
    <div class="cat-items">${cat.items.map(item=>
`<div class="item" data-img="${item.image}" data-name="${item.name}" data-cal="${item.calories}" data-price="${item.priceAed} AED">
  <div class="item-mark"><div class="item-dot"></div><div class="item-line"></div></div>
  <div class="item-info">
    <div class="item-nm">${item.name}</div>
    ${item.subtitle?`<div class="item-note">${item.subtitle}</div>`:''}
  </div>
  <div class="item-r">
    <span class="item-kcal"><strong>${item.calories}</strong> kcal</span>
    <span class="item-price">${item.priceAed} AED</span>
  </div>
</div>`
).join('')}</div>
  </div>
</div>`
).join('');
document.querySelectorAll('.cat-hd').forEach(hd=>{
  hd.addEventListener('click',()=>{
    const c=hd.parentElement,was=c.classList.contains('open');
    document.querySelectorAll('.cat').forEach(x=>x.classList.remove('open'));
    if(!was)c.classList.add('open');
  });
});
const mMedia=document.getElementById('mMedia'),ph=document.getElementById('ph'),
      mOv=document.getElementById('mOv'),ovNm=document.getElementById('ovNm'),
      ovCal=document.getElementById('ovCal'),ovPr=document.getElementById('ovPr'),
      calFill=document.getElementById('calFill');
document.querySelectorAll('.item').forEach(item=>{
  item.addEventListener('click',()=>{
    const src=item.dataset.img,name=item.dataset.name,cal=+item.dataset.cal,price=item.dataset.price;
    mMedia.classList.add('hidden');mOv.classList.remove('show');
    setTimeout(()=>{
      mMedia.innerHTML=buildMenuPicture(src,name);
      const nextImg=mMedia.querySelector('img');
      const onLoad=()=>{
        mMedia.classList.remove('hidden');
        ph.classList.add('gone');
        ovNm.textContent=name;
        ovCal.textContent=cal;
        ovPr.textContent=price;
        calFill.style.width=Math.min(100,Math.round(cal/300*100))+'%';
        mOv.classList.add('show');
      };
      if(nextImg.complete)onLoad();
      else nextImg.addEventListener('load',onLoad,{once:true});
    },300);
    document.querySelectorAll('.item').forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
  });
});
document.getElementById('calSw').addEventListener('change',function(){
  document.querySelectorAll('.item-kcal').forEach(el=>el.classList.toggle('show',this.checked));
});
}
