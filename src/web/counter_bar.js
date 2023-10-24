class CounterBar {
    constructor() {
        this.widgets = {
            counterBar: document.getElementById("counter-bar"),
            counter: document.querySelector("#counter-bar .counter"),
            countDown: document.querySelector("#counter-bar .countdown"),
            loops: document.querySelector("#counter-bar .loops"),
            progress: document.querySelector("#counter-bar .progress"),
        };
        this.setCounter(0);
        this._countdownInterval = undefined;
        this._animationRequestId = undefined;
    }

    setCounter(value) {
        this.counter = value;
        this.widgets.counter.textContent = value.toString();
        if (this.counter <= 0) {
            this.widgets.progress.classList.remove("green");
        } else {
            this.widgets.progress.classList.add("green");
        }
    }

    startCountdown(seconds) {
        if (this._countdownInterval) {
            clearInterval(this._countdownInterval);
        }
        if (this._animationRequestId) {
            window.cancelAnimationFrame(this._animationRequestId);
        }
        this._setLoops(0);
        this._setCountdown(seconds + 1);
        const updateCounts = () => {
            if (this.countdown > 0) {
                this._setCountdown(this.countdown - 1);
            } else {
                this._setLoops(this.loops + 1);
                this._setCountdown(seconds);
                if (this.counter <= 0) {
                    this.setCounter(this.counter - 1);
                } else {
                    this.setCounter(0);
                }
            }
        };
        let startTimeStamp, lastCountUpdate;
        const animate = (timeStamp) => {
            if (
                startTimeStamp === undefined ||
                Math.round(timeStamp - lastCountUpdate) >= 1000
            ) {
                updateCounts();
                lastCountUpdate = timeStamp;
            }
            if (startTimeStamp === undefined) {
                startTimeStamp = timeStamp;
            }
            const elapsed = timeStamp - startTimeStamp;
            const width = 100 - (100 * (elapsed / 1000)) / seconds;
            this.widgets.progress.style.width = `${width}%`;
            if (width <= 0) {
                startTimeStamp = undefined;
            }
            this._animationRequestId = window.requestAnimationFrame(animate);
        };
        this._animationRequestId = window.requestAnimationFrame(animate);
    }

    _setCountdown(value) {
        this.countdown = value;
        let formatted = "";
        let minutes = Math.floor(value / 60);
        formatted += minutes;
        value -= minutes * 60;
        formatted += ":" + value.toString().padStart(2, "0");
        this.widgets.countDown.textContent = formatted;
    }

    _setLoops(value) {
        this.loops = value;
        this.widgets.loops.textContent = value.toString();
    }
}
