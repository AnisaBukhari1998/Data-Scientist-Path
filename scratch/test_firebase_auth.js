const apiKey = "AIzaSyCT0YG1Cuup0ZSE59C_bTxOAfuwPuXYCRA";
const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;

fetch(url, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'testuser_agy_' + Math.floor(Math.random() * 100000) + '@example.com',
    password: 'testpassword123',
    returnSecureToken: true
  })
}).then(res => res.json())
  .then(json => console.log("Firebase Auth signup response:", json))
  .catch(err => console.error("Firebase Auth signup failed:", err));
