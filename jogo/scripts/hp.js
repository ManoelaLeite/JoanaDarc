class hp {
    constructor(config) {
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        });
    }

    get hpPercent() {
        const percent = (this.hp / this.maxHp) * 100;
        return percent > 0 ? percent : 0;
    }

    createElement() {
        if (this.hudElement) {
            return; // Não crie um novo elemento se já existir
        }
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("hp");
        this.hudElement.innerHTML = `
            <svg viewBox="0 0 26 3" class="Combatant_life-container">
                <rect x="0" y="0" width="0%" height="1" fill="#82ff71" />
                <rect x="0" y="1" width="0%" height="2" fill="#3ef126" />
            </svg>
        `;
        this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
    }

    update(changes = {}) {
        // Atualize qualquer dado recebido
        Object.keys(changes).forEach(key => {
            this[key] = changes[key];
        });

        // Atualize a largura da barra de HP
        this.hpFills.forEach(rect => (rect.style.width = `${this.hpPercent}%`));
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement);
        this.update();
    }
}