const {$,$$}=UG,cars=UG.cars().filter(c=>c.status!=='Sold'),S={brand:new Set,fuel:new Set,trans:new Set,yr:0,max:0,q:''};
$('#ad').textContent=UG.site.addr;$('#ph').textContent=UG.site.phone;$('#em').textContent=UG.site.email;$('#hr').textContent=UG.site.hours;$('#s1').textContent=cars.length;
const uniq=k=>[...new Set(cars.map(c=>c[k]))].sort();
function opts(el,k,set){$(el).innerHTML=uniq(k).map(v=>`<label><input type="checkbox" value="${UG.esc(v)}"> ${UG.esc(v)} <small style="color:#667085">(${cars.filter(c=>c[k]===v).length})</small></label>`).join('')||'<small>No data</small>';
  $$('input',$(el)).forEach(i=>i.onchange=()=>{i.checked?set.add(i.value):set.delete(i.value);render()})}
opts('#fBrand','brand',S.brand);opts('#fFuel','fuel',S.fuel);opts('#fTrans','trans',S.trans);
const top=Math.max(500000,...cars.map(c=>c.price)),pr=$('#price');pr.max=Math.ceil(top/50000)*50000;pr.value=S.max=pr.max;
pr.oninput=()=>{S.max=+pr.value;render()};$$('[name=yr]').forEach(r=>r.onchange=()=>{S.yr=+r.value;render()});$('#sort').onchange=render;
$('#q').oninput=e=>{S.q=e.target.value.toLowerCase().trim();render()};
$('#q').value=S.q=(new URLSearchParams(location.search).get('q')||'').toLowerCase();
$('#reset').onclick=()=>{$$('.filters input[type=checkbox]').forEach(i=>i.checked=false);['brand','fuel','trans'].forEach(k=>S[k].clear());$('[name=yr]').checked=true;S.yr=0;pr.value=S.max=pr.max;$('#q').value=S.q='';render()};
function render(){
  let l=cars.filter(c=>(!S.brand.size||S.brand.has(c.brand))&&(!S.fuel.size||S.fuel.has(c.fuel))&&(!S.trans.size||S.trans.has(c.trans))&&c.year>=S.yr&&c.price<=S.max&&(`${c.brand} ${c.model} ${c.year} ${c.fuel} ${c.city}`.toLowerCase().includes(S.q)));
  const o=$('#sort').value,f={low:(a,b)=>a.price-b.price,high:(a,b)=>b.price-a.price,year:(a,b)=>b.year-a.year,km:(a,b)=>a.km-b.km,new:(a,b)=>b.id-a.id}[o];l.sort(f);
  $('#pv').textContent=UG.inr(S.max);$('#count').textContent=`${l.length} car${l.length==1?'':'s'} found`;
  $('#grid').innerHTML=l.length?l.map(c=>UG.card(c)).join(''):'<div class="empty"><h3>No cars match your filters</h3><p>Try removing a filter or resetting.</p></div>';
}
render();
