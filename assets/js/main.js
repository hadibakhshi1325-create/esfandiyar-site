(function(){
  var b=document.getElementById('menuBtn'),l=document.getElementById('links');
  if(b&&l){
    b.addEventListener('click',function(){
      var o=l.classList.toggle('open');
      b.setAttribute('aria-expanded',String(o));
    });
    l.addEventListener('click',function(e){
      if(e.target.tagName==='A'){
        l.classList.remove('open');
        b.setAttribute('aria-expanded','false');
      }
    });
  }

  var fa='۰۱۲۳۴۵۶۷۸۹',ar='٠١٢٣٤٥٦٧٨٩';
  function norm(value){
    return String(value||'')
      .replace(/[۰-۹]/g,function(c){return String(fa.indexOf(c));})
      .replace(/[٠-٩]/g,function(c){return String(ar.indexOf(c));})
      .replace(/[\\s\\-()]/g,'');
  }

  document.querySelectorAll('form[data-wa]').forEach(function(form){
    var query=new URLSearchParams(window.location.search).get('service');
    var serviceControl=form.elements.namedItem('service');
    if(query&&serviceControl){
      for(var i=0;i<serviceControl.options.length;i++){
        if(serviceControl.options[i].value===query) serviceControl.selectedIndex=i;
      }
    }

    var status=form.parentElement.querySelector('.status');
    form.addEventListener('submit',function(event){
      event.preventDefault();
      try{
        var honeypot=form.elements.namedItem('website_url');
        if(honeypot&&honeypot.value.trim()) return;

        var nameControl=form.elements.namedItem('name');
        var phoneControl=form.elements.namedItem('phone');
        var detailsControl=form.elements.namedItem('details');
        var name=nameControl?nameControl.value.trim():'';
        var phone=phoneControl?norm(phoneControl.value):'';

        if(!name){
          status.textContent='لطفاً نام خود را وارد کنید.';
          if(nameControl) nameControl.focus();
          return;
        }
        if(!/^0\\d{10}$/.test(phone)){
          status.textContent='شماره تماس باید ۱۱ رقم و با صفر شروع شود (مثلاً ۰۹۱۲۱۲۳۴۵۶۷).';
          if(phoneControl) phoneControl.focus();
          return;
        }
        if(!serviceControl){
          status.textContent='انتخاب خدمت در فرم پیدا نشد. لطفاً صفحه را تازه‌سازی کنید.';
          return;
        }

        var service=serviceControl.options[serviceControl.selectedIndex].text;
        var details=detailsControl&&detailsControl.value.trim()?detailsControl.value.trim():'ندارد';
        var message='سلام، از طریق وب‌سایت موسسه ثبتی و حقوقی اسفندیار درخواست مشاوره دارم.\\nنام: '+name+'\\nشماره تماس: '+phone+'\\nخدمت: '+service+'\\nتوضیحات: '+details;
        var base=form.getAttribute('data-wa');
        if(!base){
          status.textContent='نشانی واتساپ تنظیم نشده است. لطفاً با شماره موسسه تماس بگیرید.';
          return;
        }
        var destination=base+'?text='+encodeURIComponent(message);
        status.textContent='در حال انتقال به واتساپ…';
        window.location.href=destination;
      }catch(error){
        status.textContent='ارسال خودکار انجام نشد. صفحه را تازه‌سازی کنید یا مستقیماً با شماره ۰۹۳۷۲۰۸۴۷۲۴ در واتساپ پیام دهید.';
      }
    });
  });
})();