injectUsername();
document.getElementById('back').appendChild(backBtn());
var list = document.getElementById('list');

function secsToMin(s){ var m=Math.floor(s/60), r=s%60; return m+'m '+r+'s'; }

function load(){
  getJSON('/api/exams').then(function(res){
    list.innerHTML='';
    res.exams.forEach(function(ex){
      var div=document.createElement('div'); div.className='item';
      var h=document.createElement('div'); h.className='item-header'; h.textContent=ex.title;
      var body=document.createElement('div'); body.style.marginTop='8px';
      body.innerHTML='Questions: '+ex.questionCount+' • Duration: '+ex.durationMinutes+' min • Pass: '+ex.passMark+'%';
      var btn=document.createElement('button'); btn.className='btn primary'; btn.textContent='Start Exam';
      btn.onclick=function(){
        postJSON('/api/exams/'+ex.id+'/start',{}).then(function(s){
          location.href='/user/exam-take.html?attempt='+encodeURIComponent(s.attemptId);
        }).catch(function(e){ alert('Cannot start: '+e.message); });
      };
      div.appendChild(h); div.appendChild(body); div.appendChild(btn); list.appendChild(div);
    });
  });
}
load();
