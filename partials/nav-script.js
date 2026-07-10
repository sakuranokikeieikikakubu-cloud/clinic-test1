  (function(){
    var toggle = document.getElementById('navToggle');
    var gnav = document.getElementById('gnav');

    function closeMenu(){
      gnav.classList.remove('is-open');
      toggle.classList.remove('is-active');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'メニューを開く');
    }

    toggle.addEventListener('click', function(){
      var isOpen = gnav.classList.toggle('is-open');
      toggle.classList.toggle('is-active', isOpen);
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      toggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
    });

    // --- TEMP DEBUG PANEL: remove this whole block once the real-device
    // toggle issue is diagnosed. Shows, per menu item: how many click
    // events actually arrived ("raw"), how many were let through the
    // debounce guard ("applied"), and the resulting open/closed state. ---
    var debugPanel = document.createElement('div');
    debugPanel.id = 'navDebugPanel';
    debugPanel.style.cssText = 'position:fixed;bottom:64px;left:8px;right:8px;z-index:9999;'
      + 'background:rgba(0,0,0,.88);color:#4dff4d;font:11px/1.5 monospace;'
      + 'padding:8px 10px;white-space:pre-wrap;max-height:42vh;overflow:auto;'
      + 'border-radius:6px;pointer-events:none;';
    document.body.appendChild(debugPanel);
    var debugState = {};
    function renderDebug(){
      var lines = ['[NAV DEBUG]'];
      Object.keys(debugState).forEach(function(label){
        var s = debugState[label];
        lines.push(label + ': raw=' + s.raw + ' applied=' + s.applied + ' state=' + (s.isOpen ? 'OPEN' : 'closed'));
      });
      debugPanel.textContent = lines.join('\n');
    }
    // --- END TEMP DEBUG PANEL SETUP ---

    gnav.querySelectorAll(':scope > ul > li').forEach(function(li){
      var link = li.querySelector(':scope > a');
      if (li.querySelector(':scope > .sub-menu')){
        var label = link.textContent.trim(); // TEMP DEBUG
        debugState[label] = { raw: 0, applied: 0, isOpen: false }; // TEMP DEBUG
        var lastToggleAt = 0;
        link.addEventListener('click', function(e){
          if (window.matchMedia('(max-width: 1099px)').matches){
            e.preventDefault();
            debugState[label].raw++; // TEMP DEBUG
            // Guards against duplicate/ghost click events that some
            // touch-emulation environments (e.g. browser devtools device
            // toolbars) can fire for a single tap.
            var now = Date.now();
            if (now - lastToggleAt < 80) { renderDebug(); return; } // TEMP DEBUG (renderDebug call)
            lastToggleAt = now;
            li.classList.toggle('sub-open');
            debugState[label].applied++; // TEMP DEBUG
            debugState[label].isOpen = li.classList.contains('sub-open'); // TEMP DEBUG
            renderDebug(); // TEMP DEBUG
          } else {
            closeMenu();
          }
        });
      } else {
        link.addEventListener('click', closeMenu);
      }
    });

    renderDebug(); // TEMP DEBUG

    gnav.querySelectorAll('.sub-menu a').forEach(function(link){
      link.addEventListener('click', closeMenu);
    });
  })();