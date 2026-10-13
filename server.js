/* UG Cars – backend server (no dependencies). Run: node server.js  ->  http://localhost:3000 */
const http=require('http'),fs=require('fs'),path=require('path'),crypto=require('crypto');
const PORT=process.env.PORT||3000,ROOT=__dirname,DATA=path.join(ROOT,'data'),DB=path.join(DATA,'db.json'),UP=path.join(ROOT,'uploads');
const ADMIN_USER=process.env.ADMIN_USER||'admin',ADMIN_PASS=process.env.ADMIN_PASS||'ugcars@2026';
const SEED=()=>JSON.parse(fs.readFileSync(path.join(DATA,'seed.json'),'utf8'));
let db;const tokens=new Map(),fails=new Map();
fs.mkdirSync(DATA,{recursive:true});fs.mkdirSync(UP,{recursive:true});
const save=()=>{const t=DB+'.tmp';fs.writeFileSync(t,JSON.stringify(db,null,1));fs.renameSync(t,DB)};
try{db=JSON.parse(fs.readFileSync(DB,'utf8'))}catch(e){db={cars:SEED(),enquiries:[]};save()}
const S=(v,n=200)=>String(v??'').trim().slice(0,n),N=v=>Math.max(0,Number(v)||0);
function saveImgs(a){return (Array.isArray(a)?a:[]).slice(0,8).map(s=>{s=String(s);const m=/^data:image\/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+\/=]+)$/.exec(s);
  if(!m)return /^(assets|uploads)\/[\w\-.\/]+$/.test(s)&&!s.includes('..')?s:null;
  const f='uploads/'+crypto.randomBytes(8).toString('hex')+'.'+(m[1]==='jpeg'?'jpg':m[1]);fs.writeFileSync(path.join(ROOT,f),Buffer.from(m[2],'base64'));return f}).filter(Boolean)}
const dropFiles=(old,keep=[])=>(old||[]).forEach(f=>{if(f.startsWith('uploads/')&&!keep.includes(f))fs.unlink(path.join(ROOT,f),()=>{})});
function cleanCar(b,id){if(!S(b.brand)||!S(b.model))throw new Error('Brand and model are required');
  return{id,brand:S(b.brand,60),model:S(b.model,80),year:N(b.year),price:N(b.price),fuel:S(b.fuel,20),trans:S(b.trans,20),km:N(b.km),owners:S(b.owners,20),city:S(b.city,60)||'Hyderabad',
  status:['Available','Reserved','Sold'].includes(b.status)?b.status:'Available',desc:S(b.desc,2000),features:(Array.isArray(b.features)?b.features:[]).map(x=>S(x,60)).filter(Boolean).slice(0,30),images:saveImgs(b.images)}}
const json=(res,c,o)=>{res.writeHead(c,{'Content-Type':'application/json','Cache-Control':'no-store'});res.end(JSON.stringify(o))};
const body=req=>new Promise((ok,no)=>{let d=[],n=0;req.on('data',c=>{n+=c.length;if(n>30e6){no(new Error('Payload too large'));req.destroy()}else d.push(c)});req.on('end',()=>{try{ok(d.length?JSON.parse(Buffer.concat(d)):{})}catch(e){no(new Error('Invalid JSON'))}});req.on('error',no)});
const authed=req=>{const e=tokens.get(req.headers['x-token']);return e&&e>Date.now()};
const eq=(a,b)=>{const h=x=>crypto.createHash('sha256').update(String(x)).digest();return crypto.timingSafeEqual(h(a),h(b))};
async function api(req,res,p){const M=req.method;let m;
  if(p==='/api/login'&&M==='POST'){const ip=req.socket.remoteAddress,f=fails.get(ip)||{n:0,t:0};if(f.n>=5&&Date.now()-f.t<60000)return json(res,429,{error:'Too many attempts. Wait a minute.'});
    const b=await body(req);if(eq(b.user,ADMIN_USER)&&eq(b.pass,ADMIN_PASS)){fails.delete(ip);const t=crypto.randomBytes(24).toString('hex');tokens.set(t,Date.now()+12*36e5);return json(res,200,{token:t})}
    fails.set(ip,{n:f.n+1,t:Date.now()});return json(res,401,{error:'Incorrect username or password.'})}
  if(p==='/api/cars'&&M==='GET')return json(res,200,db.cars);
  if((m=/^\/api\/cars\/(\d+)$/.exec(p))&&M==='GET'){const c=db.cars.find(x=>x.id==m[1]);return c?json(res,200,c):json(res,404,{error:'Not found'})}
  if(p==='/api/enquiries'&&M==='POST'){const b=await body(req);if(!S(b.name)||!S(b.phone))return json(res,400,{error:'Name and phone are required'});
    const data={};Object.entries(b.data||{}).slice(0,40).forEach(([k,v])=>data[S(k,60)]=S(v,1000));
    db.enquiries.push({id:Date.now(),type:S(b.type,40),name:S(b.name,80),phone:S(b.phone,30),summary:S(b.summary,200),data,images:saveImgs((b.images||[]).slice(0,4)),status:'New',date:new Date().toISOString()});save();return json(res,201,{ok:true})}
  if(!authed(req))return json(res,401,{error:'Please log in'});
  if(p==='/api/cars'&&M==='POST'){const c=cleanCar(await body(req),Math.max(Date.now(),...db.cars.map(x=>x.id+1)));db.cars.push(c);save();return json(res,201,c)}
  if((m=/^\/api\/cars\/(\d+)$/.exec(p))&&(M==='PUT'||M==='DELETE')){const i=db.cars.findIndex(x=>x.id==m[1]);if(i<0)return json(res,404,{error:'Not found'});const old=db.cars[i];
    if(M==='DELETE'){db.cars.splice(i,1);dropFiles(old.images);save();return json(res,200,{ok:true})}
    const c=cleanCar(await body(req),old.id);db.cars[i]=c;dropFiles(old.images,c.images);save();return json(res,200,c)}
  if(p==='/api/enquiries'&&M==='GET')return json(res,200,db.enquiries);
  if((m=/^\/api\/enquiries\/(\d+)$/.exec(p))&&(M==='PUT'||M==='DELETE')){const i=db.enquiries.findIndex(x=>x.id==m[1]);if(i<0)return json(res,404,{error:'Not found'});
    if(M==='DELETE'){dropFiles(db.enquiries[i].images);db.enquiries.splice(i,1)}else{const b=await body(req);if(['New','Contacted','Closed'].includes(b.status))db.enquiries[i].status=b.status}save();return json(res,200,{ok:true})}
  if(p==='/api/reset'&&M==='POST'){db.cars.forEach(c=>dropFiles(c.images));db.cars=SEED();save();return json(res,200,{ok:true})}
  json(res,404,{error:'Not found'})}
const MIME={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif','.svg':'image/svg+xml','.ico':'image/x-icon'};
function serve(res,p){if(p==='/')p='/index.html';if(p==='/admin'||p==='/admin/')p='/admin/index.html';
  const f=path.normalize(path.join(ROOT,p)),rel=path.relative(ROOT,f);
  if(rel.startsWith('..')||!(/^(assets|admin|uploads)[\\\/]/.test(rel)||/^[\w-]+\.html$/.test(rel)))return json(res,404,{error:'Not found'});
  fs.readFile(f,(e,d)=>{if(e)return json(res,404,{error:'Not found'});const x=path.extname(f).toLowerCase();
    res.writeHead(200,{'Content-Type':MIME[x]||'application/octet-stream','Cache-Control':x==='.html'||x==='.js'?'no-cache':'public, max-age=3600'});res.end(d)})}
http.createServer(async(req,res)=>{try{const p=decodeURIComponent(new URL(req.url,'http://x').pathname);p.startsWith('/api/')?await api(req,res,p):serve(res,p)}
  catch(e){json(res,e.message==='Payload too large'?413:400,{error:e.message||'Server error'})}})
.on('error',e=>{console.error(e.code==='EADDRINUSE'?`Port ${PORT} is already in use. Close the other server window, or run with PORT=3001.`:e.message);process.exit(1)})
.listen(PORT,()=>console.log(`\n  UG Cars is running\n  Website : http://localhost:${PORT}\n  Admin   : http://localhost:${PORT}/admin\n  Login   : ${ADMIN_USER} / ${ADMIN_PASS}\n\n  Keep this window open while presenting. Press Ctrl+C to stop.\n`));
