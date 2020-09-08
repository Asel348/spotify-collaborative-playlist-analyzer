const axios = require('axios');

let tracks = [];

//5efa8kbzoxkyxk1k8qevlkjj3
//8vsp8exfi60rbon6ao008im1t
//j5ciei4rcbpnzs70r0k9t2gfu
//asilefeakyol

function get(nextUrl) {
  axios({ method: 'GET', url: nextUrl, headers: {'Authorization': 'Bearer BQCpODHY2ww3dl9Vn_vlR_7zxAEEpoI_IUpMGzbBff_W3gdMf6Sc4C6I9MoWe3lDRWaUcN5LMA-GJ9HqziGXaRTUY8M15WNA_LmkPkQmQaBXXQyTQHDrW9Tp9bMzrvY9qMlbNGsqjHcbQexCOMBglyV6EycXp4zIAA', "Accept": "application/json", "Content-Type": "application/json"}})
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

get('https://api.spotify.com/v1/playlists/303PJ0NAhTgEsVIkNHnjxr/tracks?offset=0&limit=100');