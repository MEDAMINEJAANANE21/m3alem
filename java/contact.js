document.querySelector('form').addEventListener('submit', function(e) {
    e.preventDefault();  // Empêche le comportement par défaut du formulaire (rechargement de la page)

    const form = e.target;
    const formData = new FormData(form);
    
    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert("Votre message a été envoyé avec succès !");
            window.location.href = '/html/contact.html';  // Redirige vers la page d'accueil
        } else {
            alert("Une erreur est survenue. Veuillez réessayer.");
        }
    })
    .catch(error => {
        alert("Une erreur est survenue. Veuillez réessayer.");
    });
});
