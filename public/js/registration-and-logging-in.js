// import { hostName } from "./config.js";
document.getElementById('registration').addEventListener('submit', function(event) {
    event.preventDefault(); 
    let formData = new FormData(this);
    console.log(formData);
    fetch("http://localhost:8000" + '/register', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'application/json'},
    })
    .then(response => {console.log(response); response.json()})
    .then(data => {
        alert(`Registration successful.`);
        console.log('Success:', data);
    })
    .catch(error => {
        alert(`Something went wrong! \n${error.message}`);
        console.error('Error:', error);
    });
});

document.getElementById('logging-in').addEventListener('submit', function(event) {
    event.preventDefault(); 
    let formData = new FormData(this);

    fetch("http://localhost:8000" + '/login', {
        method: 'POST',
        body: formData,
        headers: { 'Content-Type': 'application/json'},
    })
    .then(response => {console.log(response); response.json()//})
    // .then(data => {
        if (!response.ok) {
            alert(`Something went wrong! \n${response.status}`);
            throw new Error('Failed to submit comment');
        }
        else
        {
            alert(`Login successful.`);
            window.location.assign("../feed.html");
            console.log('Success:');
        }
        
    })
    .catch(error => {
        alert(`There has been an error!`);
        console.error('Error:', error);
    });
});