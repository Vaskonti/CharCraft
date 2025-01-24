document.getElementById('registration').addEventListener('submit', function(event) {
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

document.getElementById('logging-in').addEventListener('submit', function(event) {
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