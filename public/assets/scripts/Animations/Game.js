class Game {
  constructor() {
    this.pioche = document.getElementById("pioche");
    // this.cardSound = document.getElementById("cardSound");
    this.centerX = window.innerWidth * 0.46;
    this.centerY = window.innerHeight * 0.39;
    this.deckPositionX = this.centerX - window.innerWidth * 0.26; // Position initiale du deck
    this.playerHand = [];
    this.positions = [
      { x: -window.innerWidth * 0.16, y: -innerHeight * 0.47, rotation: 180 },
      { x: 0, y: -innerHeight * 0.47, rotation: 180 },
      { x: window.innerWidth * 0.16, y: -innerHeight * 0.47, rotation: 180 },
      { x: window.innerWidth * 0.47, y: -innerHeight * 0.21, rotation: -90 },
      { x: window.innerWidth * 0.47, y: innerHeight * 0.21, rotation: -90 },
      { x: -window.innerWidth * 0.47, y: -innerHeight * 0.21, rotation: 90 },
      { x: -window.innerWidth * 0.47, y: innerHeight * 0.21, rotation: 90 },
      { x: 0, y: innerHeight * 0.35, rotation: 0 },
    ];
    this.deck = this.createDeck(64);
    this.playerCards = [];
    this.centerCards = [];
    this.firstCardX = null;
  }

  initialize() {
    this.positionPioche();
    this.initialDraw();
    this.distribuerCartes();
    this.addCardClickHandlers();
    this.addPiocheClickHandler();
  }

  createDeck(size) {
    const deck = [];
    for (let i = 25; i <= size + 24; i++) {
      deck.push(i);
    }
    return deck;
  }

  positionPioche() {
    this.pioche.style.left = `${this.centerX - window.innerWidth * 0.26}px`;
    this.pioche.style.top = `${this.centerY}px`;
  }

  initialDraw() {
    if (this.deck.length > 0) {
      const cardNumber = this.deck.pop();
      const newCard = document.createElement("div");
      newCard.classList.add("carte", "carte-center");
      document.body.appendChild(newCard);

      const xPos = this.deckPositionX + 150; // Augmenter l'espace à 150 pixels
      const yPos = this.centerY; // Aligner verticalement avec la pioche
      this.firstCardX = xPos;

      gsap.fromTo(
        newCard,
        {
          x: this.deckPositionX,
          y: this.centerY,
          rotation: 0,
        },
        {
          duration: 1,
          x: xPos,
          y: yPos,
          rotation: 0,
          onStart: () => this.cardSound.play(),
        }
      );

      this.centerCards.push(newCard);
    }
  }

  distribuerCartes() {
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 3; j++) {
        const cardId = `#carte${i * 3 + j + 1}`;
        const delay = (i * 3 + j) * 0.2;
        let xPos = this.centerX + this.positions[i].x;
        let yPos = this.centerY + this.positions[i].y;
        let angle = 0;

        if (i === 7) {
          xPos += (j - 1) * 120;
        } else if (i < 3) {
          angle = (j - 1) * 30;
          xPos += angle;
        } else if (i >= 3 && i < 7) {
          angle = (j - 1) * 30;
          yPos += angle;
        }

        gsap.fromTo(
          cardId,
          {
            x: this.centerX - window.innerWidth * 0.26,
            y: this.centerY,
            rotation: 0,
          },
          {
            duration: 1,
            x: xPos,
            y: yPos,
            rotation: this.positions[i].rotation,
            delay: delay,
            // onStart: () => this.cardSound.play(),
          }
        );
      }
    }

    this.playerHand = [
      document.getElementById("carte22"),
      document.getElementById("carte23"),
      document.getElementById("carte24"),
    ];

    this.playerCards = [
      [
        document.getElementById("carte1"),
        document.getElementById("carte2"),
        document.getElementById("carte3"),
      ],
      [
        document.getElementById("carte4"),
        document.getElementById("carte5"),
        document.getElementById("carte6"),
      ],
      [
        document.getElementById("carte7"),
        document.getElementById("carte8"),
        document.getElementById("carte9"),
      ],
      [
        document.getElementById("carte10"),
        document.getElementById("carte11"),
        document.getElementById("carte12"),
      ],
      [
        document.getElementById("carte13"),
        document.getElementById("carte14"),
        document.getElementById("carte15"),
      ],
      [
        document.getElementById("carte16"),
        document.getElementById("carte17"),
        document.getElementById("carte18"),
      ],
      [
        document.getElementById("carte19"),
        document.getElementById("carte20"),
        document.getElementById("carte21"),
      ],
      this.playerHand,
    ];
  }

  addCardClickHandlers() {
    const playerCards = document.querySelectorAll(".carte-mine");
    playerCards.forEach((card) => {
      card.addEventListener("click", () => {
        if (this.playerHand.includes(card)) {
          this.moveCardToCenter(card);
        }
      });
    });
  }

  addPiocheClickHandler() {
    this.pioche.addEventListener("click", () => this.drawCard());
  }

  moveCardToCenter(card) {
    // Déterminer la prochaine position X pour la carte jouée
    const nextX = this.firstCardX + this.centerCards.length * 120;

    // Animer la carte vers la position déterminée
    gsap.to(card, {
      duration: 1,
      x: nextX,
      y: this.centerY,
      rotation: 0,
    });

    // Retirer la carte jouée de this.playerHand
    this.playerHand = this.playerHand.filter((c) => c !== card);
    // Ajouter la carte au centre (this.centerCards)
    this.centerCards.push(card);

    // Réajuster les cartes restantes dans la main du joueur
    this.adjustPlayerHand();

    // Désactiver l'écouteur d'événements pour cette carte
    card.removeEventListener("click", this.moveCardToCenter);
  }

  drawCard() {
    if (this.playerHand.length < 3 && this.deck.length > 0) {
      const cardNumber = this.deck.pop();
      const newCard = document.createElement("div");
      newCard.classList.add("carte", "carte-mine");
      document.body.appendChild(newCard);
      this.playerHand.push(newCard);
      this.addCardClickHandlers();

      const index = this.playerHand.length - 1;
      const xPos = this.firstCardX + index * 120;
      const yPos = this.centerY + this.positions[7].y;

      gsap.fromTo(
        newCard,
        {
          x: this.deckPositionX,
          y: this.centerY,
          rotation: 0,
        },
        {
          duration: 1,
          x: xPos,
          y: yPos,
          rotation: 0,
          // onStart: () => this.cardSound.play(),
        }
      );
    }
  }

  playCards(playerIndex, numberOfCards) {
    const cardsToPlay = this.playerCards[playerIndex].slice(0, numberOfCards);
    const initialX = this.firstCardX + this.centerCards.length * 120;
    const initialY = this.centerY;

    cardsToPlay.forEach((card, index) => {
      const xPos = initialX + index * 120;
      const yPos = initialY;

      gsap.to(card, {
        duration: 1,
        x: xPos,
        y: yPos,
        rotation: 0,
        delay: index * 0.2,
        // onStart: () => this.cardSound.play(),
      });

      this.playerCards[playerIndex] = this.playerCards[playerIndex].filter(
        (c) => c !== card
      );

      this.centerCards.push(card);

      // Désactiver l'écoute des événements pour cette carte
      card.removeEventListener("click", this.moveCardToCenter);
    });
  }

  collectCenterCards(playerIndex) {
    const { x, y, rotation } = this.positions[playerIndex];
    this.centerCards.forEach((card, index) => {
      const xPos = this.centerX + x;
      const yPos = this.centerY + y;
      gsap.to(card, {
        duration: 1,
        x: xPos,
        y: yPos,
        rotation: rotation,
        delay: index * 0.2,
        // onStart: () => this.cardSound.play(),
        onComplete: () => card.remove(),
      });
    });

    this.centerCards = [];
  }

  adjustPlayerHand() {
    this.playerHand.forEach((card, index) => {
      const xPos = this.firstCardX + index * 120;
      const yPos = this.centerY + this.positions[7].y;

      gsap.to(card, {
        duration: 1,
        x: xPos,
        y: yPos,
        rotation: 0,
      });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const game = new Game();
  game.initialize();

  document.addEventListener("keydown", (event) => {
    if (event.code === "Space") {
      game.playCards(3, 2);
    }
    if (event.code === "KeyC") {
      game.collectCenterCards(0);
    }
    if (event.code === "KeyR") {
      game.refillCards(2, 3);
    }
  });
});
