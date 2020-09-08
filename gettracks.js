const axios = require('axios');

let tracks = [];
let users = [];
const ClientID = process.env.CLIENTID
const ClientSecret = process.env.CLIENTSECRET
const TOKEN = "BQDkhp-qV9_Mh4W_i-fvkXPxcfmA7D9YciS3yzkR2GqfBbY1rAcYvmbuHKKYmtOWFsuYfb0qJbfZJHVLvZ3hQ_4nLMeDFOO-qsBBepyHg87NKrkIzyFPCMmH414j1-mL-ZdY3ltE-5f6wAP4FWGNBPn8lje3Ko-Kvg"

//5efa8kbzoxkyxk1k8qevlkjj3
//8vsp8exfi60rbon6ao008im1t
//j5ciei4rcbpnzs70r0k9t2gfu
//asilefeakyol

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
                      console.log(current + ' comes --> ' + cnt + ' times');
                  }
                  current = users[i];
                  cnt = 1;
              } else {
                  cnt++;
              }
          }
          if (cnt > 0) {
              console.log(current + ' comes --> ' + cnt + ' times');
          }
        }

        count();

        // let user1 = tracks.filter(user => user.added_by.id === "5efa8kbzoxkyxk1k8qevlkjj3");
        // console.log('5efa8kbzoxkyxk1k8qevlkjj3 has ' + user1.length + ' songs in this playlist.');
        // let user2 = tracks.filter(user => user.added_by.id === "8vsp8exfi60rbon6ao008im1t");
        // console.log('8vsp8exfi60rbon6ao008im1t has ' + user2.length + ' songs in this playlist.');
        // let user3 = tracks.filter(user => user.added_by.id === "j5ciei4rcbpnzs70r0k9t2gfu");
        // console.log('j5ciei4rcbpnzs70r0k9t2gfu has ' + user3.length + ' songs in this playlist.');
        // let user4 = tracks.filter(user => user.added_by.id === "asilefeakyol");
        // console.log('asilefeakyol has ' + user4.length + ' songs in this playlist.');
      }
    });
}

get('https://api.spotify.com/v1/playlists/303PJ0NAhTgEsVIkNHnjxr/tracks?offset=0&limit=100');