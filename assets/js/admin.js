const {$,$$,esc}=UG;let cars=UG.cars(),editId=null,imgs=[];
const f=$('#f'),commit=()=>UG.save(cars)&&draw();
$('#lo').onclick=e=>{e.preventDefault();sessionStorage.removeItem(UG.AUTH);location.href='index.html'};
$('#rs').onclick=e=>{e.preventDefault();if(confirm('Reset inventory to the original demo cars? Your added cars will be removed.')){UG.reset();cars=UG.cars();draw();UG.toast('Demo data restored')}};
function draw(){const q=$('#s').value.toLowerCase(),st=$('#sf').value;
 $('#a1').textContent=cars.length;$('#a2').textContent=cars.filter(c=>c.status==='Available').length;$('#a3').textContent=cars.filter(c=>c.status==='Sold').length;
 $('#a4').textContent=UG.inr(cars.filter(c=>c.status!=='Sold').reduce((s,c)=>s+c.price,0));
 const l=cars.filter(c=>(!st||c.status===st)&&`${c.brand} ${c.model} ${c.year}`.toLowerCase().includes(q)).sort((a,b)=>b.id-a.id);
 $('#tb').innerHTML=l.map(c=>`<tr><td><div class="tv">${c.images[0]?`<img src="${UG.src(c.images[0])}" alt="">`:'<img alt="">'}<div><b>${esc(c.brand+' '+c.model)}</b><small>${esc(c.trans)} • ${Number(c.km).toLocaleString('en-IN')} km</small></div></div></td><td><b>${UG.inr(c.price)}</b></td><td>${c.year}</td><td>${esc(c.fuel)}</td><td><span class="pill ${c.status}">${c.status}</span></td><td><div class="ta"><button class="btn line sm" data-e="${c.id}"><i class="fa-solid fa-pen"></i> Edit</button><button class="btn danger sm" data-d="${c.id}"><i class="fa-solid fa-trash"></i></button></div></td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;color:#667085;padding:40px">No cars found.</td></tr>';
 $$('[data-e]').forEach(b=>b.onclick=()=>open(+b.dataset.e));
 $$('[data-d]').forEach(b=>b.onclick=()=>{const c=cars.find(x=>x.id===+b.dataset.d);if(confirm(`Delete ${c.brand} ${c.model}? This cannot be undone.`)){cars=cars.filter(x=>x.id!==c.id);commit();UG.toast('Car deleted')}})}
function prev(){$('#pv').innerHTML=imgs.map((s,i)=>`<div><img src="${UG.src(s)}" alt=""><button type="button" data-r="${i}">×</button></div>`).join('');$$('[data-r]').forEach(b=>b.onclick=()=>{imgs.splice(+b.dataset.r,1);prev()})}
function open(id){editId=id||null;const c=cars.find(x=>x.id===id);f.reset();$('#mt').textContent=c?'Edit Car':'Add New Car';imgs=c?[...c.images]:[];
 if(c)Object.keys(c).forEach(k=>{if(f.elements[k]&&k!=='features')f.elements[k].value=c[k]});f.elements.features.value=c?c.features.join(', '):'';prev();$('#m').classList.add('open')}
const shrink=file=>new Promise(r=>{const fr=new FileReader;fr.onload=()=>{const i=new Image;i.onload=()=>{const k=Math.min(1,900/i.width),cv=document.createElement('canvas');cv.width=i.width*k;cv.height=i.height*k;cv.getContext('2d').drawImage(i,0,0,cv.width,cv.height);r(cv.toDataURL('image/jpeg',.75))};i.src=fr.result};fr.readAsDataURL(file)});
$('#dz').onclick=()=>$('#fi').click();$('#fi').onchange=async e=>{for(const x of e.target.files){if(imgs.length>=6){UG.toast('Maximum 6 photos');break}imgs.push(await shrink(x))}e.target.value='';prev()};
$('#add').onclick=()=>open();$('#x').onclick=()=>$('#m').classList.remove('open');
f.onsubmit=e=>{e.preventDefault();const v=Object.fromEntries(new FormData(f));
 const car={id:editId||Date.now(),brand:v.brand.trim(),model:v.model.trim(),year:+v.year,price:+v.price,fuel:v.fuel,trans:v.trans,km:+v.km,owners:v.owners,city:v.city.trim()||'Hyderabad',status:v.status,desc:v.desc.trim(),features:v.features.split(',').map(s=>s.trim()).filter(Boolean),images:imgs};
 const prevCars=cars;cars=editId?cars.map(c=>c.id===editId?car:c):[...cars,car];
 if(UG.save(cars)){$('#m').classList.remove('open');draw();UG.toast(editId?'Car updated':'Car added to inventory')}else cars=prevCars};
$('#s').oninput=draw;$('#sf').onchange=draw;draw();
