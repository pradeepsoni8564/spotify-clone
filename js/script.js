console.log("Lets write javascript");

let currentSong = new Audio;
let songs;
let currfolder;


function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
      return "00:00";
  }
  
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

async function getSongs(folder) {
  currfolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }


  
    //  show all the songs in tne playlist
    let songUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    songUl.innerHTML = " "
  for (const song of songs) {
      songUl.innerHTML =
      songUl.innerHTML + `<li>
              <img class="invert" src="img/music.svg" alt="music">
              <div class="info">
                <div> ${song.replaceAll("%20", " ")}</div>
                <div>Artist</div>
              </div>
              
              <div class="playnow">
                <span>Play now</span>
                <img class="invert" src="img/play.svg" alt="">
              </div>  </li>`;
  }
  // Attach an event listener to each song
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=> {
    e.addEventListener("click",element=>{
      playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  
  });
  
  return songs;
}

const playmusic = (track,pause = false) =>{
  currentSong.src =`/${currfolder}/` + track
  if(!pause){
    currentSong.play()
    play.src = "img/pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00"

}

async function displayAlbum() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response; 
  let anchors = div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".second")
  let array = Array.from(anchors)
    for (let index = 0; index < array.length; index++) {
      const e = array[index];

    if((e.href.includes("/songs")) && !e.href.includes(".htaccess")){
      let folder = e.href.split("/").slice(-2)[0]
      // Get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`)
      let response = await a.json();
      console.log(response)
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card fst">
              <div  class="play">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="50" height="50">
                  <!-- Green Circle Background -->
                  <circle cx="25" cy="25" r="24" fill="#1ed760" />
                  <!-- Original SVG Icon Centered with Black Color -->
                  <g transform="translate(13, 13)"> <!-- Adjust to center the icon -->
                    <path d="m7.05 3.606 13.49 7.788a.7.7 0 0 1 0 1.212L7.05 20.394A.7.7 0 0 1 6 19.788V4.212a.7.7 0 0 1 1.05-.606z" fill="black" />
                  </g>
                </svg>
              </div>
                 <img src="/songs/${folder}/cover.jpg" alt="">
                 <h2>${response.title}</h2>
                 <p>
                 ${response.description}
              </p>
            </div>`
      
    }
  }
  // load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click",async item=>{
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
    playmusic(songs[0])
  })
}) 
}

async function main() {

  // get this list of all the songs 
  await getSongs("songs/ncs");
  playmusic(songs[0],true);
 
  // display all the album on the page 
  displayAlbum()

  // Attach an event listener to play , next and previous 
  play.addEventListener("click", ()=>{
    if(currentSong.paused){
      currentSong.play()
      play.src = "img/pause.svg"
    }
    else{
      currentSong.pause()
      play.src = "img/play.svg"
    }
  }) 

  //  listen for timeupdate event 
  currentSong.addEventListener("timeupdate",()=>{
  document.querySelector(".songtime").innerHTML =`${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
  document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration)*100 + "%"
  })

  // Automatically play next song when the current one ends
currentSong.addEventListener("ended", () => {
  let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
  if (index + 1 < songs.length) {
    playmusic(songs[index + 1]);
  } else {
    playmusic(songs[0]); // Loop back to the first song if at the end
  }
});


  // add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click",e=>{
    let percent =  (e.offsetX/e.target.getBoundingClientRect().width)*100
    document.querySelector(".circle").style.left =percent + "%"
    currentSong.currentTime = (currentSong.duration)*percent/100
  })

  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0"
  })

  document.querySelector(".close img").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-100%"
  })

  // add an event listener to previous and next
  previous.addEventListener("click", ()=>{
    
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index-1) >= 0){
      playmusic(songs[index-1])
    }
  })
  
  next.addEventListener("click", ()=>{
    
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if((index+1) < songs.length){
      playmusic(songs[index+1])
    }
    else if(index+1) {
      playmusic(songs[0])
    }
  })

  // add an event listener to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
  console.log("Setting volume to", e.target,e.target.value , "/100"); 
  currentSong.volume = parseInt(e.target.value)/100
  vol.src = "img/volume.svg"
});

  document.querySelector(".volume>img").addEventListener("click", (e) => {

    if(e.target.src.includes("img/volume.svg")){
      e.target.src = e.target.src.replace("img/volume.svg","img/mute.svg")
      currentSong.volume = 0
      document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
    }
    else{
      e.target.src = e.target.src.replace("img/mute.svg","img/volume.svg")
      currentSong.volume = .5
      document.querySelector(".range").getElementsByTagName("input")[0].value = 50
    }

});

  
}


main();
