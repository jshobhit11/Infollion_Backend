document.getElementById('weather-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const city = document.getElementById('city').value;
    const authToken = 'your-custom-auth-token'; // The same token you have in the backend's .env file
    const apiUrl = `http://localhost:3000/api/proxy?city=${city}`;

    try {
        const response = await fetch(apiUrl, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });

        if (response.status === 401) {
            Toastify({
                text: "Unauthorized: Invalid token",
                backgroundColor: "#ff0000",
                duration: 3000,
                gravity: "top",
                position: "right"
            }).showToast();
            return;
        }

        if (response.status === 429) {
            Toastify({
                text: "Too many requests: Please try again later",
                backgroundColor: "#ffcc00",
                duration: 3000,
                gravity: "top",
                position: "right"
            }).showToast();
            return;
        }

        const data = await response.json();

        if (response.status === 500) {
            Toastify({
                text: data.message,
                backgroundColor: "#ff0000",
                duration: 3000,
                gravity: "top",
                position: "right"
            }).showToast();
            return;
        }

        document.getElementById('city-name').textContent = city;
        document.getElementById('temperature').textContent = `Temperature: ${data.main.temp/10}°C`;
        document.getElementById('description').textContent = `Description: ${data.weather[0].description}`;
        document.getElementById('weather-result').classList.remove('hidden');

        Toastify({
            text: "Weather data fetched successfully!",
            backgroundColor: "#00cc66",
            duration: 3000,
            gravity: "top",
            position: "right"
        }).showToast();

    } catch (error) {
        Toastify({
            text: "Error: Unable to fetch data",
            backgroundColor: "#ff0000",
            duration: 3000,
            gravity: "top",
            position: "right"
        }).showToast();
    }
});
