document.getElementById('back').appendChild(backBtn());
var list=$('#list');
function load(){
  var q=$('#search').value.trim();
  var url='/api/admin/cases'+(q?('?search='+encodeURIComponent(q)):''); 
  getJSON(url).then(function(res){
    $('#ccCount').textContent='Cases: '+res.items.length;
    list.innerHTML='';
    res.items.forEach(function(it){
      var div=document.createElement('div'); div.className='item line';
      var a=document.createElement('a'); a.href='./case-view.html?id='+it.id; a.textContent=it.snippet||'(no text)';
      div.appendChild(a); list.appendChild(div);
    });
  });
}
$('#search').addEventListener('input', load);
load();
