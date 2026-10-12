const UG={
  KEY:'ug_cars_inventory',AUTH:'ug_admin_session',
  BASE:document.currentScript.src.replace(/assets\/js\/app\.js.*/,''),
  site:{phone:'+91 99480 62666',email:'ugcarsofficial@gmail.com',addr:'Plot No-216, Z.P.Road, Sri Ramana Colony, Hastinapuram, Saroor Nagar, RR District, Telangana',hours:'All week | 10:00 AM – 8:00 PM'},
  seed:[
   {id:1,brand:'Hyundai',model:'Creta SX',year:2022,price:1250000,fuel:'Petrol',trans:'Automatic',km:28000,owners:'1st Owner',city:'Hyderabad',status:'Available',desc:'Well-maintained single-owner Creta with full service history.',features:['ABS','Airbags','Reverse Camera','Touchscreen display','Android Auto','Apple CarPlay','Push Button Start','Alloy Wheels'],images:['assets/images/cars/creta-1.jpg','assets/images/cars/creta-2.jpg','assets/images/cars/creta-3.jpg']},
   {id:2,brand:'Tata',model:'Nexon',year:2021,price:900000,fuel:'Diesel',trans:'Manual',km:54000,owners:'1st Owner',city:'Hyderabad',status:'Available',desc:'Reliable diesel Nexon, quality checked and ready to drive.',features:['ABS','Airbags','Touchscreen display','Alloy Wheels'],images:['assets/images/cars/nexon-1.jpg','assets/images/cars/nexon-2.jpg','assets/images/cars/nexon-3.jpg','assets/images/cars/nexon-4.jpg']}],
  cars(){let d=localStorage.getItem(this.KEY);if(!d){this.save(this.seed);return JSON.parse(JSON.stringify(this.seed))}return JSON.parse(d)},
  save(c){try{localStorage.setItem(this.KEY,JSON.stringify(c));return true}catch(e){this.toast('Storage full – use fewer or smaller photos');return false}},
  reset(){localStorage.removeItem(this.KEY)},
  inr:n=>'₹'+Number(n||0).toLocaleString('en-IN'),
  src:s=>/^(data:|http)/.test(s)?s:UG.BASE+s,
  esc:s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  $:(s,r=document)=>r.querySelector(s),$$:(s,r=document)=>[...r.querySelectorAll(s)],
  toast(m){let t=this.$('#toast');if(!t){t=document.createElement('div');t.id='toast';document.body.append(t)}t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2800)},
  card(c){const ph=c.images[0]?`<img src="${this.src(c.images[0])}" alt="${this.esc(c.brand+' '+c.model)}" loading="lazy">`:'';
    return `<article class="card"><div class="ph">${ph}<span class="badge ${c.status}">${c.status}</span></div><div class="in"><h3>${this.esc(c.brand+' '+c.model)}</h3><div class="price">${this.inr(c.price)}</div><div class="chips"><span>${c.year}</span><span>${this.esc(c.fuel)}</span><span>${this.esc(c.trans)}</span><span>${Number(c.km).toLocaleString('en-IN')} km</span><span>${this.esc(c.owners)}</span></div><a class="btn" href="${this.BASE}car-details.html?id=${c.id}">View Details</a></div></article>`},
  shell(){
    document.head.insertAdjacentHTML('beforeend',`<link rel="icon" href="${this.BASE}assets/images/favicon.png"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">`);
    const h=this.$('#header'),f=this.$('#footer'),B=this.BASE,s=this.site;
    if(h)h.outerHTML=`<header class="top"><div class="wrap bar"><a class="logo" href="${B}index.html"><img src="${B}assets/images/logo.png" alt="UG Cars – Used & Genuine Cars"></a><div class="search"><i class="fa-solid fa-magnifying-glass"></i><input id="q" type="search" placeholder="Search brand, model…"></div><nav><a href="${B}index.html#inventory">Buy Car</a><a href="${B}index.html#why">Why Us</a><a href="${B}index.html#contact">Contact</a><a class="call" href="tel:${s.phone.replace(/\s/g,'')}"><i class="fa-solid fa-phone"></i> ${s.phone}</a></nav></div></header>`;
    if(f)f.outerHTML=`<footer class="foot">© ${new Date().getFullYear()} UG Cars – Used &amp; Genuine Cars. All rights reserved. · <a href="${B}admin/index.html">Admin</a></footer>`;
  }
};
UG.shell();
