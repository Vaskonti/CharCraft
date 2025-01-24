document.addEventListener("DOMContentLoaded", function () {
    const postsContainer = document.getElementById("posts-container");
    const postsData = [
        {
            "user": "John Doe",
            "time": "12:30, 20/01/2025",
            "image": "/public/assets/images/logo.png",
            "title": "Beautiful Sunset",
            "likes": 98,
            "description": "Vestibulum auctor dapibus neque, eu efficitur lectus pharetra et."
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
                    <p>${post.likes}</p>
                </section>
                <p class="description">${post.description}</p>`
            ;

            const likeIcon = postElement.querySelector(".like-icon");
            likeIcon.addEventListener("click", function () {
                if (likeIcon.src.includes("heart-empty.png")) {
                    likeIcon.src = "/public/assets/images/icons/heart-full.png";
                } else {
                    likeIcon.src = "/public/assets/images/icons/heart-empty.png";
                }
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