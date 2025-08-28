document.getElementById('back').appendChild(backBtn());
var list=document.getElementById('list');
function qs(name){ var m=location.search.match(new RegExp('[?&]'+name+'=([^&]+)')); return m?decodeURIComponent(m[1]):''; }
var userId=qs('user');

function fmtDate(s){
  var d=new Date(s); 
  var y=d.getFullYear(), m=('0'+(d.getMonth()+1)).slice(-2), dd=('0'+d.getDate()).slice(-2);
  var hh=('0'+d.getHours()).slice(-2), mm=('0'+d.getMinutes()).slice(-2);
  return y+'-'+m+'-'+dd+' '+hh+':'+mm;
}
function fmtDur(sec){ sec=Math.max(0,Math.floor(sec)); var m=Math.floor(sec/60), r=sec%60; return m+'m '+r+'s'; }

function load(){
  getJSON('/api/admin/user-attempts?userId='+encodeURIComponent(userId)).then(function(res){
    list.innerHTML='';
    if(!res.username){ var p=document.createElement('div'); p.textContent='User not found'; list.appendChild(p); return; }
    var hdr=document.createElement('h3'); hdr.textContent='User: '+res.username; list.appendChild(hdr);
    if(!res.items || res.items.length===0){ var p2=document.createElement('div'); p2.className='small'; p2.textContent='No attempts.'; list.appendChild(p2); return; }
    res.items.forEach(function(it){
      var a=document.createElement('a'); a.className='btn'; a.style.display='block';
      a.href='./exam-review-grid.html?attempt='+encodeURIComponent(it.id)+'&admin=1';
      a.textContent='['+it.status.toUpperCase()+'] '+it.examTitle+' • '+fmtDate(it.startedAt)+' • Score: '+it.scorePct+'% ('+it.correctCount+'/'+it.total+') • '+fmtDur(it.timeUsedSec);
      list.appendChild(a);
    });
  }).catch(function(e){ list.innerHTML='Error: '+e.message; });
}
load();
