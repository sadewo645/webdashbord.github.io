/*!
    * Start Bootstrap - SB Admin v6.0.2 (https://startbootstrap.com/template/sb-admin)
    * Copyright 2013-2020 Start Bootstrap
    * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-sb-admin/blob/master/LICENSE)
    */
    (function($) {
    "use strict";

    // Add active state to sidbar nav links
    var path = window.location.href; // because the 'href' property of the DOM element is the absolute path
        $("#layoutSidenav_nav .sb-sidenav a.nav-link").each(function() {
            if (this.href === path) {
                $(this).addClass("active");
            }
        });

    // Toggle the side navigation
    $("#sidebarToggle").on("click", function(e) {
        e.preventDefault();
        $("body").toggleClass("sb-sidenav-toggled");
    });
})(jQuery);

// Ambil data afdeling dari JSON
async function loadAfdelings() {
  const res = await fetch('afdeling_list.json?ts=' + Date.now());
  const data = await res.json();
  const container = document.getElementById('cardContainer');
  container.innerHTML = '';

  data.forEach(a => {
    const card = document.createElement('div');
    card.classList.add('afdeling-card');
    card.innerHTML = `
      <h5>${a.Nama}</h5>
      <p>Kode: ${a.Kode}</p>
      <p>Blok: ${a['Jumlah Blok']} | Total: ${a['Luasan Total (ha)']} ha</p>
    `;
    container.appendChild(card);
  });
}

// Jalankan saat load
loadAfdelings();

