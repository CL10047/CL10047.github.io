if (!localStorage.getItem("images")) {
    localStorage.setItem("images", JSON.stringify({ next: 0, items: [] }));
}

if (!localStorage.getItem("comments")) {
    localStorage.setItem("comments", JSON.stringify({ next: 0, items: [] }));
}

/*  ******* Data types *******
    image objects must have at least the following attributes:
        - (String) imageId 
        - (String) title
        - (String) author
        - (String) url
        - (Date) date

    comment objects must have the following attributes
        - (String) commentId
        - (String) imageId
        - (String) author
        - (String) content
        - (Date) date

****************************** */

// add an image to the gallery
export function addImage(title, author, url) {
    const images = JSON.parse(localStorage.getItem("images"));
    const image = { 
        imageId: images.next++, 
        title: title, 
        author: author, 
        url: url,
        date: new Date().toJSON()
    };
    images.items.push(image);
    localStorage.setItem("images", JSON.stringify(images));
    return image.imageId;
}

// delete an image from the gallery given its imageId
export function deleteImage(imageId) {
    const images = JSON.parse(localStorage.getItem("images"));
    const index = images.items.findIndex(function (image) {
        return image.imageId == imageId;
    });
    if (index == -1) return null;
    images.items.splice(index, 1);
    localStorage.setItem("images", JSON.stringify(images));
    try {
        if (images.items.length != 0) {
            return images.items[index - 1].imageId;
        } 
    }
    catch(err) {
        return images.items[index].imageId;
    } 
}

// add a comment to an image
export function addComment(imageId, author, content) {
    const comments = JSON.parse(localStorage.getItem("comments"));
    const comment = { 
        commentId: comments.next++, 
        imageId: imageId, 
        author: author, 
        content: content, 
        date: new Date().toJSON()
    };
    comments.items.push(comment);
    localStorage.setItem("comments", JSON.stringify(comments));
}

// delete a comment to an image
export function deleteComment(commentId) {
    const comments = JSON.parse(localStorage.getItem("comments"));
    const index = comments.items.findIndex(function (comment) {
        return comment.commentId == commentId;
    });
    if (index == -1) return null;
    comments.items.splice(index, 1);
    localStorage.setItem("comments", JSON.stringify(comments));
}

export function getImage(imageId) {
    const images = JSON.parse(localStorage.getItem("images"));
    const index = images.items.findIndex(function (image) {
        return image.imageId == imageId;
    });
    return images.items[index];
}

export function imageFromIndex(index) {
    const images = JSON.parse(localStorage.getItem("images"));
    return images.items[index];
}

export function getImageInfo(imageId) {
    const images = JSON.parse(localStorage.getItem("images"));
    const totalImageCount = images.items.length;
    const index = images.items.findIndex(function (image) {
        return image.imageId == imageId;
    });
    return [index, totalImageCount];
}

export function getComments(imageId) {
    const comments = JSON.parse(localStorage.getItem("comments"));
    const matchingComments = [];

    for (let i = 0; i < comments.items.length; i++) {
        if (comments.items[i].imageId == imageId) {
            matchingComments.push(comments.items[i]);
        }
    }
    return matchingComments;
}

export function clearComments(deleteId) {
    const comments = JSON.parse(localStorage.getItem("comments"));
    comments.items.findIndex(function (comment) {
        if (comment.imageId == deleteId) {
            deleteComment(comment.commentId);
        }
    });
}