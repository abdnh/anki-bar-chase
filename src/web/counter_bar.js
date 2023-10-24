class CounterBar {
    constructor() {
        this.widgets = {
            counterBar: document.getElementById("counter-bar"),
            counter: document.querySelector("#counter-bar .counter"),
            countDown: document.querySelector("#counter-bar .countdown"),
            pogress: document.querySelector("#counter-bar .progress"),
        };
        this.setCounter(0);
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

    setCountDown(value) {
        this._setCountDown(value);
        setInterval(() => {
            if (this.countdown > 0) {
                this._setCountDown(this.countdown - 1);
            } else {
                this._setCountDown(value);
                if (this.counter <= 0) {
                    this.setCounter(this.counter - 1);
                } else {
                    this.setCounter(0);
                }
            }
        }, 1000);
    }

    _setCountDown(value) {
        this.countdown = value;
        let formatted = "";
        let minutes = Math.floor(value / 60);
        formatted += minutes;
        value -= minutes * 60;
        formatted += ":" + value.toString().padStart(2, "0");
        this.widgets.countDown.textContent = formatted;
    }
}
