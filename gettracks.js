const axios = require('axios');

let tracks = [];
const ClientID = process.env.CLIENTID
const ClientSecret= process.env.CLIENTSECRET

//5efa8kbzoxkyxk1k8qevlkjj3
//8vsp8exfi60rbon6ao008im1t
//j5ciei4rcbpnzs70r0k9t2gfu
//asilefeakyol

axios.get('https://accounts.spotify.com/authorize?client_id=1dbaed12a128409b9e6398d58b7fbc93&response_type=code&redirect_uri=https%3A%2F%2Fexample.com%2Fcallback&scope=playlist-read-collaborative&state=34fFs29kd09')
  .then(res => {
    console.log(res);
  })

function get(nextUrl) {
  axios({ method: 'GET', url: nextUrl, headers: {'Authorization': 'Bearer BQCVKDt1yRnj0YFrahP37vVotRKPlxqRV3cHQlftkPXQslZhOtlVtwul9pnzqZ6zOvtQctARifTanKKERBEHV-zU2LxxksGaaHBr3nniebOAO2aQk32wQ47gjMnRtV1xj-DKcfCaEY1hP3WVmbOt5CTmx7LffBqXvA', "Accept": "application/json", "Content-Type": "application/json"}})
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