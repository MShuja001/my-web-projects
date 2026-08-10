console.log("Spotify Clone Loaded");

let songs = [];
let currfolder;

function convertTime(currentTime) {
    if (isNaN(currentTime) || currentTime === Infinity) {
        return "00:00";
    }
    return String(Math.floor(currentTime / 60)).padStart(2, '0') + ":" +
        String(Math.floor(currentTime % 60)).padStart(2, '0');
}

let CurrentSong = new Audio();

// Fetch the song list for a given folder using songs.json (no directory listing needed)
async function Getsongs(folder) {
    currfolder = folder;
    let response = await fetch(`Songs/${currfolder}/songs.json`);
    let data = await response.json();
    songs = data.songs;
    return songs;
}

function renderSongs() {
    let songul = document.querySelector(".songslist").getElementsByTagName("ul")[0];
    songul.innerHTML = "";

    for (const song of songs) {
        let displayName = decodeURIComponent(song).replace(".mp3", "");
        songul.innerHTML += `<li>
            <img src="/assets/music.svg" alt="Music">
            <div class="info">${displayName}</div>
            <img class="invert" src="/assets/play.svg" alt="">
        </li>`;
    }

    // Attach event listeners to each song in the list
    Array.from(document.querySelector(".songslist").getElementsByTagName("li")).forEach((e) => {
        e.addEventListener("click", () => {
            let trackName = e.querySelector(".info").innerHTML;
            playmusic(trackName);
        });
    });
}

const playmusic = (track, pause = false) => {
    // Encode the track name for use in the URL, but keep it decoded for display
    CurrentSong.src = `Songs/${currfolder}/${encodeURIComponent(track)}.mp3`;

    document.querySelector(".circle").style.left = "0%";
    document.querySelector(".progress").style.width = "0%";

    if (!pause) {
        CurrentSong.play();
        play.src = "/assets/pause.svg";
    } else {
        play.src = "/assets/playbtn.svg";
    }

    document.querySelector(".songinfo").innerHTML = track.replace(".mp3", "");
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

// Display all albums using albums.json (no directory listing needed)
async function displayAlbums() {
    let cardcontainer = document.querySelector(".cardContainer");

    let response = await fetch(`Songs/albums.json`);
    let data = await response.json();

    for (const folder of data.albums) {
        let infoRes = await fetch(`Songs/${folder}/info.json`);
        let info = await infoRes.json();

        cardcontainer.innerHTML += `<div class="card" data-folder="${folder}">
            <svg class="play-btn" width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                <circle cx="25" cy="25" r="25" fill="#1ED760"/>
                <polygon points="20,15 20,35 35,25" fill="black"/>
            </svg>
            <img src="Songs/${folder}/cover.jpg" alt="">
            <h3>${info.title}</h3>
            <p>${info.description}</p>
        </div>`;
    }

    // Attach event listeners to the cards
    Array.from(document.querySelectorAll(".card")).forEach((e) => {
        e.addEventListener("click", async (item) => {
            document.querySelector(".songslist ul").innerHTML = "";
            let folder = item.currentTarget.dataset.folder;
            songs = await Getsongs(folder);
            renderSongs();
            playmusic(songs[0].replace(".mp3", ""), true);
        });
    });
}

async function main() {
    // Load default playlist (ncs)
    songs = await Getsongs("ncs");
    renderSongs();
    playmusic(songs[0].replace(".mp3", ""), true);

    // Display all albums
    displayAlbums();

    // Play / Pause button
    play.addEventListener("click", () => {
        if (CurrentSong.paused) {
            CurrentSong.play();
        } else {
            CurrentSong.pause();
        }
    });

    CurrentSong.addEventListener("play", () => {
        play.src = "/assets/pause.svg";
    });

    CurrentSong.addEventListener("pause", () => {
        play.src = "/assets/playbtn.svg";
    });

    // Update seekbar and time display
    CurrentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML =
            convertTime(CurrentSong.currentTime) + " / " + convertTime(CurrentSong.duration);
        let pct = (CurrentSong.currentTime / CurrentSong.duration) * 100;
        document.querySelector(".circle").style.left = pct + "%";
        document.querySelector(".progress").style.width = pct + "%";
    });

    // Seek on click
    document.querySelector(".seekbar").addEventListener("click", (e) => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        CurrentSong.currentTime = (CurrentSong.duration * percent) / 100;
    });

    // Sidebar toggle
    document.querySelector(".hamburg").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    });
    document.querySelector(".libbtn").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    });

    // Previous button
    previous.addEventListener("click", () => {
        let currentFile = decodeURIComponent(CurrentSong.src.split("/").pop()).replace(".mp3", "");
        let index = songs.findIndex(s => s.replace(".mp3", "") === currentFile);
        CurrentSong.pause();
        if (index - 1 >= 0) {
            playmusic(songs[index - 1].replace(".mp3", ""));
        }
    });

    // Next button
    next.addEventListener("click", () => {
        let currentFile = decodeURIComponent(CurrentSong.src.split("/").pop()).replace(".mp3", "");
        let index = songs.findIndex(s => s.replace(".mp3", "") === currentFile);
        CurrentSong.pause();
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1].replace(".mp3", ""));
        }
    });

    // Auto-advance to next song when current ends
    CurrentSong.addEventListener("ended", () => {
        let currentFile = decodeURIComponent(CurrentSong.src.split("/").pop()).replace(".mp3", "");
        let index = songs.findIndex(s => s.replace(".mp3", "") === currentFile);
        if (index + 1 < songs.length) {
            playmusic(songs[index + 1].replace(".mp3", ""));
        }
    });

    // Volume control
    document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        CurrentSong.volume = parseInt(e.target.value) / 100;
        let img = document.querySelector(".volume").getElementsByTagName("img")[0];
        if (CurrentSong.volume === 0) {
            img.src = "/assets/volume-mute.svg";
        } else if (CurrentSong.volume <= 0.5) {
            img.src = "/assets/volume.svg";
        } else {
            img.src = "/assets/max-volume.svg";
        }
    });

    // Volume icon click — mute / unmute toggle
    document.querySelector(".volume img").addEventListener("click", () => {
        let input = document.querySelector(".volume").getElementsByTagName("input")[0];
        let img = document.querySelector(".volume").getElementsByTagName("img")[0];
        if (CurrentSong.volume === 0) {
            CurrentSong.volume = 1;
            input.value = 100;
            img.src = "/assets/max-volume.svg";
        } else {
            CurrentSong.volume = 0;
            input.value = 0;
            img.src = "/assets/volume-mute.svg";
        }
    });
}

main();
