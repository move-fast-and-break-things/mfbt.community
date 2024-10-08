'use strict';

// load more content
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

const members_url = "https://api.github.com/orgs/move-fast-and-break-things/members";

// fetch authors data
async function getAuthors(apiURL) {
  try {
    const response = await fetch(apiURL);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return Promise.all(data.map(async (element) => {
      const userResponse = await fetch(element.url);
      if (!userResponse.ok) {
        throw new Error(`HTTP error! status: ${userResponse.status}`);
      }
      const userData = await userResponse.json();
      return {
        name: userData.name || userData.login,
        bio: userData.bio,
        avatar: userData.avatar_url,
        html_url: userData.html_url,
      };
    }));
  } catch (error) {
    console.error("Error fetching authors:", error);
    return [];
  }
}

// set authors in the DOM
async function setAuthors(apiURL) {
  try {
    const authors = await getAuthors(apiURL);
    const container = document.querySelector("#creators > div > div");
    if (!container) {
      throw new Error("Container element not found");
    }
    authors.forEach(author => {
      const personDiv = document.createElement('div');
      personDiv.className = 'person';
      personDiv.innerHTML = `
                <div class="name_and_img">
                    <img src="${author.avatar}" alt="${author.name}'s avatar">
                    <p class="person_name">${author.name}</p>
                </div>
                <p class="about_person">${author.bio || 'No biography available'}</p>
            `;
      container.appendChild(personDiv);
    });
  } catch (error) {
    console.error("Error setting authors:", error);
  }
}

// set contributors in the DOM
async function setContributors(apiURL, element) {
  try {
    const contributors = await getAuthors(apiURL);
    element.innerHTML = contributors.length === 0 ? "No developers found" :
      contributors.map(contributor => `
                <span class="developer-name">
                    <a href="${contributor.html_url}" class="tooltip" target="_blank">  
                        <img src="${contributor.avatar}" alt="${contributor.name}'s avatar" class="shining-image">  
                        <span class="tooltip-text">${contributor.name}</span>  
                    </a>
                </span>
            `).join('');
  } catch (error) {
    console.error("Error setting contributors:", error);
    element.innerHTML = "Error loading developers";
  }
}

// load all contributors
async function loadAllContributors() {
  const developerLists = document.querySelectorAll(".developers-list");
  const promises = Array.from(developerLists).map(devList => {
    const apiURL = devList.getAttribute("data-value");
    return setContributors(apiURL, devList);
  });
  await Promise.all(promises);
}

// Scroll-to-top functionality
function setupScrollToTop() {
  const toTopButton = document.getElementById('toTop');
  if (!toTopButton) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      toTopButton.style.display = 'block';
    } else {
      toTopButton.style.display = 'none';
    }
  });

  toTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Wait for DOM content to be loaded before executing scripts
document.addEventListener('DOMContentLoaded', () => {
  setAuthors(members_url);
  loadAllContributors();
  setupScrollToTop();
});