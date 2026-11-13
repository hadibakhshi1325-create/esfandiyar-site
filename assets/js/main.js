(function(){
  var b=document.getElementById('menuBtn'),l=document.getElementById('links');
  if(b&&l){b.addEventListener('click',function(){var o=l.classList.toggle('open');b.setAttribute('aria-expanded',o)});
    l.addEventListener('click',function(e){if(e.target.tagName==='A'){l.classList.remove('open');b.setAttribute('aria-expanded','false')}});}
  var fa='۰۱۲۳۴۵۶۷۸۹',ar='٠١٢٣٤٥٦٧٨٩';
  function norm(s){return s.replace(/[۰-۹]/g,function(c){return fa.indexOf(c)}).replace(/[٠-٩]/g,function(c){return ar.indexOf(c)}).replace(/[\s\-()]/g,'')}
  document.querySelectorAll('form[data-wa]').forEach(function(f){
    var q=new URLSearchParams(location.search).get('service');
    if(q&&f.service){for(var i=0;i<f.service.options.length;i++){if(f.service.options[i].value===q)f.service.selectedIndex=i}}
    var st=f.parentNode.querySelector('.status');
    f.addEventListener('submit',function(e){
      e.preventDefault();
      if(f.website_url&&f.website_url.value.trim())return;
      var name=f.name.value.trim(),phone=norm(f.phone.value);
      if(!name){st.textContent='لطفاً نام خود را وارد کنید.';f.name.focus();return}
      if(!/^0\d{10}$/.test(phone)){st.textContent='شماره تماس باید ۱۱ رقم و با صفر شروع شود (مثلاً ۰۹۱۲۱۲۳۴۵۶۷).';f.phone.focus();return}
      var svc=f.service.options[f.service.selectedIndex].text,d=f.details.value.trim()||'ندارد';
      var msg='سلام، از طریق وب‌سایت موسسه ثبتی و حقوقی اسفندیار درخواست مشاوره دارم.\nنام: '+name+'\nشماره تماس: '+phone+'\nخدمت: '+svc+'\nتوضیحات: '+d;
      var url=f.getAttribute('data-wa')+'?text='+encodeURIComponent(msg);
      var w=window.open(url,'_blank');
      if(w){w.opener=null;st.textContent='واتساپ باز شد؛ پیام را ارسال کنید.';}
      else{st.innerHTML='اگر واتساپ باز نشد، <a href="'+url+'" target="_blank" rel="noopener noreferrer">اینجا بزنید</a>.';}
    });
  });
})();