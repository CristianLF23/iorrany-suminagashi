const http=require('http'),fs=require('fs'),path=require('path');
const root=__dirname,port=Number(process.env.PORT)||4183;
http.createServer((req,res)=>{
 let p;try{p=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]==='/'?'/index.html':req.url.split('?')[0]));}catch{res.writeHead(400).end();return;}
 if(!p.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 fs.stat(p,(err,stat)=>{
  if(err||!stat.isFile()){res.writeHead(404).end();return;}
  const type=({'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.webp':'image/webp','.jpg':'image/jpeg','.mp4':'video/mp4','.ttf':'font/ttf','.woff2':'font/woff2'})[path.extname(p)]||'application/octet-stream';
  const range=req.headers.range?.match(/^bytes=(\d+)-(\d*)$/);let start=0,end=stat.size-1;
  if(range){start=Number(range[1]);end=range[2]?Math.min(Number(range[2]),end):end;if(start>end){res.writeHead(416,{'Content-Range':`bytes */${stat.size}`}).end();return;}}
  res.writeHead(range?206:200,{'Content-Type':type,'Accept-Ranges':'bytes','Content-Length':end-start+1,...(range?{'Content-Range':`bytes ${start}-${end}/${stat.size}`}:{})});
  if(req.method==='HEAD'){res.end();return;}fs.createReadStream(p,{start,end}).pipe(res);
 });
}).listen(port,'127.0.0.1',()=>console.log(`http://127.0.0.1:${port}`));
