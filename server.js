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
  res.render('index.ejs', {
    redirectURI: process.env.REDIRECTURI
  })
});

app.get('/callback', (req, res) => {
  axios({ method: 'POST', url: 'https://accounts.spotify.com/api/token', data: `grant_type=authorization_code&code=${req.query.code}&redirect_uri=${process.env.REDIRECTURI}&client_id=${process.env.CLIENTID}&client_secret=${process.env.CLIENTSECRET}` })
    .then(r => {
      // console.log(r);
      TOKEN = r.data.access_token
      res.render('callback.ejs')
    }).catch(e => {
      res.render('error.ejs', {
        errorCode: e.response.status,
        errorText: e.response.statusText
      })
      console.error(e.stack)
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

  function getDisplayName(uri) {
    return axios({ method: 'GET', url: `https://api.spotify.com/v1/users/${uri}`, headers: {'Authorization': `Bearer ${TOKEN}`, "Accept": "application/json", "Content-Type": "application/json"} })
      .then(res => {
        return res.data.display_name;
      });

    // await axios({ method: 'GET', url: `https://api.spotify.com/v1/users/${uri}`, headers: {'Authorization': `Bearer ${TOKEN}`, "Accept": "application/json", "Content-Type": "application/json"} })
    //   .then(async res => {
    //     console.log(res.data);
    //     return displayName = await res.data.display_name;
    //   });
  }

  function get(nextUrl) {
    axios({ method: 'GET', url: nextUrl, headers: {'Authorization': `Bearer ${TOKEN}`, "Accept": "application/json", "Content-Type": "application/json"}})
    .then(res => {
      tracks.push(...res.data.items);
      // console.log(tracks);
      for (i = 0; i < res.data.items.length; i++) {
        users.push(res.data.items[i].added_by.id);
      }
      if (res.data.next) {
        get(res.data.next);
      } else {

        async function count() {
          users.sort();

          var current = null;
          var cnt = 0;
          for (var i = 0; i < users.length; i++) {
              if (users[i] != current) {
                  if (cnt > 0) {
                      results.push(await getDisplayName(current) + ' added ' + cnt + ' tracks.')
                      // console.log(current + ' added ' + cnt + ' tracks.');
                  }
                  current = users[i];
                  cnt = 1;
              } else {
                  cnt++;
              }
          }
          if (cnt > 0) {

              results.push(await getDisplayName(current) + ' added ' + cnt + ' tracks.')
              // console.log(current + ' added ' + cnt + ' tracks.');
          }
          displayResults(results);
        }

        count();
      }
    }).catch(e => {
      res.render('error.ejs', {
        errorCode: e.response.status,
        errorText: e.response.statusText
      })
      console.error(e.stack)
    });
  }
  
  let url = req.query.uri_input;

  let uri = url.split("/").pop().split("?").splice(0, 1);

  get(`https://api.spotify.com/v1/playlists/${uri}/tracks?offset=0&limit=100`);

  // res.render('result.ejs', {
  //   result: TOKEN
  // })
})

app.listen(process.env.PORT || 3000, function() {
  console.log('App listening on port ' + process.env.PORT);
});