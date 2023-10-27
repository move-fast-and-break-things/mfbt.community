function loadMore() {
    var paragraphs = document.querySelectorAll('#projects_items .load_more');
    for (var i = 0; i < paragraphs.length; i++) {
      paragraphs[i].classList.add('show');
    }
    var hr = document.querySelectorAll('.line_hr');
    for (var i = 0; i < hr.length; i++) {
        hr[i].classList.add('sh');
      }
    document.getElementById('load-more-button').style.display = 'none';
}