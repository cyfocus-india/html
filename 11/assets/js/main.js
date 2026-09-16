'use strict';
(() => {
  const root = document.documentElement;
  const base = document.body.dataset.base || '';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const storage = {get(key, fallback) {try {return JSON.parse(localStorage.getItem(key)) ?? fallback;} catch {return fallback;}},set(key, value) {try {localStorage.setItem(key, JSON.stringify(value));} catch {}}};
  const icons = () => window.lucide && lucide.createIcons();
  const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let shortlist = storage.get('aquora-shortlist', []);
  if (!Array.isArray(shortlist)) shortlist = [];
  shortlist = shortlist.filter(p => p && typeof p.id === 'string' && typeof p.name === 'string' && /^[a-z0-9-]+$/.test(p.image || '')).slice(0, 30);
  let toastTimer;
  const notify = (message, actionText, actionCallback) => {
    const toast = $('#toast');
    if(!toast) return;
    if(actionText && actionCallback) {
      toast.innerHTML = `<span>${escape(message)}</span><button class="toast-btn" id="toast-action">${escape(actionText)} <i data-lucide="arrow-right" style="width:14px;height:14px" aria-hidden="true"></i></button>`;
      $('#toast-action', toast)?.addEventListener('click', e => {
        e.stopPropagation();
        toast.classList.remove('visible');
        actionCallback();
      });
    } else {
      toast.textContent = message;
    }
    toast.classList.add('visible');
    icons();
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 4200);
  };
  const updateTheme = () => $$('.theme-toggle').forEach(button => {const target=root.dataset.theme==='dark'?'light':'dark';button.setAttribute('aria-label',`Switch to ${target} mode`);button.title=`Switch to ${target} mode`;button.innerHTML=`<i data-lucide="${target==='light'?'sun':'moon'}" aria-hidden="true"></i>`;icons();});
  $$('.theme-toggle').forEach(button => button.addEventListener('click',()=>{root.dataset.theme=root.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('aquora-theme',root.dataset.theme)}catch{}updateTheme();}));
  matchMedia('(prefers-color-scheme: light)').addEventListener('change',e=>{let saved;try{saved=localStorage.getItem('aquora-theme')}catch{}if(!saved){root.dataset.theme=e.matches?'light':'dark';updateTheme();}});
  const updateDirection=()=>$$('.rtl-toggle').forEach(b=>{b.textContent=root.dir==='rtl'?'LTR':'RTL';b.setAttribute('aria-label',root.dir==='rtl'?'Use left-to-right layout':'Use right-to-left layout');b.setAttribute('aria-pressed',String(root.dir==='rtl'));});
  $$('.rtl-toggle').forEach(button=>button.addEventListener('click',()=>{root.dir=root.dir==='rtl'?'ltr':'rtl';try{localStorage.setItem('aquora-direction',root.dir)}catch{}updateDirection();}));
  const menu = $('.site-nav');
  const menuToggle = $('.menu-toggle');
  const closeMenu=()=>{menu?.classList.remove('open');menuToggle?.setAttribute('aria-expanded','false');};
  menuToggle?.addEventListener('click',()=>{const open=menu.classList.toggle('open');menuToggle.setAttribute('aria-expanded',String(open));});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeMenu();$$('.nav-dropdown[open]').forEach(d=>d.open=false);}});
  document.addEventListener('click',event=>{if(!event.target.closest('.site-header'))closeMenu();if(!event.target.closest('.nav-dropdown'))$$('.nav-dropdown[open]').forEach(d=>d.open=false);});
  $$('.site-nav a').forEach(a=>a.addEventListener('click',closeMenu));
  $$('.nav-dropdown').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)$$('.nav-dropdown[open]').forEach(other=>{if(other!==d)other.open=false;});}));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  if(!reduced.matches && 'IntersectionObserver' in window){document.body.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.08,rootMargin:'0px 0px 40px 0px'});$$('.reveal').forEach(el=>observer.observe(el));}
  let scrollPending=false;
  const scrollUpdate=()=>{const y=window.scrollY;$('.site-header')?.classList.toggle('scrolled',y>20);$('.back-top')?.classList.toggle('visible',y>700);const progress=$('.scroll-progress');if(progress){const height=document.documentElement.scrollHeight-innerHeight;progress.style.width=`${height>0?y/height*100:0}%`;}scrollPending=false;};
  addEventListener('scroll',()=>{if(!scrollPending){requestAnimationFrame(scrollUpdate);scrollPending=true;}},{passive:true});scrollUpdate();
  $('.back-top')?.addEventListener('click',()=>scrollTo({top:0,behavior:reduced.matches?'instant':'smooth'}));
  const count=()=>$$('[data-shortlist-count]').forEach(el=>{el.textContent=shortlist.length;el.hidden=!shortlist.length;});
  const getProduct=card=>({id:card.dataset.id,name:card.dataset.name,price:card.dataset.price,image:card.dataset.image,type:card.dataset.type,latin:card.dataset.latin,care:card.dataset.care});
  const openDialog=dialog=>{if(!dialog)return;if(typeof dialog.showModal==='function')dialog.showModal();else dialog.setAttribute('open','');};
  const addProduct = product => {
    if(shortlist.some(p => p.id === product.id)) {
      notify(`${product.name} is already in your cart.`, 'Checkout', () => openCheckout());
      return;
    }
    shortlist.push(product);
    storage.set('aquora-shortlist', shortlist);
    count();
    notify(`${product.name} added to cart.`, 'Checkout', () => openCheckout());
  };
  const productDialog=$('#product-dialog');
  $$('.product-card').forEach(card=>{
    card.querySelector('[data-add]')?.addEventListener('click',()=>addProduct(getProduct(card)));
    card.querySelector('[data-details]')?.addEventListener('click',()=>{
      const p=getProduct(card);
      const formattedPrice=Number(String(p.price).replace(/[^0-9]/g,'')).toLocaleString('en-IN')||p.price;
      $('#product-detail-content').innerHTML=`<div class="modal-product"><img src="${base}assets/images/${escape(p.image)}.webp" alt="${escape(p.name)}"><div><span class="pill">${escape(p.type)}</span><h2 id="product-dialog-title">${escape(p.name)}</h2><p><em>${escape(p.latin)}</em></p><p style="margin-top:20px">${escape(p.care)}</p><div class="price">₹${formattedPrice} <small>indicative price</small></div><div class="button-row" style="margin-top:22px;gap:12px"><button class="btn btn-primary" id="modal-add">Add to cart <i data-lucide="plus" aria-hidden="true"></i></button><button class="btn btn-outline" id="modal-buy-now">Buy now <i data-lucide="credit-card" aria-hidden="true"></i></button></div></div></div>`;
      $('#modal-add').addEventListener('click',()=>addProduct(p));
      $('#modal-buy-now').addEventListener('click',()=>{addProduct(p);productDialog?.close();openCheckout();});
      icons();
      openDialog(productDialog);
    });
  });
  const shortlistDialog=$('#shortlist-dialog');
  const getOrCreateCheckoutDialog=()=>{
    let dialog=$('#checkout-dialog');
    if(!dialog){
      dialog=document.createElement('dialog');
      dialog.className='modal';
      dialog.id='checkout-dialog';
      dialog.setAttribute('aria-labelledby','checkout-title');
      dialog.innerHTML=`<div class="modal-content checkout-modal-content"><button class="icon-btn modal-close" data-close-dialog aria-label="Close checkout"><i data-lucide="x" aria-hidden="true"></i></button><div id="checkout-step-form"><div class="eyebrow">AQUORA CHECKOUT</div><h2 id="checkout-title" style="font-size:28px">Complete your order.</h2><p style="margin-top:10px">Review your items and enter delivery details to place your order.</p><div class="checkout-grid" style="margin-top:24px"><form id="checkout-order-form" class="checkout-form"><h3 style="font-size:17px;margin-bottom:14px">1. Contact &amp; Shipping</h3><div class="form-grid" style="gap:14px"><div class="form-group"><label for="chk-name">Full Name *</label><input id="chk-name" name="name" type="text" placeholder="e.g. Aditi Sharma" required></div><div class="form-group"><label for="chk-email">Email Address *</label><input id="chk-email" name="email" type="email" placeholder="you@example.com" required></div><div class="form-group"><label for="chk-phone">Phone Number *</label><input id="chk-phone" name="phone" type="tel" placeholder="+91 98765 43210" required></div><div class="form-group"><label for="chk-pincode">PIN / Postal Code *</label><input id="chk-pincode" name="pincode" type="text" placeholder="560001" required></div><div class="form-group full"><label for="chk-address">Delivery Address *</label><input id="chk-address" name="address" type="text" placeholder="Flat / House no., Building, Street area" required></div></div><h3 style="font-size:17px;margin:22px 0 14px">2. Delivery Method</h3><div class="delivery-options"><label class="radio-card active"><input type="radio" name="delivery" value="standard" checked><div class="radio-content"><strong>Standard Safe Transit</strong><span>Free · 2–4 business days</span></div><span class="radio-badge">FREE</span></label><label class="radio-card"><input type="radio" name="delivery" value="pickup"><div class="radio-content"><strong>Showroom Pickup</strong><span>Free · Ready in 2 hours at Aquora Studio</span></div><span class="radio-badge">FREE</span></label><label class="radio-card"><input type="radio" name="delivery" value="express"><div class="radio-content"><strong>Climate-Controlled Express</strong><span>₹150 · Next business day delivery</span></div><span class="radio-badge">₹150</span></label></div><h3 style="font-size:17px;margin:22px 0 14px">3. Payment Option</h3><div class="payment-options"><label class="radio-card active"><input type="radio" name="payment" value="cod" checked><div class="radio-content"><strong>Pay on Delivery / Pickup</strong><span>Cash, UPI, or Card on arrival</span></div></label><label class="radio-card"><input type="radio" name="payment" value="upi"><div class="radio-content"><strong>UPI Instant Payment</strong><span>Google Pay, PhonePe, Paytm, BHIM</span></div></label><label class="radio-card"><input type="radio" name="payment" value="card"><div class="radio-content"><strong>Credit / Debit Card</strong><span>Visa, Mastercard, RuPay</span></div></label></div><div style="margin-top:24px"><button type="submit" class="btn btn-primary" id="submit-order-btn" style="width:100%;min-height:50px;font-size:15px">Place Order · <span id="checkout-submit-total">₹0</span> <i data-lucide="arrow-up-right" aria-hidden="true"></i></button><p class="note" style="text-align:center;margin-top:12px">🔒 Safe &amp; secure order placement. No payment required in preview mode.</p></div></form><aside class="checkout-summary-col"><div class="checkout-summary-card"><h3 style="font-size:17px;margin-bottom:16px">Order Summary</h3><div id="checkout-items-list" class="checkout-items-list"></div><div class="checkout-totals"><div class="row"><span>Subtotal</span><strong id="chk-subtotal">₹0</strong></div><div class="row"><span>Shipping</span><strong id="chk-shipping">FREE</strong></div><div class="row"><span>Taxes</span><span style="color:var(--muted)">Included</span></div><div class="row total"><span>Total Amount</span><strong id="chk-total" class="accent">₹0</strong></div></div><div class="checkout-guarantee"><i data-lucide="shield-check" aria-hidden="true"></i><span>Aquora Live Arrival &amp; Quality Guarantee included.</span></div></div></aside></div></div><div id="checkout-step-success" hidden style="text-align:center;padding:24px 10px"><div style="width:64px;height:64px;border-radius:50%;background:rgba(122,217,177,0.15);border:2px solid var(--mint);display:grid;place-items:center;margin:0 auto 18px;color:var(--mint)"><i data-lucide="check" style="width:34px;height:34px;stroke-width:2.5" aria-hidden="true"></i></div><div class="eyebrow" style="justify-content:center">ORDER CONFIRMED</div><h2 style="font-size:30px;margin-bottom:8px">Thank you for your order!</h2><p id="order-confirm-msg" style="max-width:480px;margin:0 auto 20px">Your order has been placed successfully and is being prepared.</p><div id="order-details-box" style="text-align:start;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:20px;max-width:540px;margin:0 auto 24px"></div><div class="button-row" style="justify-content:center;gap:12px"><a id="download-order-receipt" class="btn btn-outline" href="#" download="aquora-receipt.txt"><i data-lucide="download" aria-hidden="true"></i> Download Receipt</a><button class="btn btn-primary" id="checkout-finish-btn">Continue Shopping <i data-lucide="arrow-up-right" aria-hidden="true"></i></button></div></div></div>`;
      document.body.appendChild(dialog);
      dialog.querySelector('[data-close-dialog]')?.addEventListener('click',()=>dialog.close());
      dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
    }
    return dialog;
  };
  const openCheckout=()=>{
    if(!shortlist.length){notify('Your cart is currently empty.');return;}
    shortlistDialog?.close();
    const checkoutDialog=getOrCreateCheckoutDialog();
    const stepForm=$('#checkout-step-form',checkoutDialog);
    const stepSuccess=$('#checkout-step-success',checkoutDialog);
    if(stepForm)stepForm.hidden=false;
    if(stepSuccess)stepSuccess.hidden=true;
    const itemsList=$('#checkout-items-list',checkoutDialog);
    if(itemsList){
      itemsList.innerHTML=shortlist.map(p=>{
        const priceNum=parseInt(String(p.price).replace(/[^0-9]/g,''),10)||0;
        return `<div class="checkout-item-mini"><img src="${base}assets/images/${escape(p.image)}.webp" alt="${escape(p.name)}"><div><h4>${escape(p.name)}</h4><p>${escape(p.type||'Item')}</p></div><span class="item-price">₹${priceNum.toLocaleString('en-IN')}</span></div>`;
      }).join('');
    }
    const subtotal=shortlist.reduce((sum,p)=>{const n=parseInt(String(p.price).replace(/[^0-9]/g,''),10);return sum+(isNaN(n)?0:n);},0);
    const updateTotals=()=>{
      const form=$('#checkout-order-form',checkoutDialog);
      const delivery=form?.elements['delivery']?.value||'standard';
      const shippingCost=delivery==='express'?150:0;
      const grandTotal=subtotal+shippingCost;
      const subEl=$('#chk-subtotal',checkoutDialog);
      const shipEl=$('#chk-shipping',checkoutDialog);
      const totEl=$('#chk-total',checkoutDialog);
      const subTotEl=$('#checkout-submit-total',checkoutDialog);
      if(subEl)subEl.textContent=`₹${subtotal.toLocaleString('en-IN')}`;
      if(shipEl)shipEl.textContent=shippingCost>0?`₹${shippingCost}`:'FREE';
      if(totEl)totEl.textContent=`₹${grandTotal.toLocaleString('en-IN')}`;
      if(subTotEl)subTotEl.textContent=`₹${grandTotal.toLocaleString('en-IN')}`;
    };
    const form=$('#checkout-order-form',checkoutDialog);
    if(form){
      $$('input[type="radio"]',form).forEach(radio=>{
        radio.addEventListener('change',()=>{
          const groupName=radio.name;
          $$(`input[name="${groupName}"]`,form).forEach(r=>r.closest('.radio-card')?.classList.toggle('active',r.checked));
          updateTotals();
        });
      });
      form.onsubmit=event=>{
        event.preventDefault();
        const fd=new FormData(form);
        const name=(fd.get('name')||'').trim();
        const email=(fd.get('email')||'').trim();
        const phone=(fd.get('phone')||'').trim();
        const pincode=(fd.get('pincode')||'').trim();
        const address=(fd.get('address')||'').trim();
        const delivery=fd.get('delivery')||'standard';
        const payment=fd.get('payment')||'cod';
        if(!name||!email||!phone||!address||!pincode)return;
        const deliveryLabels={standard:'Standard Safe Transit (2–4 business days)',pickup:'Showroom Pickup (Aquora Studio, Bangalore)',express:'Climate-Controlled Express (Next business day)'};
        const paymentLabels={cod:'Pay on Delivery / Pickup (Cash / Card / UPI)',upi:'UPI Instant Payment (GPay, PhonePe, Paytm)',card:'Credit / Debit Card'};
        const shippingCost=delivery==='express'?150:0;
        const grandTotal=subtotal+shippingCost;
        const orderId='AQ-2026-'+Math.floor(1000+Math.random()*9000);
        const now=new Date();
        const dateStr=now.toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
        const receiptText=`=================================================\n             AQUORA AQUARIUM STUDIO             \n=================================================\nOrder Reference: #${orderId}\nOrder Date: ${dateStr}\n\nCUSTOMER DETAILS:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nShipping Address:\n${address}\nPIN Code: ${pincode}\n\nDELIVERY & PAYMENT:\nMethod: ${deliveryLabels[delivery]||delivery}\nPayment: ${paymentLabels[payment]||payment}\n\n-------------------------------------------------\nITEMS ORDERED:\n${shortlist.map(p=>`- ${p.name} (${p.type||'Item'}): ₹${(parseInt(String(p.price).replace(/[^0-9]/g,''),10)||0).toLocaleString('en-IN')}`).join('\n')}\n-------------------------------------------------\nSubtotal: ₹${subtotal.toLocaleString('en-IN')}\nShipping: ${shippingCost>0?'₹'+shippingCost:'FREE'}\nEstimated Taxes: Included\nTOTAL AMOUNT: ₹${grandTotal.toLocaleString('en-IN')}\n=================================================\nThank you for choosing Aquora!\nFor enquiries: store@aquora-example.com\n=================================================`;
        const detailsBox=$('#order-details-box',checkoutDialog);
        if(detailsBox){
          detailsBox.innerHTML=`<div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:10px"><span style="color:var(--muted)">Order Reference:</span><strong class="accent">#${orderId}</strong></div><div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:10px"><span style="color:var(--muted)">Customer:</span><strong>${escape(name)} (${escape(phone)})</strong></div><div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:10px"><span style="color:var(--muted)">Delivery to:</span><span style="text-align:end;max-width:280px">${escape(address)}, PIN: ${escape(pincode)}</span></div><div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:10px"><span style="color:var(--muted)">Delivery Method:</span><span>${escape(deliveryLabels[delivery]||delivery)}</span></div><div style="display:flex;justify-content:space-between;border-bottom:1px solid var(--line);padding-bottom:10px;margin-bottom:10px"><span style="color:var(--muted)">Payment Option:</span><span>${escape(paymentLabels[payment]||payment)}</span></div><div style="display:flex;justify-content:space-between;padding-top:4px"><span style="font-weight:700">Total Paid / Due:</span><strong class="accent" style="font-size:20px">₹${grandTotal.toLocaleString('en-IN')}</strong></div>`;
        }
        const dlBtn=$('#download-order-receipt',checkoutDialog);
        if(dlBtn){
          if(dlBtn.dataset.objectUrl)URL.revokeObjectURL(dlBtn.dataset.objectUrl);
          const blobUrl=URL.createObjectURL(new Blob([receiptText],{type:'text/plain;charset=utf-8'}));
          dlBtn.href=blobUrl;
          dlBtn.download=`aquora-order-${orderId}.txt`;
          dlBtn.dataset.objectUrl=blobUrl;
        }
        const finishBtn=$('#checkout-finish-btn',checkoutDialog);
        if(finishBtn){finishBtn.onclick=()=>{checkoutDialog.close();};}
        if(stepForm)stepForm.hidden=true;
        if(stepSuccess)stepSuccess.hidden=false;
        shortlist=[];
        storage.set('aquora-shortlist',shortlist);
        count();
        renderShortlist();
        notify(`Order #${orderId} placed successfully!`);
        icons();
      };
    }
    updateTotals();
    icons();
    openDialog(checkoutDialog);
  };
  const renderShortlist=()=>{
    const container=$('#shortlist-items');
    if(!container)return;
    if(!shortlist.length){
      container.innerHTML='<div class="empty-state"><i data-lucide="shopping-bag" aria-hidden="true"></i><h3>Your cart is empty.</h3><p>Add fish, aquatic plants, or equipment to your cart.</p><a class="btn btn-primary" href="'+base+'pages/fish-catalog.html">Explore the catalog</a></div>';
      if($('#shortlist-actions'))$('#shortlist-actions').hidden=true;
    }else{
      const subtotal=shortlist.reduce((sum,p)=>{const n=parseInt(String(p.price).replace(/[^0-9]/g,''),10);return sum+(isNaN(n)?0:n);},0);
      container.innerHTML=shortlist.map(p=>{
        const priceNum=parseInt(String(p.price).replace(/[^0-9]/g,''),10)||0;
        return `<div class="shortlist-item"><img src="${base}assets/images/${escape(p.image)}.webp" alt=""><div><h3>${escape(p.name)}</h3><p>₹${priceNum.toLocaleString('en-IN')} · ${escape(p.type||'Item')}</p></div><button class="icon-btn" data-remove="${escape(p.id)}" aria-label="Remove ${escape(p.name)}"><i data-lucide="trash-2" aria-hidden="true"></i></button></div>`;
      }).join('')+`<div class="shortlist-total-bar"><span>Total (${shortlist.length} ${shortlist.length===1?'item':'items'}):</span><strong>₹${subtotal.toLocaleString('en-IN')}</strong></div>`;
      const actions=$('#shortlist-actions');
      if(actions){
        actions.innerHTML=`<p class="note">Items in your cart are ready to order. Safe transit &amp; pickup available.</p><div class="button-row" style="margin-top:16px;gap:12px"><button class="btn btn-primary" id="start-checkout-btn" style="flex:1">Proceed to Checkout <i data-lucide="credit-card" aria-hidden="true"></i></button><button class="btn btn-outline" id="clear-shortlist-btn">Clear Cart</button></div>`;
        actions.hidden=false;
        $('#start-checkout-btn',actions)?.addEventListener('click',()=>{shortlistDialog?.close();openCheckout();});
        $('#clear-shortlist-btn',actions)?.addEventListener('click',()=>{shortlist=[];storage.set('aquora-shortlist',shortlist);count();renderShortlist();notify('Your cart has been cleared.');});
      }
      $$('[data-remove]',container).forEach(b=>b.addEventListener('click',()=>{shortlist=shortlist.filter(p=>p.id!==b.dataset.remove);storage.set('aquora-shortlist',shortlist);count();renderShortlist();}));
    }
    icons();
  };
  $$('[data-open-shortlist]').forEach(b=>b.addEventListener('click',()=>{renderShortlist();openDialog(shortlistDialog);}));
  $$('[data-open-dialog]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();const d=document.getElementById(b.dataset.openDialog);if(d&&b.dataset.openDialog==='forgot-dialog'){const email=$('#member-email')?.value?.trim();const resetInput=$('#reset-email',d);if(email&&resetInput&&!resetInput.value)resetInput.value=email;}openDialog(d);}));
  $$('[data-close-dialog]').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));
  $$('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
  const catalog=$('#catalog-products');
  if(catalog){let activeType='all';const params=new URLSearchParams(location.search);const requested=params.get('type');const filters=$$('[data-filter]');if(filters.some(f=>f.dataset.filter===requested))activeType=requested;
    const apply=()=>{const query=($('#catalog-search')?.value||'').trim().toLowerCase();const difficulty=$('#difficulty-filter')?.value||'all';let visible=0;$$('.product-card',catalog).forEach(card=>{const matches=(activeType==='all'||card.dataset.tags.split(' ').includes(activeType))&&(!query||(card.dataset.name+' '+card.dataset.latin).toLowerCase().includes(query))&&(difficulty==='all'||card.dataset.level===difficulty);card.hidden=!matches;if(matches)visible++;});filters.forEach(f=>f.setAttribute('aria-pressed',String(f.dataset.filter===activeType)));$('#result-count').textContent=`${visible} ${visible===1?'species':'species'} to discover`;$('#catalog-empty').hidden=visible>0;};
    filters.forEach(f=>f.addEventListener('click',()=>{activeType=f.dataset.filter;apply();}));$('#catalog-search')?.addEventListener('input',apply);$('#difficulty-filter')?.addEventListener('change',apply);$('#clear-filters')?.addEventListener('click',()=>{activeType='all';$('#catalog-search').value='';$('#difficulty-filter').value='all';apply();});apply();
  }
  $$('[data-equipment-filter]').forEach(b=>b.addEventListener('click',()=>{const category=b.dataset.equipmentFilter;$$('[data-equipment-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));$$('[data-equipment-type]').forEach(card=>card.hidden=category!=='all'&&card.dataset.equipmentType!==category);$('#equipment-result').textContent=category==='all'?'Showing all four equipment categories':`Showing ${b.textContent.trim().toLowerCase()}`;}));
  const planner=$('#tank-planner');
  if(planner){const calculate=()=>{const size=$('#tank-size').value;const style=$('#tank-style').value;const result=$('#planner-result');const sizeText={compact:'A carefully considered compact aquarium',medium:'Room for a considered aquarium',large:'A landscape with space to grow'};const styleText={planted:'Start with a freshwater layout, easy epiphyte plants, a suitable filter, and a light with a timer. Select fish only after checking the aquarium’s dimensions and the species’ adult needs.',freshwater:'Plan the filter, heater, cover, and test kit around your chosen freshwater species. Make a stocking plan after the aquarium is cycled, with compatible fish and room for adult growth.',marine:'Marine aquariums need dedicated saltwater equipment, accurate salinity measurement, and a species-specific plan. Discuss the full setup and ongoing maintenance before choosing livestock.'};result.innerHTML=`<span class="eyebrow">YOUR STARTING POINT</span><h3>${sizeText[size]}</h3><p>${styleText[style]}</p><a class="text-link" href="${base}pages/contact.html?subject=Setup%20advice">Discuss this setup <i data-lucide="arrow-up-right" aria-hidden="true"></i></a>`;icons();};planner.addEventListener('change',calculate);calculate();}
  const formError=(field,message)=>{field.setAttribute('aria-invalid',String(!!message));const error=document.getElementById(field.id+'-error');if(error)error.textContent=message;};
  $$('form[data-validate]').forEach(form=>{
    const fields=$$('input,select,textarea',form).filter(f=>f.type!=='hidden');
    const validate=field=>{let message='';if(field.required&&((field.type==='checkbox'&&!field.checked)||!field.value.trim()))message=field.type==='checkbox'?'Please accept this before continuing.':'Please complete this field.';else if(field.type==='email'&&field.value&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value))message='Enter a valid email address, such as you@example.com.';else if(field.minLength>0&&field.value&&field.value.length<field.minLength)message=`Please use at least ${field.minLength} characters.`;else if(field.name==='confirm-password'&&field.value!==$('#password',form)?.value)message='The passwords do not match.';formError(field,message);return !message;};
    fields.forEach(field=>{field.addEventListener('blur',()=>validate(field));field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validate(field);});});
    form.addEventListener('submit',event=>{event.preventDefault();const results=fields.map(validate);if(results.includes(false)){const first=fields.find(f=>f.getAttribute('aria-invalid')==='true');first?.focus();return;}const status=$('.form-status',form);const kind=form.dataset.validate;
      if(kind==='contact'){const data=new FormData(form);const text=`AQUORA — SPECIAL ORDER ENQUIRY\n\nName: ${data.get('name')}\nEmail: ${data.get('email')}\nPhone: ${data.get('phone')||'Not provided'}\nSubject: ${data.get('subject')}\nAquarium: ${data.get('aquarium')||'Not specified'}\n\n${data.get('message')}\n\nShortlist:\n${shortlist.length?shortlist.map(p=>'- '+p.name).join('\n'):'No items selected'}\n\nPrepared locally. This enquiry has not been sent.\n`;status.textContent='Your enquiry is ready. Download a copy below. This local preview has not sent it to a store.';const download=$('#download-enquiry');if(download.dataset.objectUrl)URL.revokeObjectURL(download.dataset.objectUrl);const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));download.href=url;download.download='aquora-enquiry.txt';download.dataset.objectUrl=url;download.hidden=false;}
      else if(kind==='signin'||kind==='signup'){status.textContent='The form is valid. Account services are not connected in this local preview. No account was created, and no credentials have been saved or sent.';$$('input[type=password]',form).forEach(f=>f.value='');}
      else if(kind==='notify'){status.textContent='Your email is valid. Launch notifications are not connected in this local preview; your address has not been saved or subscribed.';}
      else if(kind==='forgot'){const email=$('#reset-email',form)?.value?.trim();status.textContent=`A password reset link preview has been prepared for ${email||'your email'}. Account services are not connected in this local preview; no reset email has been sent.`;if($('#reset-email',form))$('#reset-email',form).value='';}
      status?.setAttribute('tabindex','-1');status?.focus();
    });
  });
  $$('[data-toggle-password]').forEach(button=>button.addEventListener('click',()=>{const field=document.getElementById(button.dataset.togglePassword);field.type=field.type==='password'?'text':'password';button.textContent=field.type==='password'?'Show password':'Hide password';button.setAttribute('aria-pressed',String(field.type==='text'));}));
  if($('#enquiry-subject')){const subject=new URLSearchParams(location.search).get('subject');if(subject&&[...$('#enquiry-subject').options].some(o=>o.value===subject))$('#enquiry-subject').value=subject;}
  if($('#enquiry-shortlist'))$('#enquiry-shortlist').textContent=shortlist.length?`Your ${shortlist.length}-item shortlist will be included in the downloaded enquiry.`:'Add fish to your shortlist to include them in your enquiry.';
  const mapFrame=$('#showroom-map-frame');
  const mapButtons=$$('[data-map-view]');
  if(mapFrame&&mapButtons.length){
    const mapSources={
      street:'https://maps.google.com/maps?q=Adyar%2C%20Chennai%2C%20Tamil%20Nadu%20600020&t=m&z=15&ie=UTF8&iwloc=&output=embed',
      satellite:'https://maps.google.com/maps?q=Adyar%2C%20Chennai%2C%20Tamil%20Nadu%20600020&t=k&z=16&ie=UTF8&iwloc=&output=embed',
      osm:'https://www.openstreetmap.org/export/embed.html?bbox=80.2420%2C12.9960%2C80.2680%2C13.0180&layer=mapnik&marker=13.0064%2C80.2575'
    };
    mapButtons.forEach(btn=>{
      btn.addEventListener('click',()=>{
        const view=btn.dataset.mapView;
        if(mapSources[view]){
          mapFrame.src=mapSources[view];
          mapButtons.forEach(b=>{
            const active=b===btn;
            b.classList.toggle('active',active);
            b.setAttribute('aria-pressed',String(active));
          });
        }
      });
    });
  }
  if(document.modelContext?.registerTool && $$('.product-card').length){
    const lifecycle = new AbortController();
    const register = tool => {try{Promise.resolve(document.modelContext.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{});}catch{}};
    register({name:'list_fish',title:'List aquarium fish',description:'Read the sample fish collection displayed on this page. Prices are illustrative, not live inventory.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute:input=>{if(input && Object.keys(input).length)throw new Error('This tool accepts no parameters.');return {fish:$$('.product-card').map(card=>{const p=getProduct(card);return {id:p.id,name:p.name,environment:p.type,examplePriceINR:p.price};})};}});
    register({name:'add_fish_to_shortlist',title:'Add fish to local shortlist',description:'Add a displayed fish to the browser-local enquiry shortlist. Does not reserve livestock, submit an enquiry, or place an order.',inputSchema:{type:'object',properties:{fishId:{type:'string'}},required:['fishId'],additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute:input=>{if(!input||typeof input.fishId!=='string'||Object.keys(input).some(key=>key!=='fishId'))throw new Error('Provide a fishId from list_fish.');const card=$$('.product-card').find(card=>card.dataset.id===input.fishId);if(!card)throw new Error('Fish not found on this page.');addProduct(getProduct(card));if(shortlistDialog?.open)renderShortlist();return {status:'shortlisted_locally',fishId:input.fishId,count:shortlist.length};}});
    addEventListener('pagehide',()=>lifecycle.abort(),{once:true});
  }
  updateTheme();updateDirection();count();icons();
})();
