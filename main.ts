// Constants
const mappings = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "/",
    "\\",
    "+2"
]
const colors = [
    "R",
    "Y",
    "G",
    "B"
]
const SCROLL_SPEED = 100
const ICON_SHOW_TIME = 500
const PICK_UP_ICON = images.createImage(`
    . .#. .
    .# # # .
    # . # . #
    . . #. .
    . .#. .
`)
// Typescript stuff
interface Card {
    color: number
    type: number
    string: string
}
interface FoundCard {
    newDeck: Card[]
    index: number
    card: Card
}
type printType = "card" | "string";
type stateType = "selection" | "playing";
type logoStateType = "peeking" | "drawing" | "none";
// Factory Function for Card.
function Card(color: number, num: number): Card {
    return {
        "string": colors[color] + mappings[num],
        "color": color,
        "type": num,
    }
}
// Helper functions
function createCard(): Card {
    const num = randint(0, mappings.length - 1)
    const color = randint(0, colors.length - 1)
    return Card(color, num)
}
function checkCards(card1: Card, card2: Card): boolean {
    return card1.type == card2.type || card1.color == card2.color
}
function findCard(topCard: Card, deck: Card[]): FoundCard | null {
    for (let i = 0; i < deck.length; i++) {
        if (checkCards(deck[i], topCard)) {
            return {
                newDeck: deck.filter((value, index) => { return index !== i }),
                index: i,
                card: deck[i],
            }
        }
    }
    return null
}
function print(item: any, itemType: printType): void {
    if (itemType === "card") {
        basic.showString(item["string"], SCROLL_SPEED)
    } else if (itemType === "string") {
        basic.showString(item, SCROLL_SPEED)
    }
}
function gameOver(botWon: boolean): void {
    clearScreen();
    if (botWon) {
        basic.showString("The bot won!", SCROLL_SPEED)
    } else {
        basic.showString("You won!", SCROLL_SPEED);
    }
    basic.pause(3000);
    control.reset();
}
function clearScreen() {
    led.stopAnimation()
    basic.clearScreen()
}
let botCards: Card[] = [];
let playerCards: Card[] = [];
let topCard: Card = createCard();
let cardsIndex: number = 0
for (let i = 0; i < 7; i++) {
    playerCards.push(createCard())
    botCards.push(createCard())
}
let state: stateType = "playing";
function gameLoop() {
    // The bot will play first.
    if (state === "playing") {
        if (botCards.length === 0) {
            gameOver(true)
        } else if (playerCards.length === 0) {
            gameOver(false)
        }
        let card;
        const botFoundVal = findCard(topCard, botCards);
        if (botFoundVal) {
            const newDeck = botFoundVal.newDeck;
            card = botFoundVal.card;
            print(card, "card");
            botCards = newDeck;
            topCard = card;
            if (botCards.length === 0) {
                gameOver(true)
            }
        } else {
            botCards.push(createCard());
            PICK_UP_ICON.showImage(0)
        }
        basic.pause(2000);
        if (card.type < 10) {
            state = "selection";
        }
        clearScreen();
        print(playerCards[cardsIndex], "card")
    }
}
input.onButtonPressed(Button.A, function () {
    if (state === "selection") {
        if (cardsIndex === 0) {
            cardsIndex = playerCards.length - 1;
        } else {
            cardsIndex--
        }
        clearScreen()
        print(playerCards[cardsIndex], "card")
    }
});
input.onButtonPressed(Button.B, function () {
    if (state === "selection") {
        if (cardsIndex === playerCards.length - 1) {
            cardsIndex = 0;
        } else {
            cardsIndex++
        }
        clearScreen()
        print(playerCards[cardsIndex], "card")
    }
});
input.onButtonPressed(Button.AB, function () {
    if (state === "selection") {
        if (checkCards(topCard, playerCards[cardsIndex])) {
            topCard = playerCards[cardsIndex]
            playerCards.removeAt(cardsIndex);
            basic.showIcon(IconNames.Happy);
            basic.pause(ICON_SHOW_TIME)
            basic.clearScreen();
            print(topCard, "card")
            state = "playing";
            cardsIndex = 0;
        } else {
            basic.showIcon(IconNames.Sad)
            basic.pause(ICON_SHOW_TIME);
            basic.clearScreen();
            print(playerCards[cardsIndex], "card")
        }
    }
});
let logoState: logoStateType = "none";
input.onLogoEvent(TouchButtonEvent.Touched, function () {
    if (state === "selection") {
        logoState = "peeking";
        clearScreen()
        print(topCard, "card");
    }
});
input.onLogoEvent(TouchButtonEvent.LongPressed, function () {
    if (state === "selection") {
        logoState = "drawing";
        playerCards.push(createCard())
        clearScreen();
        PICK_UP_ICON.showImage(0)
        state = "playing";
    }
});
input.onLogoEvent(TouchButtonEvent.Released, function () {
    if (state === "selection") {
        if (logoState === "peeking") {
            print(playerCards[cardsIndex], "card")
        }
        logoState = "none";
    }
});
basic.forever(gameLoop)
