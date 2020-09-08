require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();

let TOKEN;
let tracks = [];

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.render('index.ejs')
});

app.get('/callback', (req, res) => {
  res.render('callback.ejs')
  axios({ method: 'POST', url: 'https://accounts.spotify.com/api/token', data: `grant_type=authorization_code&code=${req.query.code}&redirect_uri=http://localhost:3000/callback&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}` })
    .then(res => {
      console.log(res);
      TOKEN = res.data.access_token
    })
});

app.get('/result', (req, res) => {

  function get(nextUrl) {
    axios({ method: 'GET', url: nextUrl, headers: {'Authorization': `Bearer ${TOKEN}`, "Accept": "application/json", "Content-Type": "application/json"}})
      .then(res => {
        tracks.push(...res.data.items);
        console.log('Fetching...');
        if (res.data.next) {
          get(res.data.next);
        } else {
          let user1 = tracks.filter(user => user.added_by.id === "5efa8kbzoxkyxk1k8qevlkjj3");
          console.log('5efa8kbzoxkyxk1k8qevlkjj3 has ' + user1.length + ' songs in this playlist.');
          let user2 = tracks.filter(user => user.added_by.id === "8vsp8exfi60rbon6ao008im1t");
          console.log('8vsp8exfi60rbon6ao008im1t has ' + user2.length + ' songs in this playlist.');
          let user3 = tracks.filter(user => user.added_by.id === "j5ciei4rcbpnzs70r0k9t2gfu");
          console.log('j5ciei4rcbpnzs70r0k9t2gfu has ' + user3.length + ' songs in this playlist.');
          let user4 = tracks.filter(user => user.added_by.id === "asilefeakyol");
          console.log('asilefeakyol has ' + user4.length + ' songs in this playlist.');
        }
      });
  }
  
  get(`https://api.spotify.com/v1/playlists/${req.query.uri_input}/tracks?offset=0&limit=100`);

  res.render('result.ejs', {
    result: TOKEN
  })
})

app.listen(3000);