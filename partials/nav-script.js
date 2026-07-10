  (function(){
    var toggle = document.getElementById('navToggle');
    var gnav = document.getElementById('gnav');
    var header = document.querySelector('.site-header');

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
    // toggle/mis-tap issue is diagnosed. Shows a live event trace (what was
    // actually clicked, in order) plus the current open/closed state of
    // every submenu item. ---
    var debugPanel = document.createElement('div');
    debugPanel.id = 'navDebugPanel';
    debugPanel.style.cssText = 'position:fixed;bottom:64px;left:8px;right:8px;z-index:9999;'
      + 'background:rgba(0,0,0,.9);color:#4dff4d;font:10.5px/1.45 monospace;'
      + 'padding:8px 10px;white-space:pre-wrap;max-height:46vh;overflow:auto;'
      + 'border-radius:6px;pointer-events:none;';
    document.body.appendChild(debugPanel);
    var debugLogLines = [];
    var debugStates = {};
    function debugLog(msg){
      var t = new Date();
      var ts = ('0' + t.getMinutes()).slice(-2) + ':' + ('0' + t.getSeconds()).slice(-2) + '.' + ('00' + t.getMilliseconds()).slice(-3);
      debugLogLines.push('[' + ts + '] ' + msg);
      if (debugLogLines.length > 14) debugLogLines.shift();
      renderDebug();
    }
    function renderDebug(){
      var stateLine = Object.keys(debugStates).map(function(label){
        return label + '=' + (debugStates[label] ? 'OPEN' : 'closed');
      }).join(' | ');
      debugPanel.textContent = '[STATE] ' + stateLine + '\n[LOG]\n' + debugLogLines.join('\n');
    }
    // --- END TEMP DEBUG PANEL SETUP ---

    function forceRepaint(){
      // Nudge a compositing-affecting property on the position:sticky
      // ancestor (the header) to force a real repaint, not just a layout
      // reflow — a plain offsetHeight read on the li alone was not enough
      // to fix a real-device repaint lag under position:sticky.
      if (!header) return;
      header.style.transform = 'translateZ(0)';
      void header.offsetHeight;
      header.style.transform = '';
    }

    gnav.querySelectorAll(':scope > ul > li').forEach(function(li){
      var link = li.querySelector(':scope > a');
      if (li.querySelector(':scope > .sub-menu')){
        var label = link.textContent.trim();
        debugStates[label] = false; // TEMP DEBUG
        var lastToggleAt = 0;
        link.addEventListener('click', function(e){
          debugLog('CLICK parent "' + label + '"'); // TEMP DEBUG
          if (window.matchMedia('(max-width: 1099px)').matches){
            e.preventDefault();
            var now = Date.now();
            if (now - lastToggleAt < 80) {
              debugLog('  -> debounced (ignored)'); // TEMP DEBUG
              return;
            }
            lastToggleAt = now;
            li.classList.toggle('sub-open');
            forceRepaint();
            debugStates[label] = li.classList.contains('sub-open'); // TEMP DEBUG
            debugLog('  -> applied, now ' + (debugStates[label] ? 'OPEN' : 'closed')); // TEMP DEBUG
          } else {
            closeMenu();
          }
        });
      } else {
        link.addEventListener('click', function(){
          debugLog('CLICK top-level "' + link.textContent.trim() + '" (no submenu, navigating)'); // TEMP DEBUG
          closeMenu();
        });
      }
    });

    gnav.querySelectorAll('.sub-menu a').forEach(function(link){
      link.addEventListener('click', function(){
        // TEMP DEBUG: if this fires when the user meant to tap a PARENT
        // item instead, it proves the tap hit a stale/mispositioned target.
        debugLog('CLICK SUBITEM "' + link.textContent.trim() + '" -> navigating to ' + link.getAttribute('href'));
        closeMenu();
      });
    });
  })();