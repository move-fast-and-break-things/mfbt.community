// --- NAVBAR HIDE/SHOW ON SCROLL ---
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
    if (lastScrollY < window.scrollY && window.scrollY > 100) {
        header.classList.add('header--hidden');
    } else {
        header.classList.remove('header--hidden');
    }
    lastScrollY = window.scrollY;
});


// --- PROJECT CARD FADE-IN ANIMATION ---
const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            cardObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.project-card:not(.hidden)').forEach(card => {
    cardObserver.observe(card);
});


// --- LOAD & HIDE PROJECTS ---
const projectsSection = document.getElementById('projects');
const loadMoreBtn = document.getElementById('load-more-btn');
const hideBtn = document.getElementById('hide-btn');

if (loadMoreBtn && hideBtn) {

    loadMoreBtn.addEventListener('click', () => {

        const hiddenCards = document.querySelectorAll('.project-card.hidden');
        let cardsToShow = 3;

        for (let i = 0; i < cardsToShow && i < hiddenCards.length; i++) {
            const card = hiddenCards[i];
            card.classList.remove('hidden');
            cardObserver.observe(card);
        }

        if (document.querySelectorAll('.project-card.hidden').length === 0) {
            loadMoreBtn.classList.add('hidden');
        }

        hideBtn.classList.remove('hidden');
    });

    hideBtn.addEventListener('click', () => {

        const visibleCards = document.querySelectorAll('.project-card');
        for (let i = 3; i < visibleCards.length; i++) {
            visibleCards[i].classList.add('hidden');
            visibleCards[i].classList.remove('is-visible');
        }

        hideBtn.classList.add('hidden');
        loadMoreBtn.classList.remove('hidden');
        projectsSection.scrollIntoView({ behavior: 'smooth' });

    });

}


// --- MISSION SECTION ANIMATION ---
const missionContent = document.querySelector('.mission-content');
if (missionContent) {
    const missionObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                missionObserver.unobserve(entry.target);
            }
        });

    }, { threshold: 0.2 });
    missionObserver.observe(missionContent);
}


// --- GITHUB COMMUNITY MEMBERS ---
const members_url = "https://api.github.com/orgs/move-fast-and-break-things/members?per_page=100";

async function getAuthors(apiURL) {
    const response = await fetch(apiURL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const members = await response.json();
    return Promise.all(members.map(async (member) => {
        const userResponse = await fetch(member.url);
        const userData = await userResponse.json();

        return {
            image: userData.avatar_url,
            name: userData.name || userData.login,
            role: "Community Member",
            bio: userData.bio || "Open-source contributor"
        };

    }));

}
function preloadImages(creators) {
    creators.forEach(person => {
        const img = new Image();
        img.src = person.image;
    });
}

// --- UNIVERSAL DOMCONTENTLOADED WRAPPER ---
document.addEventListener('DOMContentLoaded', async () => {
    // --- VALUES AUTO-SCROLLER ---
    const scroller = document.querySelector(".values-scroller");
    if (scroller) {
        const scrollerInner = scroller.querySelector(".values-list");
        const scrollLeftBtn = document.getElementById('scroll-left');
        const scrollRightBtn = document.getElementById('scroll-right');

        const valuesData = [
            { icon: '🤝', title: 'Kindness', text: 'We prioritize respect and kindness towards every member.' },
            { icon: '💡', title: 'Mutual Assistance', text: 'We strongly believe in the power of collaboration and helping one another.' },
            { icon: '❓', title: 'Openness', text: 'We embrace a culture of curiosity and encourage members to ask questions freely.' },
            { icon: '🚀', title: 'Courage', text: 'We encourage our members to step out of their comfort zones and take risks.' },
            { icon: '🔍', title: 'Curiosity', text: 'Learning is an exciting journey, and we celebrate the joy of discovering new things.' }
        ];

        valuesData.forEach(item => {
            const li = document.createElement('li');
            li.className = 'value-card';

            li.innerHTML = `
                <div class="value-icon">${item.icon}</div>
                <h3>${item.title}</h3>
                <p>${item.text}</p>
            `;
            scrollerInner.appendChild(li);

        });


        const originalContent = Array.from(scrollerInner.children);
        originalContent.forEach(item => {
            const duplicatedItem = item.cloneNode(true);
            duplicatedItem.setAttribute("aria-hidden", true);
            scrollerInner.appendChild(duplicatedItem);

        });


        let autoScrollInterval;
        let isHovering = false;

        function startAutoScroll() {
            if (isHovering) return;
            autoScrollInterval = setInterval(() => {
                const maxScroll = scroller.scrollWidth / 2;
                if (scroller.scrollLeft >= maxScroll) {
                    scroller.scrollLeft = 0;
                } else {
                    scroller.scrollLeft += 1;
                }
            }, 25);

        }

        function stopAutoScroll() {
            clearInterval(autoScrollInterval);
        }
        scroller.parentElement.addEventListener('mouseenter', () => {
            isHovering = true;
            stopAutoScroll();
        });
        scroller.parentElement.addEventListener('mouseleave', () => {
            isHovering = false;
            startAutoScroll();
        });
        scrollLeftBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: -350 });
        });
        scrollRightBtn.addEventListener('click', () => {
            scroller.scrollBy({ left: 350 });
        });
        startAutoScroll();
    }



    // --- MEET THE CREATORS SLIDER (NOW FROM GITHUB) ---
    const creatorsData = await getAuthors(members_url);
    preloadImages(creatorsData);

    const creatorImg = document.getElementById('creator-img');
    const creatorInfo = document.querySelector('.creator-info');

    if (creatorImg && creatorInfo) {

        let currentCreatorIndex = 0;

        const creatorName = document.getElementById('creator-name');
        const creatorRole = document.getElementById('creator-role');
        const creatorBio = document.getElementById('creator-bio');
        const prevBtn = document.getElementById('creator-prev');
        const nextBtn = document.getElementById('creator-next');
        const dotsContainer = document.getElementById('slider-dots');


        function updateCreatorCard(index) {
            creatorImg.classList.add('fade-out');
            creatorInfo.classList.add('fade-out');
            setTimeout(() => {
                const creator = creatorsData[index];
                creatorImg.src = creator.image;
                creatorName.textContent = creator.name;
                creatorRole.textContent = creator.role;
                creatorBio.textContent = creator.bio;
                creatorImg.classList.remove('fade-out');
                creatorInfo.classList.remove('fade-out');
                creatorImg.classList.add('slide-in-left');
                creatorInfo.classList.add('slide-in-right');
                document.querySelectorAll('.slider-dot').forEach((dot, dotIndex) => {
                    dot.classList.toggle('active', dotIndex === index);
                });
            }, 300);

            setTimeout(() => {
                creatorImg.classList.remove('slide-in-left');
                creatorInfo.classList.remove('slide-in-right');

            }, 800);

        }


        creatorsData.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('slider-dot');
            dot.addEventListener('click', () => {
                if (index !== currentCreatorIndex) {
                    currentCreatorIndex = index;
                    updateCreatorCard(currentCreatorIndex);
                }
            });

            dotsContainer.appendChild(dot);
        });


        prevBtn.addEventListener('click', () => {
            currentCreatorIndex = (currentCreatorIndex - 1 + creatorsData.length) % creatorsData.length;
            updateCreatorCard(currentCreatorIndex);

        });


        nextBtn.addEventListener('click', () => {

            currentCreatorIndex = (currentCreatorIndex + 1) % creatorsData.length;
            updateCreatorCard(currentCreatorIndex);

        });


        updateCreatorCard(0);

        const creatorsSection = document.querySelector('.creators-section');
        const creatorsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {

                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    creatorsObserver.unobserve(entry.target);
                }
            });

        }, { threshold: 0.15 });

        if (creatorsSection) {
            creatorsObserver.observe(creatorsSection);
        }
    }

    // --- JOIN US SECTION STAGGERED ANIMATION ---
    const joinUsBlocks = document.querySelectorAll('.join-us-section .join-us-block');

    if (joinUsBlocks.length > 0) {

        const joinUsObserver = new IntersectionObserver((entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    const delay = (Array.from(joinUsBlocks).indexOf(entry.target) * 100) + 'ms';

                    entry.target.style.transitionDelay = delay;
                    entry.target.classList.add('is-visible');

                    joinUsObserver.unobserve(entry.target);

                }

            });

        }, { threshold: 0.1 });

        joinUsBlocks.forEach(block => {
            joinUsObserver.observe(block);
        });

    }

});


// --- PROJECT MODAL ---
const allProjectCards = document.querySelectorAll('.project-card');
const modal = document.getElementById('project-modal');
const modalCloseBtn = modal.querySelector('.modal-close-btn');

if (allProjectCards.length > 0 && modal) {

    function openModal(card) {

        const cardImage = card.querySelector('.project-image-container img');
        const imgSrc = cardImage ? cardImage.src : '';

        modal.querySelector('#modal-img').src = imgSrc;
        modal.querySelector('#modal-title').textContent = card.dataset.title;
        modal.querySelector('#modal-details').textContent = card.dataset.details;
        modal.querySelector('#modal-link').href = card.dataset.repoUrl;

        modal.classList.remove('modal-hidden');
        document.body.classList.add('body-no-scroll');
    }

    function closeModal() {
        modal.classList.add('modal-hidden');
        document.body.classList.remove('body-no-scroll');
    }

    allProjectCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    modalCloseBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });

}