import { hostName } from "./config.js";

// const postsData = [
//     {
//         "id": 1,
//         "username": "John Doe",
//         "time": "12:30, 20/01/2025",
//         "image_id": "logo",
//         "title": "Beautiful Sunset",
//         "likes": 98,
//         "description": "Vestibulum auctor dapibus neque, eu efficitur lectus pharetra et.",
//         "comments": [
//             { "username": "Alice", "content": "Wow, amazing shot!" },
//             { "username": "Bob", "content": "Looks fantastic!" }
//         ]
//     }
// ];

const postsData = fetch(hostName + '/post', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json'}
})
.then(response => {
    // if (!response.ok) {
    //     alert(`Something went wrong! \n${response.status}`);
    //     throw new Error('Failed to submit comment');
    // }
    // generatePosts(response.json());
    // return null;
    console.log(response);
    return response.json();
})
.catch(error => {
    console.error('Error:', error);
});

export function generatePost(post)
{
    const postElement = document.createElement("section");
    postElement.classList.add("post");
    postElement.innerHTML = `
            <h3 class="username">${post.username}</h3>
            <time class="created-at">${post.time}</time>
            <img src="/public/assets/images/${post.image_id}.png" alt="ASCII image" class="ASCII-image">
            <h3 class="title">${post.title}</h3>
            <section class="likes">
                <img src="/public/assets/images/icons/heart-empty.png" 
                     alt="like" 
                     class="icon like-icon">
                <p class="like-count">${post.likes}</p>
            </section>
            <p class="description">${post.description}</p>
            
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
        post.comments.forEach(comment => {
            const commentItem = document.createElement("li");
            commentItem.innerHTML = `${comment.username}: ${comment.content}`;
            commentList.appendChild(commentItem);
        });

        const likeIcon = postElement.querySelector(".like-icon");
        likeIcon.addEventListener("click", function () {
            if (likeIcon.src.includes("heart-empty.png")) {
                likeIcon.src = "/public/assets/images/icons/heart-full.png";
                post.likes++;
            } else {
                likeIcon.src = "/public/assets/images/icons/heart-empty.png";
                post.likes--;
            }
            postElement.querySelector(".like-count").textContent = post.likes;
        });

        const commentForm = postElement.querySelector(".comment-form");

        commentForm.addEventListener("submit", function(event) {
            event.preventDefault();

            const commentInput = commentForm.querySelector(".comment-input");
            const commentText = commentInput.value.trim();

            if (commentText === "") return;

            const formData = new FormData();
            formData.append('post_id', post.id);
            formData.append('content', commentText);

            fetch(hostName + '/post/comment', {
                method: 'POST',
                body: formData,
                headers: { 'Content-Type': 'application/json'}
            })
            .then(response => {
                if (!response.ok) {
                    alert(`Something went wrong! \n${response.status}`);
                    throw new Error('Failed to submit comment');
                }
                return response.json();
            })
            .then(data => {
                console.log('Success:', data);
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
    console.log(posts);
    posts.forEach(post => {

        const postElement = generatePost(post);
        postsContainer.appendChild(postElement);
    });
}

document.addEventListener("DOMContentLoaded", function () { 
    // generatePosts(postsData);

    // const postCreationForm = document.getElementById('post-creation-form');
    //     if(!postCreationForm)
    //     {
    //         return;
    //     }
    //     postCreationForm.addEventListener('submit', function(event) {
    //     event.preventDefault(); 
    //     let formData = new FormData(this);
    
    //     fetch(hostName + '/post', { 
    //         method: 'POST',
    //         body: formData,
    //         headers: { 'Content-Type': 'application/json'}
    //     })
    //     .then(response => response.json())
    //     .then(data => {
    //         alert(`Post created successfully`);
    //         console.log('Success:', data);
    //     })
    //     .catch(error => {
    //         alert(`There has been an error! Try again!`);
    //         console.error('Error:', error);
    //     });
    // });
});

document.addEventListener("DOMContentLoaded", function () { 
    postsData.then(posts => {
        generatePosts(posts);
    }).catch(error => {
        console.error('Error fetching posts:', error);
        alert('Failed to load posts. Please try again later.');
    });

    const postCreationForm = document.getElementById('post-creation-form');
    if (!postCreationForm) {
        return;
    }
    postCreationForm.addEventListener('submit', function(event) {
        event.preventDefault(); 
        let formData = new FormData(this);
    
        fetch(hostName + '/post', { 
            method: 'POST',
            body: formData,
            headers: { 'Content-Type': 'application/json'}
        })
        .then(response => response.json())
        .then(data => {
            alert(`Post created successfully`);
            console.log('Success:', data);
        })
        .catch(error => {
            alert(`There has been an error! Try again!`);
            console.error('Error:', error);
        });
    });
});

