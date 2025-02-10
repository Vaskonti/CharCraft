import {hostName} from "../src/js/config.js";
import { isUserLoggedIn, logout, redirectToRegistration } from "../src/js/user_details.js";

if (!isUserLoggedIn()) {
    redirectToRegistration();
}

async function getPostData(){
    const postsData = await fetch(hostName + '/posts', {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        return response.json();
    }).catch(error => {
        console.error('Error fetching posts:', error);
        alert('Failed to load posts. Please try again later.');
    });
    return postsData;
}

async function getUserImages(){
    const userImages = await fetch(hostName + '/user/images' , {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        return response.json();
    }).catch(error => {
        console.error('Error fetching posts:', error);
        alert('Failed to load images. Please try again later.');
    });
    return userImages;
}

export async function getComments(postId) {
    return fetch(hostName + '/post/comments' + '?post_id=' + postId, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response =>
        response.json()
    ).then(data => {
        return data
    });
}

export async function like(entityId, type, isLiked) {
    const data = {
        entity_id: entityId,
        entity_type: type
    }
    return fetch(hostName + (isLiked ? '/unlike' : '/like'), {
        method: isLiked ? 'DELETE' : 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    }).then(response =>
        response.json()
    ).then(data => {
        return data
    });
}

export async function getImagePath(imageId)
{
    const imagePath = await fetch(hostName + '/image/path' + '?image_id=' + imageId, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        return response.json();
    }).catch(error => {
        console.error('Error fetching image path:', error);
        alert('Failed to load image path. Please try again later.');
    });
    return imagePath;
}

export async function generatePost(post, comments, isNewPost = false) {
    const postElement = document.createElement("section");
    if (isNewPost) {
        post.image_path = (await getImagePath(post.ascii_image_id)).image_path;
    }
    postElement.classList.add("post");
    postElement.innerHTML = `
                <h3 class="username">${post.title}</h3>
            <time class="created-at">${post.created_at}</time>
            <img src="${post.image_path}" alt="ASCII image" class="ASCII-image">
            <h3 class="title">${post.title}</h3>
            <section class="likes">
                <img src="/assets/images/icons/heart-empty.png" 
                     alt="like" 
                     class="icon like-icon">
                <p class="like-count">${post.likes}</p>
            </section>
            <p class="description">${post.content}</p>
            
            <section class="comments">
                <h4>Comments:</h4>
                <section class="comment-list"></section>
                <form class="comment-form">
                    <input type="hidden" name="postId" value="${post.id}">
                    <input type="text" name="comment" class="comment-input" placeholder="Add a comment..." required />
                    <input type="submit" class="comment-btn" value="Comment"></input>
                </form>
            </section>
        `;

    const commentList = postElement.querySelector(".comment-list");
    comments.forEach(comment => {
        const htmlValue =`
            <img src="/assets/images/icons/heart-empty.png" 
                     alt="like" 
                     class="icon like-icon">
                     <section class="like-count">${comment.likes}</section>
                    <section class="comment-text">${comment.username} : ${comment.content}</section>`;
        const commentItem = document.createElement("section");
        commentItem.classList.add("comment-item");
        commentItem.innerHTML = htmlValue;
        const likeIcon = commentItem.querySelector(".like-icon");
        likeIcon.addEventListener("click", function () {
                if (likeIcon.src.includes("heart-empty.png")) {
                    likeIcon.src = "/assets/images/icons/heart-full.png";
                    like(comment.id, 'comment', false);
                    comment.likes++;
                } else {
                    likeIcon.src = "/assets/images/icons/heart-empty.png";
                    like(comment.id, 'comment', true);
                    comment.likes--;
                }
                commentItem.querySelector(".like-count").textContent = comment.likes;
            });
        commentList.appendChild(commentItem);
    });

    const likeIcon = postElement.querySelector(".like-icon");
    likeIcon.addEventListener("click", function () {
        if (likeIcon.src.includes("heart-empty.png")) {
            likeIcon.src = "/assets/images/icons/heart-full.png";
            like(post.id, 'post', false);
            post.likes++;
        } else {
            likeIcon.src = "/assets/images/icons/heart-empty.png";
            like(post.id, 'post', true);
            post.likes--;
        }
        postElement.querySelector(".like-count").textContent = post.likes;
    });

    const commentForm = postElement.querySelector(".comment-form");
    commentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const commentInput = commentForm.querySelector(".comment-input");
        const commentText = commentInput.value.trim();

        if (commentText === "") return;

        const formData = new FormData();
        formData.append('post_id', parseInt(post.id));
        formData.append('content', commentText);
        let jsonData = {};

        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        const comments = await fetch(hostName + '/post/comment', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {'Content-Type': 'application/json'}
        })
            .then(response => {
                if (!response.ok) {
                    alert(`Something went wrong! \n${response.status}`);
                    throw new Error('Failed to submit comment');
                }
                return response.json();
            })
            .then(data => {
                const commentHtml = `<img src="/assets/images/icons/heart-empty.png" 
                     alt="like" 
                     class="icon like-icon">
                     <section class="like-count">0</section>
                    <section class="comment-text">You : ${commentText}</section>`;
                const newComment = document.createElement("section");
                newComment.classList.add("comment-item");
                newComment.innerHTML = commentHtml;
                const likeIcon = newComment.querySelector(".like-icon");
                likeIcon.addEventListener("click", function () {
                    if (likeIcon.src.includes("heart-empty.png")) {
                        likeIcon.src = "/assets/images/icons/heart-full.png";
                        like(data.comment_id, 'comment', false);
                        newComment.querySelector(".like-count").textContent = 1;
                    } else {
                        likeIcon.src = "/assets/images/icons/heart-empty.png";
                        like(data.comment_id, 'comment', true);
                        newComment.querySelector(".like-count").textContent = 0;
                    }
                });
                commentList.appendChild(newComment);

                commentInput.value = "";
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    return postElement;
}

async function generatePosts(posts) {
    const postsContainer = document.querySelector(".posts-container");
    for (const post of posts) {
        const comments = await getComments(post.id);
        const postElement = await generatePost(post, comments);
        postsContainer.appendChild(postElement);
    }
}
var selectedImage;

document.addEventListener('DOMContentLoaded', async () => {
    const postCreationForm = document.getElementById('post-creation-form');
    if (!postCreationForm) {
        return;
    }
    const postData = await getPostData();
    generatePosts(postData);
    const userImages = await getUserImages();
    const imageSelection = document.getElementById('choose-photo-btn');
    const postPopUpSection = document.createElement("section");
    postPopUpSection.classList.add("pop-up");
    postPopUpSection.classList.add("hidden");
    userImages.values().forEach(image =>{
        const imageBtn = document.createElement("button");
        imageBtn.type = "button"
        imageBtn.classList.add("option");
        imageBtn.addEventListener("click", function(){
            selectedImage = image.id;
            postPopUpSection.classList.add("hidden");
        });
        imageBtn.innerHTML = `<img src="${image.path}" alt="ASCII image" class="ASCII-image">`;
        postPopUpSection.append(imageBtn);
    })
    
    const closeButton = document.createElement("button");
    closeButton.classList.add("close-btn");
    closeButton.type = "button"
    closeButton.textContent = "x";
    postPopUpSection.appendChild(closeButton);

    postCreationForm.appendChild(postPopUpSection);

    imageSelection.addEventListener("click", () => {
        postPopUpSection.classList.remove("hidden");
    });

    closeButton.addEventListener("click", () => {
        console.log("Closing popup...");
        postPopUpSection.classList.add("hidden");
    });

    postCreationForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        if(!selectedImage)
        {
            alert("Please select image");
            return;
        }
        let formData = new FormData(this);
        formData.append('ascii_image_id', selectedImage);

        let jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });

        const response = await fetch(hostName + '/post', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {'Content-Type': 'application/json'}
        });

        if (!response.ok) {
            console.log("Failed to create post");
        }
        else
        {
            formData.ascii_image_id = selectedImage;
            formData.likes = 0;
            formData.content = jsonData["content"];
            formData.title = jsonData["title"];
            formData.created_at = new Date().toISOString().slice(0, 19).replace("T", " ");
            formData.id = (await response.json()).id;
            const post = await generatePost(formData, [], true);
            const postsContainer = document.querySelector('.posts-container');
            postsContainer.prepend(post);
        }
    });

    logout();
});

