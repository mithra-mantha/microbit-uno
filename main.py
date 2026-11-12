mappings = [
    "0",   # Index 0
    "1",   # Index 1
    "2",   # Index 2
    "3",   # Index 3
    "4",   # Index 4
    "5",   # Index 5
    "6",   # Index 6
    "7",   # Index 7
    "8",   # Index 8
    "9",   # Index 9
    "/",   # Index 10 (Skip)
    "+2",  # Index 11
    "\\",    # Index 12 (Reverse)
]
colors = [
    "red", "yellow", "green", "blue"
]
def create_card() -> any:
    num = randint(0, len(mappings))
    color = randint(0, len(colors))
    return {
        "string":color + mappings[num],
        "color":color,
        "type":num
    }
def check_cards(card1, card2) -> bool:
    return (
        card1["type"] == card2["type"] and card1["color"] == card2["color"]
    )
def find_card(top_card, deck) -> any:
    deck
player_cards = []
for i in range(7):
    player_cards.push(create_card())