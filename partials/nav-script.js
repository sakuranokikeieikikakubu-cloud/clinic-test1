  (function(){
    var toggle = document.getElementById('navToggle');
    var gnav = document.getElementById('gnav');

    function resetSubmenus(){
      gnav.querySelectorAll('.sub-open').forEach(function(li){
        li.classList.remove('sub-open');
      });
    }

    function closeMenu(){
      gnav.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
      resetSubmenus();
    }

    toggle.addEventListener('click', function(){
      var isOpen = gnav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
      if (!isOpen) resetSubmenus();
    });

    gnav.querySelectorAll(':scope > ul > li').forEach(function(li){
      var link = li.querySelector(':scope > a');
      if (li.querySelector(':scope > .sub-menu')){
        var lastToggleAt = 0;
        link.addEventListener('click', function(e){
          if (window.matchMedia('(max-width: 1099px)').matches){
            e.preventDefault();
            // Guards against duplicate/ghost click events that some
            // touch-emulation environments (e.g. browser devtools device
            // toolbars) can fire for a single tap.
            var now = Date.now();
            if (now - lastToggleAt < 80) return;
            lastToggleAt = now;
            li.classList.toggle('sub-open');
          } else {
            closeMenu();
          }
        });
      } else {
        link.addEventListener('click', closeMenu);
      }
    });

    gnav.querySelectorAll('.sub-menu a').forEach(function(link){
      link.addEventListener('click', closeMenu);
    });
  })();