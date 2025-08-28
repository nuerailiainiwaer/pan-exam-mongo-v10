document.getElementById('back').appendChild(backBtn());
function qs(name){ var m=location.search.match(new RegExp('[?&]'+name+'=([^&]+)')); return m?decodeURIComponent(m[1]):''; }
var attemptId=qs('attempt');

var meta=document.getElementById('meta');
var grid=document.getElementById('grid');
var detail=document.getElementById('detail');

function fmtDur(sec){ sec=Math.max(0, Math.floor(sec)); var m=Math.floor(sec/60), r=sec%60; return m+'m '+r+'s'; }

getJSON('/api/admin/attempts/'+attemptId+'/result').then(function(r){
  meta.textContent = 'User: '+r.username+'  •  Score: '+r.scorePct+'% ('+r.correctCount+'/'+r.total+')  •  Time used: '+fmtDur(r.timeUsedSec)+'  •  Pass: '+(r.pass?'YES':'NO');
  grid.innerHTML='';
  for(var i=0;i<r.items.length;i++){
    (function(ii){
      var it=r.items[ii];
      var b=document.createElement('button'); b.className='qnum'; b.textContent=(ii+1);
      var wrong = (it.answer && it.answer!==it.correct);
      if(wrong){ b.classList.add('wrong'); }
      b.onclick=function(){ showDetail(ii, it); };
      grid.appendChild(b);
    })(i);
  }
  if(r.items.length>0){ showDetail(0, r.items[0]); }
}).catch(function(e){
  meta.textContent='Cannot load: '+e.message;
});

function showDetail(i, it){
  detail.innerHTML='';
  var head=document.createElement('div'); head.className='item-header'; head.textContent=(i+1)+'. '+it.topic;
  detail.appendChild(head);
  var wrap=document.createElement('div'); wrap.style.marginTop='8px';
  var opts=['A','B','C','D'];
  for(var k=0;k<opts.length;k++){
    var key=opts[k];
    var line=document.createElement('div'); line.style.margin='4px 0';
    var txt=key+'. '+it.options[key];
    if(key===it.correct){ txt+='  ✓'; }
    if(it.answer && key===it.answer && it.answer!==it.correct){ txt+='  (user choice ✗)'; }
    if(it.answer && key===it.answer && it.answer===it.correct){ txt+='  (user choice ✓)'; }
    line.textContent=txt;
    if(key===it.correct){ line.className='answer'; }
    wrap.appendChild(line);
  }
  detail.appendChild(wrap);
}
