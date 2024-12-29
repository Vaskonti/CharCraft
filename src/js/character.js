
class Character {
    constructor(character, color) {
        this.character = character;
        this.color = color;
    }

    displayDetails() {
        console.log(`character: ${this.character}, color: ${this.color}`);
    }
}

module.exports = { Character };