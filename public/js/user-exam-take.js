injectUsername();
document.getElementById('back').appendChild(backBtn());

function qs(name){ var m=location.search.match(new RegExp('[?&]'+name+'=([^&]+)')); return m?decodeURIComponent(m[1]):''; }

var attemptId = qs('attempt');
var questionBox = document.getElementById('questionBox');
var timerEl = document.getElementById('timer');
var progressEl = document.getElementById('progress');
var nav = document.getElementById('nav');
var flagBtn = document.getElementById('flag');
var clearBtn = document.getElementById('clear');
var prevBtn = document.getElementById('prev');
var nextBtn = document.getElementById('next');
var submitBtn = document.getElementById('submit');

var total = 0, idx = 0;
var answered = {}; // index -> true
var flagged = {};  // index -> true
var qids = [];     // index -> questionId
var remainingSec = 0;
var timerInt = null;

window.onbeforeunload = function(){ return 'Are you sure you want to leave the exam? It will be ended and cannot be resumed.'; };

function formatTime(s){ var m=Math.floor(s/60), r=s%60; return (m<10?'0':'')+m+':'+(r<10?'0':'')+r; }

function tick(){
  remainingSec--; if(remainingSec < 0){ remainingSec = 0; }
  timerEl.textContent = 'Time: ' + formatTime(remainingSec);
  if(remainingSec <= 0){
    clearInterval(timerInt); submit();
  }
}

function refreshSummary(cb){
  getJSON('/api/attempts/'+attemptId+'/summary').then(function(s){
    total = s.total;
    idx = s.currentIndex || 0;
    qids = s.questionIds;
    answered = s.answered||{};
    flagged = s.flagged||{};
    remainingSec = s.remainingSec;
    progressEl.textContent = (Object.keys(answered).length) + ' / ' + total;
    buildNav();
    if(timerInt) clearInterval(timerInt);
    timerInt = setInterval(tick, 1000);
    timerEl.textContent = 'Time: ' + formatTime(remainingSec);
    if(cb) cb();
  }).catch(function(e){ alert('Exam unavailable: '+e.message); location.href='/user/exams.html'; });
}

function buildNav(){
  nav.innerHTML='';
  for(var i=0;i<total;i++){
    var b=document.createElement('button'); b.className='qnum'; b.textContent=(i+1);
    if(answered[i]) b.classList.add('answered');
    if(flagged[i]) b.classList.add('flagged');
    (function(ii){ b.onclick=function(){ loadQ(ii); }; })(i);
    nav.appendChild(b);
  }
}

function loadQ(i){
  if(i<0||i>=total) return;
  idx = i;
  getJSON('/api/attempts/'+attemptId+'/q/'+i).then(function(q){
    questionBox.innerHTML='';
    var h=document.createElement('div'); h.className='item-header'; h.textContent=(i+1)+'. '+q.topic;
    questionBox.appendChild(h);
    if(q.imageUrl){ var img=document.createElement('img'); img.src=q.imageUrl; img.className='responsive'; questionBox.appendChild(img); }
    var opts=['A','B','C','D'];
    for(var k=0;k<opts.length;k++){
      var key=opts[k];
      var line=document.createElement('label'); line.style.display='block'; line.style.margin='6px 0';
      var input=document.createElement('input'); input.type='radio'; input.name='choice'; input.value=key; input.style.marginRight='8px';
      if(q.choice===key) input.checked=true;
      (function(questionId){
        input.onchange=function(){
          postJSON('/api/attempts/'+attemptId+'/answer', { questionId:questionId, choice:this.value }).then(function(){
            answered[idx]=true;
            progressEl.textContent = (Object.keys(answered).length) + ' / ' + total;
            buildNav();
          });
        };
      })(q.id);
      line.appendChild(input);
      var span=document.createElement('span'); span.textContent=key+'. '+q.options[key];
      line.appendChild(span);
      questionBox.appendChild(line);
    }
    if(q.flagged){ flagBtn.classList.add('bad'); } else { flagBtn.classList.remove('bad'); }
    flagBtn.onclick=function(){
      var next=!q.flagged;
      postJSON('/api/attempts/'+attemptId+'/flag', { questionId:q.id, flagged:next }).then(function(){
        q.flagged=next; if(q.flagged){ flagBtn.classList.add('bad'); } else { flagBtn.classList.remove('bad'); }
        if(q.flagged){ flagged[idx]=true; } else { delete flagged[idx]; }
        buildNav();
      });
    };
    clearBtn.onclick=function(){
      postJSON('/api/attempts/'+attemptId+'/answer', { questionId:q.id, choice:null }).then(function(){
        delete answered[idx]; buildNav(); loadQ(idx);
        progressEl.textContent = (Object.keys(answered).length) + ' / ' + total;
      });
    };
  });
}

prevBtn.onclick=function(){ loadQ(idx-1); };
nextBtn.onclick=function(){ loadQ(idx+1); };
submitBtn.onclick=function(){ submit(); };

function submit(){
  if(!confirm('Submit exam?')) return;
  postJSON('/api/attempts/'+attemptId+'/submit', {}).then(function(r){
    window.onbeforeunload=null;
    location.href='/user/exam-result.html?attempt='+encodeURIComponent(attemptId);
  }).catch(function(e){ alert('Submit failed: '+e.message); });
}

refreshSummary(function(){ loadQ(idx); });


var exitBtn = document.getElementById('exit');
exitBtn.onclick = function(){
  if(!confirm('Exit the exam now? Your attempt will be ended and cannot be resumed.')) return;
  postJSON('/api/attempts/'+attemptId+'/abandon', {}).then(function(){
    window.onbeforeunload=null;
    location.href='/user/exams.html';
  }).catch(function(e){ alert('Exit failed: '+e.message); });
};
