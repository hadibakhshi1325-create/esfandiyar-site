(function(){
  var WA_NUMBER='989372084724', TG_URL='https://t.me/hadi_s_b98', TEL='09372084724';

  // ---- mobile menu ----
  var b=document.getElementById('menuBtn'), l=document.getElementById('links');
  if(b&&l){
    b.addEventListener('click',function(){
      var o=l.classList.toggle('open');
      b.setAttribute('aria-expanded',String(o));
    });
    l.addEventListener('click',function(e){
      if(e.target.tagName==='A'){ l.classList.remove('open'); b.setAttribute('aria-expanded','false'); }
    });
  }

  // ---- helpers ----
  var fa='۰۱۲۳۴۵۶۷۸۹', ar='٠١٢٣٤٥٦٧٨٩';
  function norm(v){
    return String(v||'')
      .replace(/[۰-۹]/g,function(c){return String(fa.indexOf(c));})
      .replace(/[٠-٩]/g,function(c){return String(ar.indexOf(c));})
      .replace(/[\s\-()]/g,'');
  }
  function el(tag,cls,text){
    var n=document.createElement(tag);
    if(cls) n.className=cls;
    if(text!=null) n.textContent=text;
    return n;
  }
  function link(href,cls,text,newTab){
    var a=el('a',cls,text); a.href=href;
    if(newTab){ a.target='_blank'; a.rel='noopener'; }
    return a;
  }
  function copyText(text,done){
    function fallback(){
      var t=document.createElement('textarea');
      t.value=text; t.setAttribute('readonly',''); t.style.position='fixed'; t.style.opacity='0';
      document.body.appendChild(t); t.select();
      try{ if(document.execCommand('copy')) done(); }catch(e){}
      document.body.removeChild(t);
    }
    if(navigator.clipboard&&window.isSecureContext){ navigator.clipboard.writeText(text).then(done,fallback); }
    else fallback();
  }

  // ---- consultation forms ----
  document.querySelectorAll('form[data-wa]').forEach(function(form){
    var query=new URLSearchParams(window.location.search).get('service');
    var serviceControl=form.elements.namedItem('service');
    if(query&&serviceControl){
      for(var i=0;i<serviceControl.options.length;i++){
        if(serviceControl.options[i].value===query) serviceControl.selectedIndex=i;
      }
    }
    var status=form.parentElement.querySelector('.status');
    if(!status){
      status=el('p','status'); status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
      form.parentNode.insertBefore(status,form.nextSibling);
    }
    var result=el('div','wa-result'); result.hidden=true;
    status.parentNode.insertBefore(result,status.nextSibling);

    function say(msg,type){
      status.textContent=msg;
      status.className='status'+(type?' '+type:'');
      try{ status.scrollIntoView({block:'center',behavior:'smooth'}); }catch(e){}
    }

    form.addEventListener('submit',function(event){
      event.preventDefault();
      result.hidden=true; result.textContent='';
      var nameC=form.elements.namedItem('name'), phoneC=form.elements.namedItem('phone'), detC=form.elements.namedItem('details');
      var name=nameC?nameC.value.trim():'';
      var phone=phoneC?norm(phoneC.value):'';
      if(!name){ say('لطفاً نام خود را وارد کنید.','err'); if(nameC) nameC.focus(); return; }
      if(!/^0\d{10}$/.test(phone)){ say('شماره تماس باید ۱۱ رقم و با صفر شروع شود (مثلاً ۰۹۱۲۱۲۳۴۵۶۷).','err'); if(phoneC) phoneC.focus(); return; }
      var service=serviceControl?serviceControl.options[serviceControl.selectedIndex].text:'';
      var details=detC&&detC.value.trim()?detC.value.trim():'ندارد';
      var message='سلام، از طریق وب‌سایت موسسه ثبتی و حقوقی اسفندیار درخواست مشاوره دارم.\nنام: '+name+'\nشماره تماس: '+phone+'\nخدمت: '+service+'\nتوضیحات: '+details;
      var base=form.getAttribute('data-wa')||('https://wa.me/'+WA_NUMBER);
      var waWeb=base+'?text='+encodeURIComponent(message);
      var waApp='whatsapp://send?phone='+WA_NUMBER+'&text='+encodeURIComponent(message);

      say('درخواست شما آماده شد. اگر واتساپ خودکار باز نشد، یکی از دکمه‌های زیر را بزنید.','ok');
      result.appendChild(el('p','wa-note','متن درخواست آماده است. ارسال نهایی را خودتان در واتساپ انجام می‌دهید.'));
      var row=el('div','wa-actions');
      var main=link(waWeb,'btn wa','ارسال در واتساپ',true); row.appendChild(main);
      row.appendChild(link(waApp,'btn outline','باز کردن مستقیم برنامه واتساپ',false));
      var cp=el('button','btn','کپی متن درخواست'); cp.type='button';
      cp.addEventListener('click',function(){ copyText(message,function(){ cp.textContent='کپی شد ✓'; }); });
      row.appendChild(cp);
      row.appendChild(link(TG_URL,'btn outline','پیام در تلگرام',true));
      row.appendChild(link('tel:'+TEL,'btn outline','تماس تلفنی',false));
      result.appendChild(row);
      result.hidden=false;
      try{ main.click(); }catch(e){}
    });
  });
})();
