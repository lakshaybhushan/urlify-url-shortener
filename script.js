const apiKey = require('./config.js');

// Function to shorten the URL
function shortenUrl() {
    var longUrl = document.getElementById("longUrl").value;

    if (longUrl.trim() === "") {
        return;
    }

    // Make a POST request to the Bitly API
    fetch('https://api-ssl.bitly.com/v4/shorten', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${apiKey}'
        },
        body: JSON.stringify({
            long_url: longUrl
        })
    })
        .then(response => response.json())
        .then(data => {
            if (data.link) {
                // Display the shortened URL
                var shortUrlContainer = document.getElementById("shortUrlContainer");
                shortUrlContainer.innerHTML = '<a href="' + data.link + '" target="_blank">' + data.link + '</a>';
                shortUrlContainer.classList.remove("error");
                copyToClipboard(data.link);
                showNotification("Link copied to clipboard 📋");

                // Save the shortened URL to localStorage
                localStorage.setItem("shortUrl", data.link);
            } else {
                // Remove the undefined link from localStorage
                localStorage.removeItem("shortUrl");

                // Redirect to 404.html
                window.location.href = "/404/404.html";
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// Function to load the shortened URL from localStorage
function loadShortUrl() {
    var shortUrl = localStorage.getItem("shortUrl");
    if (shortUrl) {
        var shortUrlContainer = document.getElementById("shortUrlContainer");
        shortUrlContainer.innerHTML = '<a href="' + shortUrl + '" target="_blank">' + shortUrl + '</a>';
        copyToClipboard(shortUrl);
    }
}

// Function to copy the link to the clipboard
function copyToClipboard(link) {
    navigator.clipboard.writeText(link)
        .then(() => {
            console.log("Link copied to clipboard:", link);
        })
        .catch(error => {
            console.error("Error copying to clipboard:", error);
        });
}

// Function to show a notification
function showNotification(message) {
    var notification = document.getElementById("notification");
    notification.innerText = message;
    notification.classList.add("show");

    setTimeout(() => {
        notification.classList.remove("show");
    }, 2000); // Hide the notification after 2 seconds
}

// Load the shortened URL on page load
loadShortUrl();
