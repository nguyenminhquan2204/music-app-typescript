// Upload Image
const uploadImage = document.querySelector("[upload-image]");
if(uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

    uploadImageInput.addEventListener("change", (e) => {
        console.log(e);
        const file = e.target.files[0];
        
        if(file) {
            uploadImagePreview.src = URL.createObjectURL(file);
        }
    });
}
// End Upload Image

// Upload Audio
const uploadAudio = document.querySelector("[upload-audio]");
if(uploadAudio) {
    const uploadAudioInput = uploadAudio.querySelector("[upload-audio-input]");
    const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
    const source = uploadAudio.querySelector("source");

    uploadAudioInput.addEventListener("change", (e) => {
        // console.log(e);
        const file = e.target.files[0];
        
        if(file) {
            source.src = URL.createObjectURL(file);
            uploadAudioPlay.load();
        }
    });
}
// End Upload Audio