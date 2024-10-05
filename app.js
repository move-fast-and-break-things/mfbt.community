function loadMore() {
  const paragraphs = document.querySelectorAll('#projects_items .load_more');
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].classList.add('show');
  }
  const hr = document.querySelectorAll('.line_hr');
  for (let i = 0; i < hr.length; i++) {
      hr[i].classList.add('sh');
    }
  document.getElementById('load-more-button').style.display = 'none';
  document.getElementById('hide-button').style.display = 'block';
}

function hide() {
  const paragraphs = document.querySelectorAll('#projects_items .load_more');
  for (let i = 0; i < paragraphs.length; i++) {
    paragraphs[i].classList.remove('show');
  }
  const hr = document.querySelectorAll('.line_hr');
  for (let i = 0; i < hr.length; i++) {
      hr[i].classList.remove('sh');
    }
  document.getElementById('load-more-button').style.display = 'block';
  document.getElementById('hide-button').style.display = 'none';
}

async function getAuthors() {
  const apiURL =
    "https://api.github.com/orgs/move-fast-and-break-things/members";
  let authors = [];
  const result = await fetch(apiURL); // Using github api to get the list of members
  const data = await result.json();
  for (const element of data) {
    // Getting avatar name, biography and url from each user, then putting them into an array
    const result = await fetch(element.url);
    const data = await result.json();
    authors.push({
      name: data.name ? data.name : data.login,
      bio: data.bio,
      avatar: data.avatar_url,
      html_url: data.html_url,
    });
  }
  return authors;
}

async function setAuthors() {
  // Getting authors and placing them
  const authors = await getAuthors();
  for (const author of authors) {
    document.querySelector("#creators > div > div").innerHTML += `
    <div class="person">
      <div class="name_and_img">
        <img src="${author.avatar}" alt="">
        <p class="person_name">${author.name}</p>
      </div>
      <p class="about_person">${author.bio}</p>
     </div>
     `;
  }
  
  let developersList = document.getElementsByClassName("developers-list");
  for (let i = 0; i < developersList.length; i++) {
    let list = developersList[i];
    if (authors.length > 0) {
      // Clear loading message
      list.innerHTML = "";
      // List developer names
      authors.forEach((author) => {
        list.innerHTML += 
        `
        <span class="developer-name">
          <a href="${author.html_url}" class="tooltip" target="_blank">  
            <img src="${author.avatar}" alt="" class="shining-image">  
            <span class="tooltip-text">${author.name}</span>  
          </a>
        </span>
        `;
      });
    } else {
      list.innerHTML = "No developers found";
    }
  }
}
/* <span class="developer-name"><a href="${author.html_url}" target="_blank">${author.name}</a></span><br> */

window.onload = function () {
  setAuthors();
};
