import { hostName } from "./config.js";

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById('registration');
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        let formData = new FormData(registerForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        const response = await fetch(hostName + '/register', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {'Content-Type': 'application/json'},
        });

        if (!response.ok) {
            alert(`Something went wrong! \n${response.message}`);
            throw new Error('Failed to submit comment');
        }

        alert(`Registration successful.`);
    });
    const loginForm = document.getElementById('login');
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        let formData = new FormData(this);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
        const response = await fetch(hostName + '/login', {
            method: 'POST',
            body: JSON.stringify(jsonData),
            headers: {'Content-Type': 'application/json'},
        });

        if (!response.ok) {
            alert(`Something went wrong! \n${response.message}`);
            throw new Error('Failed to submit comment');
        }
    });
});