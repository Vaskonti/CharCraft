import { hostName } from "./config.js";

function doesHttpOnlyCookieExist(cookiename) {
    var d = new Date();
    d.setTime(d.getTime() + (1000));
    var expires = "expires=" + d.toUTCString();

    document.cookie = cookiename + "=new_value;path=/;" + expires;
    return document.cookie.indexOf(cookiename + '=') == -1;
}

function isAuthCookieSet() {
    return doesHttpOnlyCookieExist("auth_token");
}

export function isUserLoggedIn() {
    return isAuthCookieSet();
}

export function redirectToFeed() {
    window.location.href = "feed.html";
}

export function redirectToRegistration() {
    window.location.href = "register-and-login.html";
}

// throws Errors
async function fetchUserUsername() {
    const response = await fetch(hostName + '/username', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred');
    }

    const data = await response.json();
    return data.username;
}

export function getUserUsername() {
    return fetchUserUsername().then(username => {
        return username;
    }).catch(error => {
        console.error('Error:', error.message);
        return "";
    });
}

export function logout(){
    const logOut = document.getElementById('log-out');
  logOut.addEventListener("click", (event) => {
    event.preventDefault();
    if(confirm("Are you sure you want log out?")) {
      fetch(hostName + '/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'}
      })
      .then(response => {
        if (!response.ok) {
            alert(`Something went wrong! \n${response.status}`);
            throw new Error('Failed to logout!');
        }
        redirectToRegistration();
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
  });
}