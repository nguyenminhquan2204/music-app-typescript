// Aplayer
const aplayer = document.querySelector("#aplayer");
if(aplayer) {
    let dataSong = aplayer.getAttribute("data-song");
    dataSong = JSON.parse(dataSong);

    let dataSinger = aplayer.getAttribute("data-singer");
    dataSinger = JSON.parse(dataSinger);

    const ap = new APlayer({
        container: aplayer,
        lrcType: 1,
        audio: [
            {
                name: dataSong.title,
                artist: dataSinger.fullName,
                url: dataSong.audio,
                cover: dataSong.avatar,
                // lrc: `
                //     [00:02.00] Lời bài hát giây thứ 2
                //     [00:04.00] Lời bài hát giây thứ 4
                //     [00:06.00] Lời bài hát giây thứ 6
                // `
                lrc: dataSong.lyrics
            },
        ],
        autoplay: true,
        volume: 0.8
    });

    const avatar = document.querySelector(".singer-detail .inner-avatar");

    ap.on("play", () => {
        avatar.style.animationPlayState = "running"; 
    });

    ap.on("pause", () => {
        avatar.style.animationPlayState = "paused"; 
    });
    
    ap.on("ended", () => {
        // avatar.style.animationPlayState = "paused"; 
        // console.log("Kết thúc bài hát.");

        const link = `/songs/listen/${dataSong._id}`;

        const option = {
            method: "PATCH"
        };

        fetch(link, option)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                const elementListenSpan = document.querySelector(".singer-detail .inner-listen span");
                elementListenSpan.innerHTML = `${data.listen} lượt nghe`;
            })
    });
}
// End Aplayer

// Button Like
const buttonLike = document.querySelector("[button-like]");
if(buttonLike) {
    buttonLike.addEventListener("click", () => {
        const idSong = buttonLike.getAttribute("button-like");
        const isActive = buttonLike.classList.contains("active");

        const typeLike = isActive ? "dislike" : "like";

        const link = `/songs/like/${typeLike}/${idSong}`;

        const option = {
            method: "PATCH"
        }

        fetch(link, option)
            .then(res => res.json())
            .then(data => {
                if(data.code == 200) {
                    const span = buttonLike.querySelector("span");
                    span.innerHTML = `${data.like} thích`;
                    // console.log(data);

                    buttonLike.classList.toggle("active");
                }
            })
    });
}
// End Button Like

// Button Favorite
const listButtonFavorite = document.querySelectorAll("[button-favorite]");
if(listButtonFavorite.length > 0) {
    listButtonFavorite.forEach((buttonFavorite) => {
        buttonFavorite.addEventListener("click", () => {
            const idSong = buttonFavorite.getAttribute("button-favorite");
            const isActive = buttonFavorite.classList.contains("active");
    
            const typeFavorite = isActive ? "unfavorite" : "favorite";
    
            const link = `/songs/favorite/${typeFavorite}/${idSong}`;
    
            const option = {
                method: "PATCH"
            }
    
            fetch(link, option)
                .then(res => res.json())
                .then(data => {
                    if(data.code == 200) {
                        buttonFavorite.classList.toggle("active");
                    }
                })
        });
    });
}
// End Button Favorite

// Search Suggest
const boxSearch = document.querySelector(".box-search");
if(boxSearch) {
    const input = boxSearch.querySelector("input[name='keyword']");
    const boxSuggest = boxSearch.querySelector(".inner-suggest");

    input.addEventListener("keyup", () => {
        const keyword = input.value;

        const link = `/search/suggest?keyword=${keyword}`;

        fetch(link)
            .then(res => res.json())
            .then(data => {
                // console.log(data);
                const songs = data.songs;
                if(songs.length > 0) {
                    boxSuggest.classList.add("show");
                    console.log("Quan");
                    // console.log(boxSuggest);

                    const htmls = songs.map(song => {

                        return `
                            <a class="inner-item" href="/songs/detail/${song.slug}">
                                <div class="inner-image"> <img src=${song.avatar} /> </div>
                                <div class="inner-info">
                                    <div class="inner-title"> ${song.title} </div>
                                    <div class="inner-singer"> <i class="fa-solid fa-microphone-lines"></i> ${song.infoSinger.fullName} </div>
                                </div>
                            </a>   
                        `;
                    });
                    
                    const boxList = boxSuggest.querySelector(".inner-list");
                    boxList.innerHTML = htmls.join("");
                } else {
                    boxSuggest.classList.remove("show");
                }
            })
    });
}
// End Search Suggest

// Show alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    const closeAlert = showAlert.querySelector("[close-alert]");

    setTimeout(() => {
        showAlert.classList.add("alert-hidden");
    }, time);

    closeAlert.addEventListener("click", () => {
        showAlert.classList.add("alert-hidden");
    });
}
// End Show Alert

// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
    const uploadImageInput = document.querySelector("[upload-image-input]");
    const uploadImagePreview = document.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", (e) => {
        const file = e.target.files[0];
        
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End upload Image