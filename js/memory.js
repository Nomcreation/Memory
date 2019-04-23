// Création d'un objet js contenant les méthodes nécessaires au jeux
let memory = {
    // Variables nécessaires
    _cardTpl: '<div class="memory-card">\n' +
        '        <div id="card{{id}}" class="inner active" data-target="{{target}}">\n' +
        '            <div class="front"></div>\n' +
        '            <div class="back" style="background-position: 0 -{{position}}px"></div>\n' +
        '        </div>\n' +
        '    </div>',
    _scoreTpl: '<li><span class="score">{{score}}</span>pts <small>avec {{clicks}} tentatives</small></li>',
    _cardHeight: 0,
    _first: null,
    _second: null,
    _imgCount: 0,
    _successCount: 0,
    _start: false,
    _timeout: null,
    _time: 120,
    _timeLeft: this._time,
    _clicks: this._time,
    _e1: null,
    _e2: null,

    // Fonction d'initialisation des variables
    _init (data) {
        this._start = false;
        this._first = data[0];
        this._second = data[1];
        this._imgCount = data[0].length;
        this._successCount = this._clicks = 0;
        this._resetElements();
    },
    // Chargement des données dans le template (cartes)
    _getContent (i, id) {
        return this._cardTpl
            .replace("{{id}}", id)
            .replace("{{position}}", i*this._cardHeight)
            .replace("{{target}}", i);
    },
    // Réinitialisation des variables contenant les cartes sélectionnées
    _resetElements () {
        this._e1 = this._e2 = null;
    },
    // Rotation des cartes face visible vers face cachée.
    _resetCards () {
        this._timeout = null;
        $('#' + this._e1).css( "transform", "rotateY(0deg)" );
        $('#' + this._e2).css( "transform", "rotateY(0deg)" );
        this._resetElements();
    },
    // Lancement de l'animation de la barre de progression
    _animateProgressBar () {
        // Variable indiquant que la progression est lancée
        this._start = true;
        // On attache l'objet à la variable pour l'utiliser dans
        // la fonction d'animation.
        let self = this;
        $(".progress-bar").animate(
            { width: "105%" }, {
            duration: this._time*1000,
            specialEasing: {
                width: "linear"
            },
            step: function( now, fx ) {
                // Affichage du temps dans la barre
                self._timeLeft = self._time - parseInt(self._time)*parseInt(now)/105;
                let left = Math.round(self._timeLeft);
                $(this).html('<div>'+ left +'</div>');
                // & Changement de la couleur en fonction de la progression
                if(left == 20) {
                    $(this).addClass('bg-warning');
                }
                if(left == 9) {
                    $(this).addClass('bg-danger');
                }
            },
            done: function() {
                // Lorsque le temps est écoulé on l'affiche
                if(confirm("Le temps a expiré, vous avez perdu !\n\nSouhaitez vous rejouer ?"))
                    self.resetGame();

            }
        });
    },
    // Formatage des nombres pour les scores
    _formatNumbers (x) {
        x = parseInt(x);
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    // Chargement des scores
    _loadScores (type = 'best') {
        // On definit `data` selon le type [best|all]
        let data = {order:"score DESC, clicks ASC"};
        // si "best" on limte aux 5 premiers
        if(type == 'best'){
            data.limit = 5;
        }
        // Pour permettre l'accès à l'objet dans la requête ajax
        let self = this;
        $.ajax({
            url: "load.php?q=readAll",
            method: 'POST',
            data: data
        })
            .done(function( data ) {
                self._setScores(data);
            });
    },
    // Affichage de ls liste des scores
    _setScores (data) {
        $('#best-scores ol').html('');
        for(i in data){
            $('#best-scores ol').append(
                this._scoreTpl. replace('{{score}}', this._formatNumbers(data[i].score))
                    .replace('{{clicks}}', this._formatNumbers(data[i].clicks)));
        }
    },
    // Réinitialisation du plateau de jeu
    _loadGame (data) {
        // Initialisation des variables
        this._init(data);
        // Récupération de la hauteur des cartes
        this._cardHeight = $('.inner').height();
        // On vide puis on recharge le plateau
        $("#memory-container").html('');
        for (let i=0 ; i<this._imgCount; i++) {
            $("#memory-container").append(this._getContent(this._first[i], i + 1));
            $("#memory-container").append(this._getContent(this._second[i], i + 1 + this._imgCount));
        }
    },
    // Fonction permettant de jouer
    play (e) {
        // Uniquement pour les cartes qui n'ont pas été validées
        // ou déjà sélectionné comme première instance
        if(e.hasClass('active') && e.attr('id') != this._e1){
            // On trace le click
            this._clicks++;
            // on démarre la barre de progression si elle n'est pas démarrée
            if(!this._start){
                this._animateProgressBar();
            }
            // Lorsque deux cartes sont déja retournées
            // on les réinitialise avant de continuer sur la nouvelle sélection
            if(this._e2 != null) {
                clearTimeout(this._timeout);
                this._resetCards();
            }
            // Affichage de la carte sélectionnée
            e.css( "transform", "rotateY(-180deg)" );

            if(this._e1 == null) {
                // cas de la première carte sélectionnée
                this._e1 = e.attr('id');
            } else {
                // lorsque c'est la seconde carte on fait les tests suivants :
                if ($("#" + this._e1).attr('data-target') != e.attr('data-target')) {
                    // les cartes sont différentes
                    this._e2 = e.attr('id');
                    let self = this;
                    this._timeout = setTimeout(function(){
                        self._resetCards();
                    }, 2000);
                } else {
                    // Elles sont identiques alors on enlève la classe active
                    $('#' + this._e1 + ', #' + e.attr('id')).removeClass('active');
                    // on incremente le compteur
                    this._successCount++;
                    // Puis on teste si toutes les cartes sont retournées
                    if (this._successCount == this._imgCount) {
                        // si oui, on enregistre le score et les clicks
                        let score = Math.round(this._timeLeft*1000)
                        $.ajax({
                            method: "POST",
                            url:'load.php?q=newScore',
                            data: {score:score, clicks: this._clicks/2}
                        }).done(function(data) {
                            console.log(data);
                        })
                        // On informe le joueur et on lui demande si il veut rejouer.
                        if(confirm("Félicitations, vous avez gagné ! Votre score est de "+score+"\n\nSouhaitez vous rejouer ?"))
                            this.resetGame();
                    }
                    // Réinitialisation des éléments
                    this._resetElements();
                }
            }
        }
    },
    // remise à zéro du plateau
    resetGame () {
        // raz barre de progression
        $(".progress-bar").stop().css({width:'0%'}).removeClass('bg-warning bg-danger').html('');
        // chargement des scores
        this._loadScores();
        // Récupération d'un nouveau set de cartes et chargement
        let self = this;
        $.get('load.php?q=randomize', (data) => {
            self._loadGame(data);
        })
    },
    // affichage de tous les scores
    viewAllScores () {
        this._loadScores('all')
    },
    // Suppression de tous les scores
    resetScores () {
        $.get('load.php?q=delete', function(){
            this._loadGame();
        })
    }
};
