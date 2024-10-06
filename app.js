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

const members_url =
  "https://api.github.com/orgs/move-fast-and-break-things/members";

async function getAuthors(apiURL) {
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

async function setAuthors(apiURL) {
  // Getting authors and placing them
  const authors = await getAuthors(apiURL);
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
}

async function setContributors(apiURL, element) {
  const contributors = await getAuthors(apiURL);
  if (contributors.length === 0) {
    element.innerHTML = "No developers found";
    return;
  }
  
  // Clear loading message
  element.innerHTML = "";
  // List developer names
  for (const contributor of contributors) {
    element.innerHTML += `
      <span class="developer-name">
        <a href="${contributor.html_url}" class="tooltip" target="_blank">  
          <img src="${contributor.avatar}" alt="" class="shining-image">  
          <span class="tooltip-text">${contributor.name}</span>  
        </a>
      </span>
    `;
  }
}

function loadAllContributors() {
  const developerLists = document.querySelectorAll(".developers-list");
  for (const devList of developerLists) {
    const apiURL = devList.getAttribute("data-value"); // Get API URL from data-value attribute
    await setContributors(apiURL, devList); // Fetch and set contributors for each element
  }
}

window.onload = function () {
  setAuthors(members_url);
  loadAllContributors()
};
