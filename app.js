const apiKey = 'AIzaSyAvSQBek_khqKh5ZEYhWcqlF0taRg_Q1R4';
const clientId = '472252081207-mpmsv3vd6p2ej50cokl2a0jhiepla90t.apps.googleusercontent.com';
const spreadsheetId = '15s90AxqNSzv-K_639ffokf-6Zd5tSFdHeBPFZIyG7Jc'; // Your Spreadsheet ID
const playerID = "1001";  // Replace with dynamic player ID if necessary

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

async function loadMonsterCollection() {
    try {
        // Initialize Google API client
        await gapi.client.init({
            apiKey: apiKey,
            clientId: clientId,
            discoveryDocs: ["https://sheets.googleapis.com/$discovery/rest?version=v4"],
            scope: "https://www.googleapis.com/auth/spreadsheets.readonly"
        });

        // Load the spreadsheet data
        const response = await gapi.client.sheets.spreadsheets.values.get({
            spreadsheetId: spreadsheetId,
            range: 'MonsterInfo!A2:J', // Adjust the range as needed
        });

        const rows = response.result.values;
        const monsterCollectionDiv = document.getElementById("monsterCollection");

        if (rows.length > 0) {
            // Clear the loading message
            monsterCollectionDiv.innerHTML = '';

            rows.forEach(row => {
                const monsterCard = document.createElement("div");
                monsterCard.classList.add("monster-card");

                monsterCard.innerHTML = `
                    <h3>${row[3]}</h3>
                    <div class="placeholder">Monster AI generated appearance placeholder</div>
                    <div class="info-item">Monster ID:</div><div class="info-value">${row[0]}</div>
                    <div class="info-item">Level:</div><div class="info-value">${row[7]}</div>
                    <div class="info-item">HP:</div><div class="info-value">${row[4]}</div>
                    <div class="info-item">AP:</div><div class="info-value">${row[5]}</div>
                    <div class="info-item">Speed:</div><div class="info-value">${row[6]}</div>
                `;

                monsterCollectionDiv.appendChild(monsterCard);
            });
        } else {
            monsterCollectionDiv.innerHTML = "<p>No monsters in your collection yet.</p>";
        }
    } catch (error) {
        console.error("Error loading monster collection:", error);
        document.getElementById("monsterCollection").innerHTML = "<p>Error loading data.</p>";
    }
}

function loadPlayerInfo() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const user = parseJwt(userData);
        document.getElementById("playerName").textContent = user.name || "Player Name";
        document.getElementById("playerID").textContent = playerID;
    } else {
        console.log("No user data found in local storage");
    }
}

// Load Google API client library
gapi.load('client:auth2', () => {
    console.log("Google API client library loaded.");
    loadPlayerInfo();
    loadMonsterCollection();
});
