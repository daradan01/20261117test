// PWA: 서비스 워커 등록 + 모바일에서만 앱 설치 안내 표시 (PC에서는 표시 안 함)
(function () {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    });
  }

  var ua = navigator.userAgent;
  var isIOS = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && navigator.maxTouchPoints > 1);
  var isMobile = isIOS || /Android|Mobile/i.test(ua);
  var isInstalled = window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
  var KEY = 'installPromptDismissed';

  if (!isMobile || isInstalled) return; // PC이거나 이미 설치된 경우 표시하지 않음

  function dismissed() { try { return localStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function remember() { try { localStorage.setItem(KEY, '1'); } catch (e) {} }

  var banner = document.getElementById('install-banner');
  var text = document.getElementById('install-text');
  var yes = document.getElementById('install-yes');
  var no = document.getElementById('install-no');
  var deferred = null;

  function show() { if (!dismissed()) banner.hidden = false; }
  function hide() { banner.hidden = true; }

  no.addEventListener('click', function () { remember(); hide(); });

  if (isIOS) {
    // iOS(사파리)는 자동 설치 창이 없어서 방법을 안내
    text.textContent = '홈 화면에 추가하면 앱처럼 사용할 수 있어요. 아래 공유 버튼을 누른 뒤 “홈 화면에 추가”를 선택하세요.';
    yes.hidden = true;
    no.textContent = '확인';
    show();
    return;
  }

  // 안드로이드(크롬): 설치 가능해지면 설치 여부를 물음
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();
    deferred = e;
    text.textContent = '앱을 설치하시겠어요? 홈 화면에서 바로 열 수 있어요.';
    show();
  });

  yes.addEventListener('click', function () {
    if (!deferred) return;
    deferred.prompt();
    deferred.userChoice.then(function () { deferred = null; hide(); });
  });

  window.addEventListener('appinstalled', hide);
})();
