import {hostName} from "./config.js";

const postsData = await fetch(hostName + '/posts', {
    method: 'GET',
    headers: {'Content-Type': 'application/json'}
}).then(response => {
    return response.json();
}).then(posts => {
    generatePosts(posts);
}).catch(error => {
    console.error('Error fetching posts:', error);
    alert('Failed to load posts. Please try again later.');
});

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
export async function like(postId, isLiked) {
    const data = {
        entity_id: postId,
        entity_type: 'post'
    }
    return fetch(hostName + (isLiked ? '/unlike': '/like'), {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {'Content-Type': 'application/json'}
    }).then(response =>
        response.json()
    ).then(data => {
        return data
    });
}

export function generatePost(post, comments) {
    const postElement = document.createElement("section");
    postElement.classList.add("post");
    postElement.innerHTML = `
                <h3 class="username">${post.title}</h3>
            <time class="created-at">${post.created_at}</time>
            <img src="/images/${post.ascii_image_id}.png" alt="ASCII image" class="ASCII-image">
            <h3 class="title">${post.title}</h3>
            <section class="likes">
                <img src="/assets/images/icons/heart-empty.png" 
                     alt="like" 
                     class="icon like-icon">
                <p class="like-count">${post.likes}</p>
            </section>
            <p class="description">${post.content}</p>
            
            <section class="comments">
                <h4>Comments</h4>
                <ul class="comment-list"></ul>
                <form class="comment-form">
                    <input type="hidden" name="postId" value="${post.id}">
                    <input type="text" name="comment" class="comment-input" placeholder="Add a comment..." required />
                    <input type="submit" class="comment-btn" value="Comment"></input>
                </form>
            </section>
        `;

    const commentList = postElement.querySelector(".comment-list");
    console.log(commentList);
    comments.then(comment => comment.forEach(comment => {
        const commentItem = document.createElement("li");
        commentItem.innerHTML = `Anonymous: ${comment.content}`;
        commentList.appendChild(commentItem);
    }));

    const likeIcon = postElement.querySelector(".like-icon");
    likeIcon.addEventListener("click", function () {
        console.log("KUR")
        if (likeIcon.src.includes("heart-empty.png")) {
            likeIcon.src = "/assets/images/icons/heart-full.png";
            like(post.id, false);
            post.likes++;
        } else {
            likeIcon.src = "/assets/images/icons/heart-empty.png";
            like(post.id, true);
            post.likes--;
        }
        postElement.querySelector(".like-count").textContent = post.likes;
    });

    const commentForm = postElement.querySelector(".comment-form");
    console.log(commentForm);

    commentForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        const commentInput = commentForm.querySelector(".comment-input");
        const commentText = commentInput.value.trim();

        if (commentText === "") return;

        const formData = new FormData();
        formData.append('post_id', post.id);
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
                const newComment = document.createElement("li");
                newComment.innerHTML = `You: ${commentText}`;
                commentList.appendChild(newComment);

                commentInput.value = "";
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    return postElement;
}

function generatePosts(posts) {
    const postsContainer = document.querySelectorAll(".posts-container")[0];
    for (const post of posts) {
        const comments = getComments(post.id);
        console.log(comments);
        const postElement = generatePost(post, comments);
        postsContainer.appendChild(postElement);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    const postCreationForm = document.getElementById('post-creation-form');
    if (!postCreationForm) {
        return;
    }
    postCreationForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        let formData = new FormData(this);
        formData.append('ascii_image_id', 1);


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
    });
});

