document.addEventListener("DOMContentLoaded", function () { 
    const postsContainer = document.getElementById("posts-container");
    const postsData = [
        {
            "id": 1,
            "user": "John Doe",
            "time": "12:30, 20/01/2025",
            "image": "/public/assets/images/logo.png",
            "title": "Beautiful Sunset",
            "likes": 98,
            "description": "Vestibulum auctor dapibus neque, eu efficitur lectus pharetra et.",
            "comments": [
                { "user": "Alice", "text": "Wow, amazing shot!" },
                { "user": "Bob", "text": "Looks fantastic!" }
            ]
        }
    ];

    function generatePosts(posts) {
        posts.forEach(post => {
            const postElement = document.createElement("section");
            postElement.classList.add("post");

            postElement.innerHTML = `
                <h3 class="user">${post.user}</h3>
                <time class="created-at">${post.time}</time>
                <img src="${post.image}" alt="ASCII image" class="ASCII-image">
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
                        <input type="submit" class="comment-btn" value="Post"></input>
                    </form>
                </section>
            `;

            const commentList = postElement.querySelector(".comment-list");
            post.comments.forEach(comment => {
                const commentItem = document.createElement("li");
                commentItem.innerHTML = `${comment.user}: ${comment.text}`;
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

                fetch('https://example.com/api/submit', {  // Replace with actual API endpoint
                    method: 'POST',
                    body: formData,
                    headers: { 'Content-Type': 'application/json'}
                })
                .then(response => {
                    if (!response.ok) {
                        //TODO: Pop-up 
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

            postsContainer.appendChild(postElement);
        });
    }

    generatePosts(postsData);
});



document.getElementById('post-creation-form').addEventListener('submit', function(event) {
    event.preventDefault(); 
    let formData = new FormData(this);

    fetch('https://example.com/api/submit', { // Replace with your endpoint
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});