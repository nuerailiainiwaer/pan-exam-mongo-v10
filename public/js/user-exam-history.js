injectUsername();
document.getElementById('back').appendChild(backBtn());
var list=document.getElementById('list');

function fmtDate(s){
  var d=new Date(s); 
  var y=d.getFullYear(), m=('0'+(d.getMonth()+1)).slice(-2), dd=('0'+d.getDate()).slice(-2);
  var hh=('0'+d.getHours()).slice(-2), mm=('0'+d.getMinutes()).slice(-2);
  return y+'-'+m+'-'+dd+' '+hh+':'+mm;
}
function fmtDur(sec){
  sec=Math.max(0, Math.floor(sec));
  var m=Math.floor(sec/60), r=sec%60;
  return m+'m '+r+'s';
}

function load(){
  getJSON('/api/my-attempts').then(function(res){
    list.innerHTML='';
    if(!res.items || res.items.length===0){
      var p=document.createElement('div'); p.className='small'; p.textContent='No attempts yet.'; list.appendChild(p); return;
    }
    res.items.forEach(function(it){
      var b=document.createElement('a');
      b.className='btn hist-btn';
      b.href='./exam-review-grid.html?attempt='+encodeURIComponent(it.id);
      var txt = '['+it.status.toUpperCase()+'] '+it.examTitle+'  •  '+fmtDate(it.startedAt)+
                '  •  Score: '+it.scorePct+'% ('+it.correctCount+'/'+it.total+')  •  '+fmtDur(it.timeUsedSec);
      b.textContent = txt;
      list.appendChild(b);
    });
  }).catch(function(e){ list.innerHTML='Error: '+e.message; });
}
load();
