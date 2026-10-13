(async()=>{const {$,$$,esc}=UG;let list=[],tab='All';const TYPES=['All','Car Enquiry','Sell Request','Finance Enquiry','Exchange Request'];
$('#lo').onclick=e=>{e.preventDefault();sessionStorage.removeItem(UG.AUTH);location.href='index.html'};
function draw(){
 $('#tabs').innerHTML=TYPES.map(t=>`<button class="${t===tab?'on':''}" data-t="${t}">${t} (${t==='All'?list.length:list.filter(e=>e.type===t).length})</button>`).join('');
 $$('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;draw()});
 const l=list.filter(e=>tab==='All'||e.type===tab).sort((a,b)=>b.id-a.id);
 $('#tb').innerHTML=l.map(e=>`<tr><td>${new Date(e.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td><td><b>${esc(e.name)}</b><small style="display:block;color:#667085">${esc(e.phone)}</small></td><td>${esc(e.type)}</td><td>${esc(e.summary)}</td>
 <td><div class="field"><select data-s="${e.id}" style="height:38px;min-width:130px">${['New','Contacted','Closed'].map(s=>`<option ${s===e.status?'selected':''}>${s}</option>`).join('')}</select></div></td>
 <td><div class="ta"><button class="btn line sm" data-v="${e.id}">View</button><button class="btn danger sm" data-d="${e.id}"><i class="fa-solid fa-trash"></i></button></div></td></tr>`).join('')||'<tr><td colspan="6" style="text-align:center;color:#667085;padding:40px">No enquiries yet. Submit one from the website forms.</td></tr>';
 $$('[data-s]').forEach(s=>s.onchange=async()=>{try{await UG.api('enquiries/'+s.dataset.s,{method:'PUT',body:{status:s.value}});list.find(e=>e.id==s.dataset.s).status=s.value;UG.toast('Status updated')}catch(x){UG.toast(x.message)}});
 $$('[data-d]').forEach(b=>b.onclick=async()=>{if(confirm('Delete this enquiry?')){try{await UG.api('enquiries/'+b.dataset.d,{method:'DELETE'});list=list.filter(e=>e.id!=b.dataset.d);draw()}catch(x){UG.toast(x.message)}}});
 $$('[data-v]').forEach(b=>b.onclick=()=>{const e=list.find(x=>x.id==b.dataset.v);$('#mt').textContent=e.type;$('#ms').textContent=e.name+' • '+e.phone;
  $('#kv').innerHTML=Object.entries(e.data).map(([k,v])=>`<b>${esc(k)}</b><span>${esc(v)}</span>`).join('');$('#pv').innerHTML=(e.images||[]).map(s=>`<img src="${UG.src(s)}" alt="">`).join('');
  $('#call').href='tel:'+e.phone.replace(/\s/g,'');$('#m').classList.add('open')})}
$('#x').onclick=()=>$('#m').classList.remove('open');
try{list=await UG.api('enquiries')}catch(e){}draw()})();
