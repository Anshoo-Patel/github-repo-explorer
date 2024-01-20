// scripts.js

const API_BASE_URL = 'https://api.github.com';

let currentPage = 1;
let username = '';
let reposPerPage = 10;

function getRepositories() {
    username = $('#username').val().trim();
    if (username === '') {
        alert('Please enter a valid username.');
        return;
    }

    showLoader();

    // Make API request to get user details
    $.ajax({
        url: `/api/repositories/${username}`, // This endpoint is handled by your server
        method: 'GET',
        success: function (data) {
            hideLoader();
            displayUserProfile(data.userData);

            // Move getRepositoriesForUser inside the success callback
            getRepositoriesForUser();
        },
        error: function (error) {
            hideLoader();
            alert(`Error fetching user details for ${username}. Please check the username and try again.`);
            console.error('Error fetching user details:', error);
        }
    });
}

// Rest of the code remains unchanged...



function getRepositoriesForUser() {
    // Make API request to get repositories
    $.ajax({
        url: `/api/repositories/${username}`, // Update the URL to use the server endpoint
        method: 'GET',
        success: function (data) {
            hideLoader();
            displayRepositories(data.reposData); // Update to access the correct property
        },
        error: function (error) {
            hideLoader();
            alert(`Error fetching repositories for ${username}. Please check the username and try again.`);
            console.error(error);
        }
    });
}

function displayUserProfile(userData) {
    const profileSection = $('#profileSection');
    profileSection.empty();

    const fullName = userData.name ? `<p><strong>${userData.name}</strong></p>` : '';

    // Check if bio/description and location exist before displaying
    const bio = userData.bio ? `<p>${userData.bio}</p>` : '';
    const location = userData.location ? `<p>📍${userData.location}</p>` : '';

    const followers = `<p>Followers: ${userData.followers}</p>`;
    const publicRepos = `<p>Public Repositories: ${userData.public_repos}</p>`;

    const socialLinks = userData.blog || userData.twitter_username || userData.company ?
        `<p>${userData.blog || userData.twitter_username || userData.company}</p>` : '';

    const profileInfo = `
        <div class="profile-info">
            <img class="profile-image" src="${userData.avatar_url}" alt="Profile Image">
            <div class="profile-details">
                ${fullName}
                ${bio}
                ${location}
                ${followers}
                ${publicRepos}
            </div>
        </div>
        ${socialLinks}
    `;

    profileSection.append(profileInfo);
}





function displayRepositories(repositories) {
    const repoList = $('#repoList');
    repoList.empty();

    repositories.forEach(repo => {
        const description = repo.description ? `<p>Description: ${repo.description}</p>` : '';
        const topicsString = repo.topics && repo.topics.length > 0 ? getTopicsString(repo.topics) : '';
        const tagsString = repo.tags && repo.tags.length > 0 ? getTagsString(repo.tags) : '';

        const repoItem = `
            <li class="repo-item">
                <strong>${repo.name}</strong>
                ${description}
                ${topicsString ? `<p>Topics: ${formatTopics(topicsString)}</p>` : ''}
                ${tagsString ? `<p>Tags: ${tagsString}</p>` : ''}
            </li>
        `;
        repoList.append(repoItem);
    });

    updatePaginationText();
}

function getTopicsString(topics) {
    return topics.join(', ');
}

function getTagsString(tags) {
    return tags.join(', ');
}

function formatTopics(topicsString) {
    const topicsArray = topicsString.split(', ');
    const formattedTopics = topicsArray.map(topic => `<span class="topic-box">${topic}</span>`);
    return formattedTopics.join(' ');
}




function showLoader() {
    $('#loader').show();
}

function hideLoader() {
    $('#loader').hide();
}

function updatePaginationText() {
    $('#currentPage').text(`Page ${currentPage}`);
}

function nextPage() {
    currentPage++;
    getRepositoriesForUser();
}

function previousPage() {
    if (currentPage > 1) {
        currentPage--;
        getRepositoriesForUser();
    }
}

// Event listener for changing repos per page
$('#reposPerPage').change(function () {
    reposPerPage = parseInt($(this).val(), 10);
    getRepositoriesForUser();
});

// ... (rest of the script remains the same)
