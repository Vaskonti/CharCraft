import {generatePost, getImagePath, getComments} from './feed.js';
import {hostName} from "../src/js/config.js";
import { isUserLoggedIn, redirectToRegistration, getUserUsername, logout} from "../src/js/user_details.js";

if (!isUserLoggedIn()) {
  redirectToRegistration();
}

async function generateProfile(profileData) {
  const profileContainer = document.getElementById("profile-container");

  profileContainer.innerHTML = '';

  const userHeader = document.createElement("section");
  userHeader.classList.add("user-header");

  const usernameHeading = document.createElement("h2");
   getUserUsername().then( username => {
    usernameHeading.textContent = username;
  });
  
  userHeader.appendChild(usernameHeading);

  const changePasswordBtn = document.createElement("button");
  changePasswordBtn.textContent = "Change Password";
  changePasswordBtn.classList.add("change-password-btn");
  changePasswordBtn.addEventListener("click", () => {
      
  });
  userHeader.appendChild(changePasswordBtn);

  profileContainer.appendChild(userHeader);

  const imageContainer = document.createElement("section");
  imageContainer.classList.add("image-container");

  profileData.forEach(async post => {
    const imagePath = await getImagePath(post.ascii_image_id);
    const button = document.createElement("button");
    button.classList.add("image-btn");
    const img = document.createElement("img");
    img.src = `${imagePath.image_path}`;
    img.alt = post.title;

    button.appendChild(img);
    imageContainer.appendChild(button);

    const postPopUpSection = document.createElement("section");
    postPopUpSection.classList.add("hidden");
    postPopUpSection.classList.add("pop-up");

    const comments = await getComments(post.id);
    const postElement = await generatePost(post, comments);
    postPopUpSection.append(postElement);
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-btn");
    closeButton.textContent = "x";
    postPopUpSection.appendChild(closeButton);

    imageContainer.appendChild(postPopUpSection);

    button.addEventListener("click", () => {
      postPopUpSection.classList.remove("hidden");
    });

    closeButton.addEventListener("click", () => {
      postPopUpSection.classList.add("hidden");
    }); 
  });
  if (profileData.length === 0) {
    const noPosts = document.createElement("p");
    noPosts.textContent = "No posts to show";
    imageContainer.appendChild(noPosts);
  }

  profileContainer.appendChild(imageContainer);
}

document.addEventListener("DOMContentLoaded", async function () { 
  console.log("7");
  const profileData = await fetch(hostName + '/user/posts', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'}
  })
  .then(response => {
    if (!response.ok) {
        alert(`Something went wrong! \n${response.status}`);
        throw new Error('Failed to submit comment');
    }
    return response.json();
  })
  .catch(error => {
    console.error('Error:', error);
  });
  generateProfile(profileData);

  logout();
});

