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

async function loadAuthors() {
  const apiURL = "https://api.github.com/orgs/move-fast-and-break-things/members"
  await fetch(apiURL)
          .then((result) => result.json())
          .then((data) => {
            data.forEach(element => {
              fetch(element.url)
                .then((result) => result.json())
                .then((data) => {
                  document.querySelector("#creators > div > div").innerHTML +=
                    `
                    <div class="person">
                      <div class="name_and_img">
                        <img src="${data.avatar_url}" alt="">
                        <p class="person_name">${data.name?data.name:data.login}</p>
                      </div>
                      <p class="about_person">${data.bio}</p>
                    </div>
                    `
                })
            })
          })
}

window.onload = function() {
  loadAuthors()
}
