import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root=fileURLToPath(new URL('../dist/',import.meta.url));
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.xml':'application/xml','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
 try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{Allow:'GET, HEAD'});res.end();return;}
  const url=new URL(req.url,'http://localhost');
  const file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
  if(file!==root.slice(0,-1)&&!file.startsWith(root)){res.writeHead(403);res.end();return;}
  let target=file;
  try{if((await stat(file)).isDirectory()){
   if(!url.pathname.endsWith('/')){res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}
   target=path.join(file,'index.html');
  }}catch{}
  let data,status=200;
  try{data=await readFile(target);}catch{data=await readFile(path.join(root,'404.html'));status=404;target='404.html';}
  res.writeHead(status,{'Content-Type':types[path.extname(target)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Referrer-Policy':'strict-origin-when-cross-origin','Cache-Control':'no-cache'});
  res.end(req.method==='HEAD'?undefined:data);
 }catch{res.writeHead(400);res.end('Bad request');}
}).listen(port,'127.0.0.1',()=>console.log(`AUTO Tailor preview: http://127.0.0.1:${port}`));
