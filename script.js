const PRODUCTS = [
  {id:'bat1', name:'English Willow Bat', category:'Bats', price:5999, image:'assets/bat.jpg', badge:'Popular', rating:'4.8', reviews:120, desc:'Premium English willow with balanced pickup and clean power.'},
  {id:'bat2', name:'Power Drive Bat', category:'Bats', price:4499, image:'assets/bat.jpg', rating:'4.7', reviews:84, desc:'A strong all-round bat for club and match play.'},
  {id:'ball1', name:'Leather Match Ball', category:'Balls', price:499, image:'assets/ball.jpg', badge:'Best seller', rating:'4.9', reviews:91, desc:'Hand-stitched leather ball for match-ready sessions.'},
  {id:'helmet1', name:'Pro Cricket Helmet', category:'Helmets', price:3499, image:'assets/helmet.jpg', rating:'4.8', reviews:76, desc:'Modern protection with a lightweight shell and grille.'},
  {id:'pads1', name:'Pro Batting Pads', category:'Pads', price:2999, image:'assets/pads.jpg', rating:'4.6', reviews:63, desc:'Comfort-focused padding with secure straps and coverage.'},
  {id:'gloves1', name:'Pro Batting Gloves', category:'Gloves', price:2499, image:'assets/gloves.jpg', rating:'4.7', reviews:88, desc:'Impact protection with flexible grip and match comfort.'},
  {id:'kit1', name:'GameOn Cricket Kit', category:'Kits', price:7999, image:'assets/kit.jpg', badge:'Complete kit', rating:'4.8', reviews:57, desc:'A practical all-in-one setup for training and matches.'},
  {id:'kit2', name:'Club Starter Kit', category:'Kits', price:6499, image:'assets/kit.jpg', rating:'4.5', reviews:42, desc:'Core cricket essentials packed into one clean package.'}
];

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const money = n => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',maximumFractionDigits:0}).format(n);
const cartKey = 'gameon-v3-cart';
const wishKey = 'gameon-v3-wishlist';
const getCart = () => JSON.parse(localStorage.getItem(cartKey) || '[]');
const setCart = c => { localStorage.setItem(cartKey, JSON.stringify(c)); updateCartUI(); };
const getWish = () => JSON.parse(localStorage.getItem(wishKey) || '[]');
const setWish = w => localStorage.setItem(wishKey, JSON.stringify(w));

function toast(msg){ const el=$('#toast'); if(!el) return; el.textContent=msg; el.classList.add('show'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>el.classList.remove('show'),2300); }
function updateCartUI(){
  const c=getCart();
  const count=c.reduce((a,x)=>a+x.qty,0);
  $$('.cart-count').forEach(x=>x.textContent=count);
  const total=c.reduce((a,x)=>{const p=PRODUCTS.find(p=>p.id===x.id);return a+(p?p.price*x.qty:0)},0);
  if($('#cartTotal')) $('#cartTotal').textContent=money(total);
  renderCartDrawer();
}
function addToCart(id){
  const c=getCart(); const row=c.find(x=>x.id===id); if(row) row.qty++; else c.push({id,qty:1}); setCart(c); toast('Added to your cart');
}
function changeQty(id, delta){
  const c=getCart(); const row=c.find(x=>x.id===id); if(!row) return; row.qty+=delta; const next=c.filter(x=>x.qty>0); setCart(next);
}
function removeFromCart(id){ setCart(getCart().filter(x=>x.id!==id)); toast('Removed from cart'); }
function totalCart(){ return getCart().reduce((sum,x)=>{const p=PRODUCTS.find(p=>p.id===x.id);return sum+(p?p.price*x.qty:0)},0); }

function productCard(p){
  const liked=getWish().includes(p.id);
  return `<article class="product-card reveal-card">
    <div class="product-image-wrap">
      ${p.badge?`<span class="product-badge">${p.badge}</span>`:''}
      <button class="wish" data-wish="${p.id}" aria-label="Wishlist">${liked?'♥':'♡'}</button>
      <img src="${p.image}" alt="${p.name}" loading="lazy">
    </div>
    <div class="product-copy">
      <div class="product-cat">${p.category}</div>
      <h3>${p.name}</h3>
      <div class="rating">★ ${p.rating} <span>(${p.reviews})</span></div>
      <p>${p.desc}</p>
      <div class="product-bottom"><strong>${money(p.price)}</strong><button class="mini-view" data-view="${p.id}">View</button><button class="mini-add" data-add="${p.id}">Add to cart</button></div>
    </div>
  </article>`;
}

function renderProducts(list, target='#productGrid'){ const el=$(target); if(!el) return; el.innerHTML=list.length?list.map(productCard).join(''):`<div class="empty-state">No products match your search.</div>`; observeReveals(el); }

function openCart(){ $('#overlay')?.classList.add('show'); $('#cartDrawer')?.classList.add('show'); document.body.classList.add('lock'); }
function closePanels(){ $('#overlay')?.classList.remove('show'); $('#cartDrawer')?.classList.remove('show'); $('#productModal')?.classList.remove('show'); document.body.classList.remove('lock'); }
function renderCartDrawer(){
  const el=$('#cartItems'); if(!el) return;
  const cart=getCart();
  if(!cart.length){ el.innerHTML='<div class="empty-state small">Your cart is empty.<br><a href="product.html">Browse products</a></div>'; return; }
  el.innerHTML=cart.map(x=>{
    const p=PRODUCTS.find(p=>p.id===x.id); if(!p) return '';
    return `<div class="cart-item"><img src="${p.image}" alt="${p.name}"><div class="cart-item-main"><strong>${p.name}</strong><span>${money(p.price)}</span><div class="qty"><button data-qty="${p.id}" data-delta="-1">−</button><b>${x.qty}</b><button data-qty="${p.id}" data-delta="1">+</button><button class="remove" data-remove="${p.id}">Remove</button></div></div></div>`;
  }).join('');
}

function openProduct(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p || !$('#productModal')) return;
  $('#modalContent').innerHTML=`<div class="modal-grid"><div class="modal-media"><img src="${p.image}" alt="${p.name}"></div><div><div class="product-cat">${p.category}</div><h2>${p.name}</h2><div class="rating big">★ ${p.rating} <span>(${p.reviews} reviews)</span></div><div class="modal-price">${money(p.price)}</div><p>${p.desc}</p><ul class="tick-list"><li>Premium player-focused design</li><li>Comfortable for practice and match day</li><li>GameOn quality checked</li></ul><button class="btn btn-primary" data-add="${p.id}">Add to cart</button></div></div>`;
  $('#productModal').classList.add('show'); $('#overlay').classList.add('show'); document.body.classList.add('lock');
}

function initHome(){
  renderProducts(PRODUCTS.slice(0,4),'#homeProducts');
  const slider=$('#heroSlider');
  if(slider){ let i=0; const slides=$$('.hero-slide', slider); setInterval(()=>{ slides[i].classList.remove('active'); i=(i+1)%slides.length; slides[i].classList.add('active'); },5200); }
}
function initProducts(){
  const search=$('#search'), category=$('#category'), sort=$('#sort'), count=$('#resultCount');
  const url=new URLSearchParams(location.search); if(url.get('category') && category) category.value=url.get('category');
  function apply(){
    const q=(search?.value||'').trim().toLowerCase(); const cat=category?.value||'All'; let list=PRODUCTS.filter(p=>(cat==='All'||p.category===cat)&&(!q||`${p.name} ${p.category} ${p.desc}`.toLowerCase().includes(q)));
    if(sort?.value==='low') list.sort((a,b)=>a.price-b.price); else if(sort?.value==='high') list.sort((a,b)=>b.price-a.price); else if(sort?.value==='name') list.sort((a,b)=>a.name.localeCompare(b.name));
    if(count) count.textContent=`${list.length} products`; renderProducts(list);
  }
  [search,category,sort].forEach(el=>{el?.addEventListener('input',apply);el?.addEventListener('change',apply);}); $('#clearFilters')?.addEventListener('click',()=>{search.value='';category.value='All';sort.value='featured';apply();}); apply();
}
function initCheckout(){
  const items=$('#checkoutItems'); if(!items) return;
  function draw(){
    const c=getCart();
    items.innerHTML=c.length?c.map(x=>{const p=PRODUCTS.find(p=>p.id===x.id);return `<div class="checkout-item"><img src="${p.image}" alt="${p.name}"><div><strong>${p.name}</strong><span>${x.qty} × ${money(p.price)}</span></div><b>${money(p.price*x.qty)}</b></div>`}).join(''):'<div class="empty-state small">Your cart is empty. Add products first.</div>';
    $('#checkoutSubtotal').textContent=money(totalCart()); $('#checkoutTotal').textContent=money(totalCart());
  }
  draw();
  $('#checkoutForm')?.addEventListener('submit',e=>{ e.preventDefault(); if(!getCart().length){toast('Your cart is empty');return;} let ok=true; $$('[required]',e.currentTarget).forEach(i=>{i.classList.toggle('invalid',!i.value.trim()); if(!i.value.trim()) ok=false;}); if(!ok){toast('Please complete the required fields');return;} $('#orderResult').innerHTML=`<div class="success-box"><b>Order details accepted.</b><span>Order ID: GO-${Date.now().toString().slice(-7)}</span><small>This frontend demo does not process real payments yet.</small></div>`; localStorage.removeItem(cartKey); draw(); updateCartUI(); e.currentTarget.reset(); toast('Order ready'); });
}
function initContact(){ $('#contactForm')?.addEventListener('submit',e=>{e.preventDefault();let ok=true;$$('[required]',e.currentTarget).forEach(i=>{i.classList.toggle('invalid',!i.value.trim());if(!i.value.trim())ok=false;});if(!ok){toast('Please complete the form');return;}$('#contactResult').innerHTML='<div class="success-box"><b>Message prepared successfully.</b><span>Connect a backend later to actually send it.</span></div>';e.currentTarget.reset();toast('Message validated');}); }
function observeReveals(root=document){ const els=$$('.reveal-card',root); if(!('IntersectionObserver' in window)){els.forEach(e=>e.classList.add('visible'));return;} const ob=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('visible');ob.unobserve(en.target);}}),{threshold:.08}); els.forEach(e=>ob.observe(e)); }

function setupEvents(){
  document.addEventListener('click',e=>{
    const add=e.target.closest('[data-add]'); if(add){addToCart(add.dataset.add);return;}
    const qty=e.target.closest('[data-qty]'); if(qty){changeQty(qty.dataset.qty,Number(qty.dataset.delta));return;}
    const rem=e.target.closest('[data-remove]'); if(rem){removeFromCart(rem.dataset.remove);return;}
    const wish=e.target.closest('[data-wish]'); if(wish){const id=wish.dataset.wish;const w=getWish();setWish(w.includes(id)?w.filter(x=>x!==id):[...w,id]); wish.textContent=w.includes(id)?'♡':'♥'; toast(w.includes(id)?'Removed from wishlist':'Saved to wishlist');return;}
    const view=e.target.closest('[data-view]'); if(view){openProduct(view.dataset.view);return;}
  });
  $('#openCart')?.addEventListener('click',openCart); $('#closeCart')?.addEventListener('click',closePanels); $('#overlay')?.addEventListener('click',closePanels); $('#closeModal')?.addEventListener('click',closePanels);
  $('#menuBtn')?.addEventListener('click',()=>$('#mobileNav')?.classList.toggle('open'));
  $('#year') && ($('#year').textContent=new Date().getFullYear());
}

document.addEventListener('DOMContentLoaded',()=>{setupEvents();updateCartUI();initHome();initProducts();initCheckout();initContact();observeReveals();});
