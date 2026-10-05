import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {build,out} from './build.mjs';
await build();
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');
    const requested=decodeURIComponent(url.pathname);
    const dest=path.resolve(out,'.'+requested);
    if(dest!==out&&!dest.startsWith(out+path.sep)){res.writeHead(403);res.end('Forbidden');return;}
    let file=dest;
    try{if((await fs.stat(file)).isDirectory()){
      if(!url.pathname.endsWith('/')){res.writeHead(308,{Location:url.pathname+'/'+url.search});res.end();return;}
      file=path.join(file,'index.html');
    }}catch{}
    try{const body=await fs.readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});res.end(body);}
    catch{res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});res.end(await fs.readFile(path.join(out,'404.html')));}
  }catch{res.writeHead(400);res.end('Bad request');}
});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Local: http://127.0.0.1:'+server.address().port));
