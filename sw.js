// ۱۵۳ — سرویس‌ورکر با آپدیت خودکار: همیشه اول از شبکه می‌خواند، فقط وقتی آفلاین است از کش.
const CACHE='c153-v15';
self.addEventListener('install',e=>{self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  const ks=await caches.keys();
  await Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
  await self.clients.claim();
})())});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(u.origin!==self.location.origin)return; // درخواست‌های سرور (Supabase) را دست نمی‌زنیم
  e.respondWith((async()=>{
    try{
      const res=await fetch(r,{cache:'no-cache'});
      if(res&&res.ok){const c=await caches.open(CACHE);c.put(r,res.clone())}
      return res;
    }catch(err){
      const m=await caches.match(r,{ignoreSearch:true});
      if(m)return m;
      if(r.mode==='navigate'){const k=await caches.match('./',{ignoreSearch:true})||await caches.match('app153-v15.html',{ignoreSearch:true});if(k)return k}
      throw err;
    }
  })());
});
