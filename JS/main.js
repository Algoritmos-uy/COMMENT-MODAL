let currentRating = 0;
let comments = [];
let commentId = 0;

function openModal() {
    document.getElementById('commentModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('commentModal').style.display = 'none';
}

function rate(rating) {
    currentRating = rating;
    const stars = document.querySelectorAll('.modal-stars span');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

function submitComment() {
    const userName = document.getElementById('userName').value;
    const comment = document.getElementById('commentText').value;

    if (currentRating === 0 || userName.trim() === '' || comment.trim() === '') {
        alert('Por favor, completa todos los campos.');
        return;
    }

    comments.push({ id: commentId++, rating: currentRating, name: userName, text: comment, likes: 0 });

    if (comments.length > 4) {
        comments = comments.slice(-4);
    }

    localStorage.setItem('comments', JSON.stringify(comments));
    updateCommentsView();

    document.getElementById('userName').value = '';
    document.getElementById('commentText').value = '';
    currentRating = 0;
    closeModal();
}

function likeComment(id) {
    const comment = comments.find(c => c.id === id);
    if (comment) {
        comment.likes++;
        localStorage.setItem('comments', JSON.stringify(comments));
        updateCommentsView();
    }
}

function updateCommentsView() {
    const commentsRow = document.getElementById('commentsRow');
    commentsRow.innerHTML = '';

    const sortedComments = comments.sort((a, b) => b.likes - a.likes);

    sortedComments.forEach(comment => {
        const commentCard = document.createElement('div');
        commentCard.classList.add('comment-card');

        if (comment.rating === 5) {
            commentCard.classList.add('highlight');
        }

        const ratingStars = '★'.repeat(comment.rating) + '☆'.repeat(5 - comment.rating);
        commentCard.innerHTML = `
            <p><strong>Nombre:</strong> ${comment.name}</p>
            <p><strong>Calificación:</strong> <span class="rating">${ratingStars}</span></p>
            <p><strong>Comentario:</strong> ${comment.text}</p>
            <p class="like-section">
                <span class="like-count">${comment.likes}</span> Me gusta
                <button class="like-button" onclick="likeComment(${comment.id})">👍</button>
            </p>
        `;

        commentsRow.appendChild(commentCard);
    });
}

window.onload = function() {
    const savedComments = localStorage.getItem('comments');
    if (savedComments) {
        comments = JSON.parse(savedComments);
        updateCommentsView();
    }
};

window.onclick = function(event) {
    const modal = document.getElementById('commentModal');
    if (event.target === modal) {
        closeModal();
    }
};