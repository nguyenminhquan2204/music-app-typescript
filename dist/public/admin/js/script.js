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

// Form Change Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if(formChangeMulti){
    formChangeMulti.addEventListener("submit", (event) => {
        event.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]");
        const inputsChecked = checkboxMulti.querySelectorAll("input[name='id']:checked");
        
        const typeChange = event.target.elements.type.value;

        if(typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này?");

            if(!isConfirm) {
                return;
            }
        }

        if(inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            
            inputsChecked.forEach(input => {
                const id = input.value;

                if(typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }
            });

            // console.log(ids.join(", "));
            inputIds.value = ids.join(", ");

            formChangeMulti.submit();

        } else {
            alert("Vui lòng chọn một bản ghi!");
        }
    });
}
// End Form Change Multi

// Show Alert
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

// Sort
const sort = document.querySelector("[sort]");
if(sort) {
    let url = new URL(window.location.href);

    const sortSelect = sort.querySelector("[sort-select]");
    const sortClear = sort.querySelector("[sort-clear]");

    // Sắp xếp
    sortSelect.addEventListener("change", (e) => {
        // console.log(e);
        // console.log(e.target.value);
        const value = e.target.value;
        const [sortKey, sortValue] = value.split("-");
        // console.log(sortKey);
        // console.log(sortValue);

        url.searchParams.set("sortKey", sortKey);
        url.searchParams.set("sortValue", sortValue);

        window.location.href = url.href;
    });

    // Xóa sắp xếp
    sortClear.addEventListener("click", () => {
        url.searchParams.delete("sortKey");
        url.searchParams.delete("sortValue");

        window.location.href = url.href;
    });

    // Thêm selected cho option
    const sortKey = url.searchParams.get("sortKey");
    const sortValue = url.searchParams.get("sortValue");

    if(sortKey && sortValue) {
        const stringSort = `${sortKey}-${sortValue}`;
        const optionSelect = sortSelect.querySelector(`option[value="${stringSort}"]`);
        optionSelect.selected = true;
        // optionSelect.setAttribute("selected") = true;
    }
}
// End Sort

// Form Search
const formSearch = document.querySelector("#form-search");
if(formSearch) {
    let url = new URL(window.location.href);

    formSearch.addEventListener("submit", (event) => {
        event.preventDefault();  // Ngan chan cac su kien mac dinh
        // console.log(event.target.elements.keyword.value);
        const keyword = event.target.elements.keyword.value;

        if(keyword) {
            url.searchParams.set("keyword", keyword);
        } else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href;
        
    });
}
// End Search

// Button Status
const buttonStatus = document.querySelectorAll("[button-status]");
if(buttonStatus.length > 0) {
    buttonStatus.forEach(button => {

        let url = new URL(window.location.href);

        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if(status) {
                url.searchParams.set("status", status);
            } else {
                url.searchParams.delete("status");
            }

            window.location.href = url.href;
        });
    });
}
// End Button Status

// Pagination
const buttonsPagination = document.querySelectorAll("[button-pagination]");
if(buttonsPagination) {
    let url = new URL(window.location.href);

    buttonsPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination");

            url.searchParams.set("page", page);
            
            window.location.href = url.href;
        });
    });
}
// End Pagination


// Checkbox Multi
const checkboxMulti = document.querySelector("[checkbox-multi]");
if(checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputIds = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if(inputCheckAll.checked) {
            inputIds.forEach(input => {
                input.checked = true;
            });
        } else {
            inputIds.forEach(input => {
                input.checked = false;
            });
        }
    });

    inputIds.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

            if(countChecked == inputIds.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });
}
// End Checkbox Multi