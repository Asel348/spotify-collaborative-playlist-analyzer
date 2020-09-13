require('dotenv').config();
const axios = require('axios');
const express = require('express');
const app = express();

let TOKEN;
let tracks = [];
let users = [];
let results = [];

app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));

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

  function displayResults(r) {
    res.render('result.ejs', {
      result: r
    })
    results = [];
    tracks = [];
    users = [];
  }

  function get(nextUrl) {
    axios({ method: 'GET', url: nextUrl, headers: {'Authorization': `Bearer ${TOKEN}`, "Accept": "application/json", "Content-Type": "application/json"}})
    .then(res => {
      tracks.push(...res.data.items);
      console.log(tracks);
      for (i = 0; i < res.data.items.length; i++) {
        users.push(res.data.items[i].added_by.id);
      }
      if (res.data.next) {
        get(res.data.next);
      } else {

        function count() {
          users.sort();

          var current = null;
          var cnt = 0;
          for (var i = 0; i < users.length; i++) {
              if (users[i] != current) {
                  if (cnt > 0) {
                      results.push(current + ' added ' + cnt + ' tracks.')
                      console.log(current + ' added ' + cnt + ' tracks.');
                  }
                  current = users[i];
                  cnt = 1;
              } else {
                  cnt++;
              }
          }
          if (cnt > 0) {

              results.push(current + ' added ' + cnt + ' tracks.')
              console.log(current + ' added ' + cnt + ' tracks.');
          }
          displayResults(results);
        }

        count();
      }
    });
}
  
  get(`https://api.spotify.com/v1/playlists/${req.query.uri_input}/tracks?offset=0&limit=100`);

  // res.render('result.ejs', {
  //   result: TOKEN
  // })
})

app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port ' + process.env.PORT);
});