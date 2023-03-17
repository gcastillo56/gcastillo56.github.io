// smooth scroll
$(document).ready(function() {
    $(".navbar .nav-link").on("click", function(event) {
        if (this.hash !== "") {
            event.preventDefault();

            var hash = this.hash;

            $("html, body").animate({
                    scrollTop: $(hash).offset().top,
                },
                700,
                function() {
                    window.location.hash = hash;
                }
            );
        }
    });
    // Social networks buttons
    $("#facebook").on("click", function() {
        $(this).attr("href", "https://www.facebook.com/gcastillo56/");
        $(this).attr("target", "_blank");
    });
    $("#instagram").on("click", function() {
        $(this).attr("href", "https://www.instagram.com/adinabv");
        $(this).attr("target", "_blank");
    });
    $("#whatsapp").on("click", function() {
        /*$(this).attr("href", "http://wa.me/+523334407261");*/
        $(this).attr("href", "https://chat.whatsapp.com/C23xuv77zCQ2iBv2C2pmr4");
        $(this).attr("target", "_blank");
    });
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    modal.style.display = "none";
};

$(".gallery-item").click(function() {
    var img = $(this).find("img");

    modal.style.display = "block";
    $("#img01").prop("src", img.prop("src"));
    $("#modal_caption").html(img.prop("alt"));
});

function getKey(sectionId, detail_num) {
    key = "undefined";
    switch (sectionId) {
        case 1 /* Program details */ :
            key = "myZoom_" + detail_num;
            break;
    }
    return key;
}

/* Open when someone clicks on the span element */
function openMore(sectionId, detail_num) {
    document.getElementById(getKey(sectionId, detail_num)).style.width = "100%";
    const body = document.querySelector("body");
    body.style.overflow = "hidden";
}

/* Close when someone clicks on the "x" symbol inside the overlay */
function closeMore(sectionId, detail_num) {
    document.getElementById(getKey(sectionId, detail_num)).style.width = "0%";
    const body = document.querySelector("body");
    body.style.overflow = "auto";
}

function hideIt() {
    document.getElementById("hid").style.visibility = "hidden";
    const body = document.querySelector("body");
    body.style.overflow = "auto";
}

// Get the button:
let mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// upload image to github
// https://levelup.gitconnected.com/how-to-upload-images-to-github-via-javascript-59163b8fff27
function uploadImage(data) {
    return fetch(
        `https://api.github.com/repos/gcastillo56/gcastillo56.github.io/contents/assets/photos/${data.name}`, {
            method: "PUT",
            headers: {
                Accept: "application/vnd.github+json",
                Authorization: `Bearer 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`,
            },
            body: JSON.stringify({
                message: "upload image from api",
                content: data.content,
            }),
        }
    ).then((res) => res.json());
}

function insertImage(src) {
    const newImage = document.createElement("img");
    newImage.src = src;
    document.querySelector(".img").innerHTML = newImage.outerHTML;
}

function getRandomName(type) {
    if (type.endsWith("png")) {
        return [Date.now(), ".png"].join("");
    }
    return [Date.now(), ".jpeg"].join("");
}

function blobToBase64(blob) {
    return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            const srcData = fileReader.result;
            resolve(srcData);
        };
        fileReader.readAsDataURL(blob);
    });
}

function handleImageChange(callback) {
    const $file = document.querySelector(".local");
    $file.addEventListener("change", (event) => {
        const selectedfile = event.target.files;
        if (selectedfile.length > 0) {
            const [imageFile] = selectedfile;
            blobToBase64(imageFile).then((srcData) => {
                insertImage(srcData);
                callback &&
                    callback({
                        content: srcData,
                        name: imageFile.name,
                        type: imageFile.type,
                    });
            });
        }
    });
}

window.onload = () => {
    const $form = document.querySelector(".form");
    let image = null;
    $form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!image) {
            alert("Image is empty, please select or paste");
            return;
        }
        const formData = new FormData($form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }
        uploadImage({
            ...data,
            ...image,
        }).then((res) => {
            let message = "";
            if (res.message) {
                message = res.message;
            } else {
                message = `upload success`;
            }
            console.log("res", res);
            document.querySelector(".log").innerHTML = message;
        });
    });

    handleImageChange((imageInfo) => {
        image = {
            ...imageInfo,
            content: imageInfo.content.split("base64,")[1],
        };
    });
};