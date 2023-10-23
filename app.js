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


async function getAuthors() {
  const apiURL = "https://api.github.com/orgs/move-fast-and-break-things/members";
  let authors = [];
  const result = await fetch(apiURL);                             // Using github api to get the list of members 
  const data = await result.json();
  for (const element of data) {                                   // Getting avatar name, biography and url from each user, then putting them into an array
    const result = await fetch(element.url);
    const data = await result.json();
    authors.push({
      name: data.name ? data.name : data.login,
      bio: data.bio,
      avatar: data.avatar_url
    });
  }
  return authors;
}


async function setAuthors() {                                    // Getting authors and placing them
  const authors = await getAuthors();
  for (const author of authors) {
    document.querySelector("#creators > div > div").innerHTML +=
      `
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


async function getProjects() {
  const apiURL = "https://api.github.com/orgs/move-fast-and-break-things/repos";
  let projects = [];
  const result = await fetch(apiURL);                             // Using github api to get the list of repos/projects
  const data = await result.json();
  for (const element of data) {
    projects.push({                                               // Getting name, url, description and contributors from each repo, then putting them into an array
      name: element.name,
      url: element.html_url,
      description: element.description,
      authors: element.contributors_url,
      stars: element.stargazers_count
    });
  }
  return projects;
}


async function setProjects() {
  const sortedProjects = (await getProjects()).sort((a, b) => a["stars"] < b["stars"] ? 1 : -1);
  for (const [index, project] of sortedProjects.entries()) {
    const result = await fetch(project.authors);
    const authors = await result.json();
    document.querySelector("#projects_items").innerHTML +=
      `
      <div class="projects_item ${index < 5 ? "" : "load_more"}">
        <div class="desc-left">
          <a href="${project.url}" target="_blank" class="project-name">
            <h3>${project.name}</h3>
          </a>
          <p class="projects_description">
            ${project.description}
            <br><br>
            <a href="${authors.length - 1 ? "https://github.com/move-fast-and-break-things" : authors[0].html_url}" target="_blank">${authors.length - 1 ? "Community" : authors[0].login}</a>
          </p>
          <a href="${project.url}" class="see_arrow">
            <p class="see_more">See more 
            </p>
            <img src="img/arrow.svg" alt="">
          </a>
        </div>
        <div class="desc-right">
          <img src="${PROJECT_TO_IMAGE_URL_MAP[project.name]}" alt="">
        </div>          
      </div>
      <hr size=3px width=100% color="#3D4250" class="${index < 5 ? "" : "line_hr"}">
      `;
  }
  document.querySelector("#projects_items").innerHTML += `<button id="load-more-button" class="more_pr" onclick="loadMore()">Load More</button>`
}


window.onload = function () {
  setAuthors();
  setProjects();
}


const PROJECT_TO_IMAGE_URL_MAP = {
  "dr-stone-character-classifier-demo": "https://opengraph.githubassets.com/d3b4712bb14eaadbdbdde120de9888157476e212b52dd2f611a160edb989b6c2/move-fast-and-break-things/dr-stone-character-classifier-demo",
  "rn-emoji-translator-demo": "https://opengraph.githubassets.com/ed1b5fbe7b8f69571bd9a4a6d93baf5f52ca3097c7f0d221dd8dce8b799308ab/move-fast-and-break-things/rn-emoji-translator-demo",
  "rn-tic-tac-toe-demo": "https://opengraph.githubassets.com/f8f7e2a322c82ad61d5def0b9fcf4e2efe48dd89eda5635588306bc234a7d1dd/move-fast-and-break-things/rn-tic-tac-toe-demo",
  "the-list": "https://opengraph.githubassets.com/e541e2af81620e6d5f807bbe5d6865ecf2ee44571f6a2b5c24a09914372346a8/move-fast-and-break-things/the-list",
  "japanese-reader": "https://opengraph.githubassets.com/1491dcdc5ec8fa0847ae7db663fdab91442e68e304eddd20353eba715103bfea/move-fast-and-break-things/japanese-reader",
  "masterpiece-creator": "https://opengraph.githubassets.com/410f204be608cd2ee1c2e04a2cb568794b38c9a3a0d085565d590eb943a534e7/move-fast-and-break-things/masterpiece-creator",
  "audio-compression": "https://opengraph.githubassets.com/c2f4ea8dce12fc1a437c3f577db74ef7cbde63f7c863d132ea973e16c0b53ed5/move-fast-and-break-things/audio-compression",
  "spider-recognizer": "https://opengraph.githubassets.com/2df646ee15f294567e096444ac0b723e27a0c01c79cc68157acbcc26e7c9dd36/move-fast-and-break-things/spider-recognizer",
  "spacemen": "https://opengraph.githubassets.com/18d44bffc4cea8e77ba6070ca653bd28422a9174af12b2551152a656fe76b90f/move-fast-and-break-things/spacemen",
  "Parrots": "https://opengraph.githubassets.com/c29247b988e856723dea8c098c5450ae3aee2459e1d540a8bff8a263959c6db1/move-fast-and-break-things/Parrots",
  "food-recogniser": "https://opengraph.githubassets.com/d5f88b35f067f9ee923b4e0c180a8a44442fdfdf911098aca6fbfc89ad1bc4e4/move-fast-and-break-things/food-recogniser",
  "JDM-initial-d-classification": "https://opengraph.githubassets.com/988f66e1ecc16f6821227ec9deb10f44861df1a3b06f4deff7975a110386f9c6/move-fast-and-break-things/JDM-initial-d-classification",
  "MusicRecommender": "https://opengraph.githubassets.com/490bd20ce9c0f3605ba54e0881598e0f5b4c102f47835066b4034f2e79548ff6/move-fast-and-break-things/MusicRecommender",
  "cosmetic-helper-bot": "https://opengraph.githubassets.com/c4b216aae54fa0a235e4ff2e962f578a9560530da361dbb16fc3db9afb50bb92/move-fast-and-break-things/cosmetic-helper-bot",
  "minerva": "https://repository-images.githubusercontent.com/626559688/ac79dd40-8fc4-4cfc-85d3-1c35ac267c00",
  "movefastandbreakthings.club": "https://opengraph.githubassets.com/96b1fef736f047a66480266c5f1fd7bcf99ed3cfa10abffee25c75d4a3208292/move-fast-and-break-things/movefastandbreakthings.club",
  "catalog": "https://opengraph.githubassets.com/658c772ee196d0d5ac2be9610f8c51cf6e65d6ffdcd821fbf9c7d125f80b1660/move-fast-and-break-things/catalog"
};