document.getElementById('back').appendChild(backBtn());
var list=document.getElementById('list');
function load(){
  var q=document.getElementById('search').value.trim();
  var url='/api/admin/exam-users'+(q?('?search='+encodeURIComponent(q)):''); 
  getJSON(url).then(function(res){
    list.innerHTML='';
    if(!res.items || res.items.length===0){ var p=document.createElement('div'); p.className='small'; p.textContent='No users found.'; list.appendChild(p); return; }
    res.items.forEach(function(u){
      var div=document.createElement('div'); div.className='item line';
      var a=document.createElement('a'); a.href='./exam-user-history.html?user='+encodeURIComponent(u.id); a.textContent=u.username+'  ('+u.attemptCount+' attempts)';
      div.appendChild(a); list.appendChild(div);
    });
  }).catch(function(e){ list.innerHTML='Error: '+e.message; });
}
document.getElementById('search').addEventListener('input', load);
load();
