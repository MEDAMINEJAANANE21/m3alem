// JavaScript pour les animations
document.addEventListener('DOMContentLoaded', function() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const progressBar = document.querySelector('.list-progress .inner');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if(entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animation de la barre de progression
                const progressHeight = (index + 1) * (100 / timelineItems.length);
                progressBar.style.height = `${progressHeight}%`;
            }
        });
    }, {
        threshold: 0.4,
        rootMargin: '0px 0px -100px 0px'
    });

    timelineItems.forEach(item => observer.observe(item));
});

// avis
document.addEventListener('DOMContentLoaded', function() {
    const formAvis = document.getElementById('formAvis');
    const containerAvis = document.querySelector('.container-avis');

    // Charger les avis existants
    chargerAvis();

    // Soumission du formulaire
    formAvis.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const nom = e.target.nom.value;
        const commentaire = e.target.commentaire.value;
        const note = e.target.note.value;

        ajouterAvis(nom, commentaire, note);
        formAvis.reset();
    });

    function ajouterAvis(nom, commentaire, note) {
        const avis = {
            nom,
            commentaire,
            note,
            date: new Date().toLocaleDateString()
        };

        // Sauvegarder dans localStorage
        let avisExistants = JSON.parse(localStorage.getItem('avis')) || [];
        avisExistants.push(avis);
        localStorage.setItem('avis', JSON.stringify(avisExistants));

        // Afficher
        afficherAvis([avis]);
    }

    function chargerAvis() {
        const avisExistants = JSON.parse(localStorage.getItem('avis')) || [];
        afficherAvis(avisExistants);
    }

    function afficherAvis(avisArray) {
        avisArray.forEach(avis => {
            const avisCard = document.createElement('div');
            avisCard.className = 'avis-card';
            avisCard.innerHTML = `
                <h4>${avis.nom}</h4>
                <div class="note">${'★'.repeat(avis.note)}${'☆'.repeat(5 - avis.note)}</div>
                <p>${avis.commentaire}</p>
                <small>Posté le ${avis.date}</small>
            `;
            containerAvis.prepend(avisCard); // Nouveaux avis en haut
        });
    }
});