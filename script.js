// 문의 폼: 방문자의 메일 프로그램을 열어 문의 내용을 전송
document.getElementById('form').addEventListener('submit', function (e) {
  e.preventDefault();
  var f = e.target;
  var subject = '[홈페이지 문의] ' + f.name.value;
  var body = '보낸 사람: ' + f.name.value + '\n회신 이메일: ' + f.email.value + '\n\n' + f.message.value;
  window.location.href = 'mailto:sales1@plafarmmall.com?subject=' +
    encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});
