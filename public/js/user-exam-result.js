injectUsername();
document.getElementById('back').appendChild(backBtn());
function qs(name){ var m=location.search.match(new RegExp('[?&]'+name+'=([^&]+)')); return m?decodeURIComponent(m[1]):''; }
var attemptId=qs('attempt');

var summary=document.getElementById('summary');
var review=document.getElementById('review');

getJSON('/api/attempts/'+attemptId+'/result').then(function(r){
  var h='<h3>Score: '+r.scorePct+'% ('+r.correctCount+'/'+r.total+')</h3>';
  h+='<div class="small">Time used: '+r.timeUsedSec+' sec • Pass mark: '+r.passMark+'% → '+(r.pass?'PASS ✅':'FAIL ❌')+'</div>';
  summary.innerHTML=h;

  if(r.allowReview){
    var wrap=document.createElement('div');
    r.items.forEach(function(it, i){
      var box=document.createElement('div'); box.className='item'; box.style.marginTop='8px';
      var head=document.createElement('div'); head.className='item-header';
      head.textContent=(i+1)+'. '+it.topic;
      var p=document.createElement('div'); p.style.marginTop='6px';
      var opts=['A','B','C','D'];
      for(var k=0;k<opts.length;k++){
        var key=opts[k];
        var line=document.createElement('div'); line.style.margin='2px 0';
        var lab=key+'. '+it.options[key];
        if(key===it.correct){ lab+='  ✓'; }
        if(key===it.answer && key!==it.correct){ lab+='  (your choice ✗)'; }
        if(key===it.answer && key===it.correct){ lab+='  (your choice ✓)'; }
        line.textContent=lab;
        p.appendChild(line);
      }
      box.appendChild(head); box.appendChild(p); wrap.appendChild(box);
    });
    review.innerHTML='<h3>Review</h3>';
    review.appendChild(wrap);
  } else {
    review.innerHTML='<div class="small">Review disabled by exam settings.</div>';
  }
}).catch(function(e){
  summary.innerHTML='Cannot load result: '+e.message;
});
