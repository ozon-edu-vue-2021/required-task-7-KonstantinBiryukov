import profiles from "../data.js"

const contactList = document.querySelector("#container .contacts-list");
const containerListView = document.querySelector("#container .list-view");
const profileList = document.getElementById("profile-list");

// init base logic
init();

function init() {
    profiles.forEach(profile => {
        contactList.insertAdjacentHTML("afterbegin", renderProfileList(profile))
    })

    contactList.addEventListener("click", contactListClickHandler)
}

// event handlers
function contactListClickHandler(e) {
    // we can click on name (<strong>) or <li> element, if we click on <li>, we check the <strong> inside of it
    let name = e.target.innerText;
    if (e.target instanceof HTMLLIElement) {
        name = e.target.querySelector("strong").textContent;
    }
    profiles.forEach(profile => {
        if (name === profile.name) {
            destroyContactList();
            contactList.insertAdjacentHTML("afterbegin", renderProfileList(profile));
            renderProfileListStructure();
            renderFriends(profile.friends);
            renderNonFriends(profile.friends);
            renderTop3PopularPersons();
            contactList.addEventListener("click", backHomeHandler)
        }
    })
}

function backHomeHandler() {
    destroyProfilesList();
    init();
}

// html render functions
function renderProfileListStructure() {
    const profileListStructure =
        `<li class="people-title" id="friends-list">Друзья</li><br><br>
        <li class="people-title" id="non-friends-list">Не в друзьях</li>
        <li class="people-title" id="popular-names-list">Популярные люди</li>`
    profileList.insertAdjacentHTML("beforeend", profileListStructure);
}

function renderProfileList(profile) {
    return `
            <li>
                <strong>${profile.name}</strong>
            </li>`
}

function renderFriends(friends) {
    const friendsList = document.getElementById("friends-list");
    profiles.forEach(profile => {
        if (friends.includes(profile.id)) {
            friendsList.insertAdjacentHTML("afterend",
                `<li><i class=\"fa fa-male\"></i><span>${profile.name}</span></li>`)
        }
    })
}

function renderNonFriends(friends) {
    const nonFriendsList = document.getElementById("non-friends-list");
    let counter = 3;
    profiles.forEach(profile => {
        if (!friends.includes(profile.id) && counter > 0) {
            nonFriendsList.insertAdjacentHTML("afterend",
                `<li><i class=\"fa fa-male\"></i><span>${profile.name}</span></li>`);
            counter--;
        }
    })
}

const popularPersonsTop3 = find3TopPopularPersons();

function renderTop3PopularPersons() {
    const popularNamesList = document.getElementById("popular-names-list");
    profiles.forEach(profile => {
        if (popularPersonsTop3.includes(profile.id)) {
            popularNamesList.insertAdjacentHTML("afterend",
                `<li><i class=\"fa fa-male\"></i><span>${profile.name}</span></li>`)
        }
    });

}

// map of popular persons: {id: countOfOccurrences}
function find3TopPopularPersons() {
    const popularPersons = new Map();
    profiles.forEach(profile => {
        profile.friends.forEach(friendId => {
            if (popularPersons.has(friendId)) {
                let curValue = popularPersons.get(friendId) + 1
                popularPersons.set(friendId, curValue)
            } else {
                popularPersons.set(friendId, 1)
            }
        })
    })
    const sortedPopularPersons = new Map([...popularPersons.entries()].sort((a, b) => b[1] - a[1]));

    let popularPersonsIds = [];
    let counter = 3;
    for (let personId of sortedPopularPersons.keys()) {
        if (counter < 1) {
            break;
        }
        popularPersonsIds.push(personId);
        counter--;
    }

    return popularPersonsIds;
}

// destroy functions
function destroyContactList() {
    containerListView.style.background = "none";
    contactList.innerHTML = "";
    contactList.removeEventListener("click", contactListClickHandler)
}

function destroyProfilesList() {
    profileList.innerHTML = "";
    containerListView.style.background = "white"
}