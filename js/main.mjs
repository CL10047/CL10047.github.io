import { addImage, deleteImage, addComment, deleteComment, getImage, getImageInfo, imageFromIndex, getComments, clearComments } from "./api.mjs"

document.querySelector("#btn_upload_image").addEventListener("click", function(e) {
    document.querySelector("#upload_image_form_container").classList.toggle('hidden');
});

document.querySelector("#upload_image_form").addEventListener("submit", function (e) {
    e.preventDefault();
    const title = document.querySelector("#image_title").value;
    const author = document.querySelector("#image_author_name").value;
    const url = document.querySelector("#image_url").value;
    document.querySelector("#upload_image_form").reset();
    document.querySelector("#image_container").innerHTML = "";
    const imageId = addImage(title, author, url);

    showImage(imageId);
    const matchedComments = getComments(imageId);
    showComments(matchedComments, 1);
  });

function showImage(imageId) { 
    try {
        const image = getImage(imageId);
        const information = getImageInfo(imageId);
        const index = information[0];
        const total = information[1];

        const elmnt = document.createElement("div");
        elmnt.className = "img card";
        elmnt.innerHTML = `
            <div id="content">
                <div id="image_info">${image.author}</div>
                <div class="delete_icon icon"></div>
            </div>
            <div id="image">
                <img id="uploaded_image" src="${image.url}" alt="Image from ${image.author} on ${image.date.slice(0,10)} ${image.date.slice(11,22)}">
                <div id="uploaded_title">${image.title}</div>
                <div id="upload_date"> ${image.date.slice(0,10)} ${image.date.slice(11,22)} </div>
            </div>
            <div class="nav">
                <button id="btn_previous_image" class="btn">Prev Image</button>
                <div id="image_pos">${index + 1} / ${total}</div>
                <button id="btn_next_image" class="btn">Next Image</button>
            </div>
            <div id="comment_label">Post Comment</div>
            <form class="complex_form" id="post_comment_form">
                <div class="inline_input">
                    <div id="comment_author_name_label">Name</div>
                    <input type="text" class="form_element" id="comment_author_name" name="comment_author_name" maxlength="30" required />
                </div>
                <div class="inline_input">
                    <div id="comment_content_label">Content</div>
                    <input type="text" class="form_element" id="comment_content" name="comment_content" maxlength="100" required />
                </div>
                <input type="submit" class="btn" id="btn_post_comment" value="Post Comment">
            </form>
        `;

        const prevButton = elmnt.querySelector("#btn_previous_image"); 
        const nextButton = elmnt.querySelector("#btn_next_image"); 

        if (index == 0) {
            prevButton.style.visibility = "hidden";
        } else {
            prevButton.style.visibility = "visible";
        }
        if (index == total - 1) {
            nextButton.style.visibility = "hidden";
        } else {
            nextButton.style.visibility = "visible";
        }

        elmnt
            .querySelector(".delete_icon")
            .addEventListener("click", function (e) {
                clearComments(image.imageId);
                const newImageId = deleteImage(image.imageId);
                showImage(newImageId);
                const matchedComments = getComments(newImageId);
                showComments(matchedComments, 1);
            });
        
        elmnt  
            .querySelector("#btn_previous_image")
            .addEventListener("click", function (e) {
                if (index == 0) {
                    return;
                }
                showImage(imageFromIndex(index - 1).imageId);
                const matchedComments = getComments(imageFromIndex(index - 1).imageId);
                showComments(matchedComments, 1);
            });

        elmnt  
            .querySelector("#btn_next_image")
            .addEventListener("click", function (e) {
                if (index == total - 1) {
                    return;
                }
                showImage(imageFromIndex(index + 1).imageId);
                const matchedComments = getComments(imageFromIndex(index + 1).imageId);
                showComments(matchedComments, 1);
            });

        elmnt 
            .querySelector("#post_comment_form")
            .addEventListener("submit", function(e) {
                e.preventDefault();
                const author = document.querySelector("#comment_author_name").value;
                const content = document.querySelector("#comment_content").value;
                elmnt.querySelector("#post_comment_form").reset();
                addComment(imageId, author, content);
                const matchedComments = getComments(imageId);
                showComments(matchedComments, 1);
            });
        
        document.querySelector("#image_container").innerHTML = "";
        document.querySelector("#image_container").prepend(elmnt);
    }
    catch (err) {
        document.querySelector("#image_container").innerHTML = "";
    }
}

function showComments(matchedComments, pageNumber) {
    
    if (matchedComments.length == 0) {
        document.querySelector("#comments_container").style.visibility = "hidden";
        return;
    }

    document.querySelector("#comments_container").style.visibility = "visible";
    document.querySelector("#comments_container").innerHTML =  `
        <div class="nav">
            <button id="btn_previous_comments" class="btn">Prev Comments</button>
            <div id="comments_pos">${pageNumber} / ${Math.ceil(matchedComments.length / 10)}</div>
            <button id="btn_next_comments" class="btn">Next Comments</button>
        </div>
        `;   
        
    const prevButton = document.querySelector("#btn_previous_comments"); 
    const nextButton = document.querySelector("#btn_next_comments"); 
    const start =  matchedComments.length - (pageNumber * 10);
    const end = matchedComments.length - ((pageNumber - 1) * 10);
    const slicedComments = matchedComments.slice(Math.max(0, start), Math.min(end, matchedComments.length));

    if (slicedComments[slicedComments.length - 1] == matchedComments[matchedComments.length -1]) {
        prevButton.style.visibility = "hidden";
    } else {
        prevButton.style.visibiltiy = "visible";
    }

    if (slicedComments.includes(matchedComments[0])) {
        nextButton.style.visibility = "hidden";
    } else {
        nextButton.style.visibility = "visible";
    }

    prevButton.addEventListener("click", function(e) {
        showComments(matchedComments, pageNumber - 1);
    });

    nextButton.addEventListener("click", function(e) {
        showComments(matchedComments, pageNumber + 1);
    });

    slicedComments.forEach(function (comment) {
        const elmnt = document.createElement("div");
        elmnt.className = "comment card";
        elmnt.innerHTML = `
            <div class="comment_card">
                <div class="comment_info_author">${comment.author}:</div>
                <div class="comment_func">
                    <div class="comment_info_date">${comment.date.slice(0,10)} ${comment.date.slice(11,22)}</div>
                    <div class="delete_icon icon_small"></div>
                </div>
            </div>
            <div  class="comment_info_content">${comment.content}</div>
        `;

        elmnt
            .querySelector(".delete_icon")
            .addEventListener("click", function (e) {
                const matchingImageId = comment.imageId;
                deleteComment(comment.commentId);
                const matchedComments = getComments(matchingImageId);
                if (matchedComments.length % 10 == 0) {
                    showComments(matchedComments, pageNumber - 1);
                } else {
                    showComments(matchedComments, pageNumber);
                }
            });       
        document.querySelector("#comments_container").prepend(elmnt);
    });
}

window.onload = function() {
    const image = imageFromIndex(0);
    if (image != null) {
        showImage(image.imageId);
        showComments(getComments(image.imageId), 1);
    } else {
        document.querySelector("#comments_container").style.visibility = "hidden";
    }
}
