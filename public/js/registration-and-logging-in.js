import { hostName } from "../src/js/config.js";
import { isUserLoggedIn, redirectToDrawpage } from "../src/js/user_details.js";

if (isUserLoggedIn()) {
    redirectToDrawpage();
}

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById('registration');
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault();
        let formData = new FormData(registerForm);
        const jsonData = {};
        formData.forEach((value, key) => {
            jsonData[key] = value;
        });
    
        try {
            const response = await fetch(hostName + '/register', {
                method: 'POST',
                body: JSON.stringify(jsonData),
                headers: {'Content-Type': 'application/json'},
            });
    
            const responseData = await response.json();
    
            if (!response.ok) {
                if (responseData.errors) {
                    let errorMessage = '';
                    for (const [key, value] of Object.entries(responseData.errors)) {
                        errorMessage += `${key}: ${value.join(', ')}\n`;
                    }
                    alert(`Registration failed:\n${errorMessage}`);
                } else {
                    alert(`Something went wrong! \n${response.statusText}`);
                }
                throw new Error('Failed to submit registration');
            }
    
            alert(`Registration successful.`);
            redirectToDrawpage();
        } catch (error) {
            console.error('Error:', error);
        }
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

        alert(`Login successful.`);
        redirectToDrawpage();
    });
});