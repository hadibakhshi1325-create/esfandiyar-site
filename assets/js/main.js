
(function () {
  var menuButton = document.getElementById('menuBtn');
  var links = document.getElementById('links');

  if (menuButton && links) {
    menuButton.addEventListener('click', function () {
      var isOpen = links.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    links.addEventListener('click', function (event) {
      if (event.target.tagName === 'A') {
        links.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  var arabicDigits = '٠١٢٣٤٥٦٧٨٩';

  function normalizePhone(value) {
    return value
      .replace(/[۰-۹]/g, function (digit) {
        return persianDigits.indexOf(digit);
      })
      .replace(/[٠-٩]/g, function (digit) {
        return arabicDigits.indexOf(digit);
      })
      .replace(/[\s\-()]/g, '');
  }

  document.querySelectorAll('form[data-wa]').forEach(function (form) {
    var nameField = form.elements.namedItem('name');
    var phoneField = form.elements.namedItem('phone');
    var serviceField = form.elements.namedItem('service');
    var detailsField = form.elements.namedItem('details');

    var status = form.parentNode.querySelector('.status');

    var requestedService = new URLSearchParams(
      window.location.search
    ).get('service');

    if (requestedService && serviceField) {
      for (var i = 0; i < serviceField.options.length; i++) {
        if (serviceField.options[i].value === requestedService) {
          serviceField.selectedIndex = i;
          break;
        }
      }
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var name = nameField.value.trim();
      var phone = normalizePhone(phoneField.value);

      if (!name) {
        status.textContent = 'لطفاً نام خود را وارد کنید.';
        nameField.focus();
        return;
      }

      if (!/^0\d{10}$/.test(phone)) {
        status.textContent =
          'شماره تماس باید ۱۱ رقم و با صفر شروع شود (مثلاً ۰۹۱۲۱۲۳۴۵۶۷).';
        phoneField.focus();
        return;
      }

      var serviceName =
        serviceField.options[serviceField.selectedIndex].text;

      var details = detailsField.value.trim() || 'ندارد';

      var message =
        'سلام، از طریق وب‌سایت موسسه ثبتی و حقوقی اسفندیار درخواست مشاوره دارم.\n' +
        'نام: ' + name + '\n' +
        'شماره تماس: ' + phone + '\n' +
        'خدمت: ' + serviceName + '\n' +
        'توضیحات: ' + details;

      var whatsappUrl =
        form.getAttribute('data-wa') +
        '?text=' + encodeURIComponent(message);

      var whatsappWindow = window.open(whatsappUrl, '_blank');

      if (whatsappWindow) {
        whatsappWindow.opener = null;
        status.textContent =
          'واتساپ باز شد؛ لطفاً پیام درخواست را بررسی و ارسال کنید.';
      } else {
        status.textContent =
          'برای باز کردن واتساپ از لینک زیر استفاده کنید: ';

        var link = document.createElement('a');
        link.href = whatsappUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = 'باز کردن واتساپ';

        status.appendChild(link);
      }
    });
  });
})();
