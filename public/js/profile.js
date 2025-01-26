import {generatePost} from './feed.js';

const profileData = 
{
    "username": "ascii_artist123",
    "posts": [
      {
        "title": "Sunset Vibes",
        "description": "An ASCII representation of a peaceful sunset.",
        "image_id": "1",
        "created_at": "2025-01-24T14:30:00Z",
        "likes": 120,
        "comments": [
            { "username": "Alice", "content": "Wow, amazing shot!" },
            { "username": "Bob", "content": "Looks fantastic!" }
        ]
      },
      {
        "title": "Cyber Cityscape",
        "description": "A futuristic city made entirely in ASCII art.",
        "image_id": "1",
        "created_at": "2025-01-20T10:15:00Z",
        "likes": 340,
        "comments": [
            { "username": "Alice", "content": "Wow, amazing shot!" },
            { "username": "Bob", "content": "Looks fantastic!" }
        ]
      },
      {
        "title": "Minimalist Cat",
        "description": "A simple yet cute ASCII cat.",
        "image_id": "1",
        "created_at": "2025-01-18T08:45:00Z",
        "likes": 89,
        "comments": [
            { "username": "Alice", "content": "Wow, amazing shot!" },
            { "username": "Bob", "content": "Looks fantastic!" }
        ]
      },
      {
        "title": "Space Odyssey",
        "description": "ASCII art inspired by space exploration.",
        "image_id": "1",
        "created_at": "2025-01-15T19:00:00Z",
        "likes": 450,
        "comments": [
            { "username": "Alice", "content": "Wow, amazing shot!" },
            { "username": "Bob", "content": "Looks fantastic!" }
        ]
      }
    ]
  }
  
function generateProfile(profileData) {
  const profileContainer = document.getElementById("profile-container");

  profileContainer.innerHTML = '';

  const userHeader = document.createElement("section");
  userHeader.classList.add("user-header");

  const usernameHeading = document.createElement("h2");
  usernameHeading.textContent = profileData.username;
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

  profileData.posts.forEach(post => {
      const button = document.createElement("button");
      button.classList.add("image-btn");

      const img = document.createElement("img");
      img.src = `/public/assets/images/${post.image_id}.png`;
      img.alt = post.title;

      button.appendChild(img);
      imageContainer.appendChild(button);

      const postPopUpSection = document.createElement("section");
      postPopUpSection.classList.add("hidden");
      postPopUpSection.classList.add("pop-up");
      const postElement = generatePost(post);
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

  profileContainer.appendChild(imageContainer);
}

document.addEventListener("DOMContentLoaded", function () { 
  generateProfile(profileData);
});

