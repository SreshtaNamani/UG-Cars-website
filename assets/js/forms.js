/* Sell / Exchange / Finance forms -> sent to the server, shown in admin Enquiries */
(async()=>{const {$,$$}=UG,f=$('#ef');
try{const cs=(await UG.cars()).filter(c=>c.status!=='Sold');$$('[data-cars]').forEach(s=>cs.forEach(c=>s.insertAdjacentHTML('beforeend',`<option>${UG.esc(c.brand+' '+c.model+' ('+c.year+')')}</option>`)))}catch(e){}
f.onsubmit=async e=>{e.preventDefault();const btn=$('button',f),lbl=btn.textContent;btn.disabled=true;btn.textContent='Submitting…';
 try{const data={};new FormData(f).forEach((v,k)=>{if(!(v instanceof File)&&v!=='')data[k]=v});
  const files=$('#photos')?[...$('#photos').files].slice(0,4):[],imgs=[];for(const x of files)imgs.push(await UG.shrink(x));
  const sum=f.dataset.sum.split(',').map(k=>data[k]).filter(Boolean).join(' ');
  await UG.addEnq(f.dataset.type,data.Name,data.Phone,sum,data,imgs);
  f.style.display='none';$('#done').style.display='block';scrollTo({top:$('#form').offsetTop-90,behavior:'smooth'})}
 catch(err){UG.toast(err.message||'Could not submit. Please try again.');btn.disabled=false;btn.textContent=lbl}};
if($('#e1')){const calc=()=>{const P=+$('#e1').value,r=+$('#e2').value/1200,n=+$('#e3').value,m=P*r*Math.pow(1+r,n)/(Math.pow(1+r,n)-1),t=m*n;
 $('#la').textContent=UG.inr(P);$('#ra').textContent=$('#e2').value+'% p.a.';$('#te').textContent=n+' months';$('#eo').textContent=UG.inr(Math.round(m));$('#ti').textContent=UG.inr(Math.round(t-P));$('#tp').textContent=UG.inr(Math.round(t))};
 ['#e1','#e2','#e3'].forEach(s=>$(s).oninput=calc);calc()}})();
