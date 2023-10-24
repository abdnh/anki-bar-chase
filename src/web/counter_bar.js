class CounterBar {
    constructor() {
        this.widgets = {
            counterBar: document.getElementById("counter-bar"),
            counter: document.querySelector("#counter-bar .counter"),
            countDown: document.querySelector("#counter-bar .countdown"),
            pogress: document.querySelector("#counter-bar .progress"),
        };
        this.setCounter(0);
        this._countdownInterval = undefined;
    }

    setCounter(value) {
        this.counter = value;
        this.widgets.counter.textContent = value.toString();
        if (this.counter <= 0) {
            this.widgets.pogress.classList.remove("green");
        } else {
            this.widgets.pogress.classList.add("green");
        }
    }

    startCountdown(value) {
        if (this._countdownInterval) {
            clearInterval(this._countdownInterval);
        }
        this._setCountdown(value);
        this._countdownInterval = setInterval(() => {
            if (this.countdown > 0) {
                this._setCountdown(this.countdown - 1, value);
            } else {
                this._setCountdown(value);
                if (this.counter <= 0) {
                    this.setCounter(this.counter - 1, value);
                } else {
                    this.setCounter(0);
                }
            }
        }, 1000);
    }

    _setCountdown(value, original) {
        if (typeof original == "undefined") {
            original = value;
        }

        this.countdown = value;
        let formatted = "";
        let minutes = Math.floor(value / 60);
        formatted += minutes;
        value -= minutes * 60;
        formatted += ":" + value.toString().padStart(2, "0");
        this.widgets.countDown.textContent = formatted;
        this.widgets.pogress.style.width = `${100 * value / original}%`;
    }
}
