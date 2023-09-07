class ChangeColor {
    // 생성자 호출시 selector에 전달되는 값은 문자열
    constructor(selector, color) {
        this.selector = selector;
        this.color = color;
        this.bindingEvent(this.color);
    }
    bindingEvent(color) {
        var _a;
        (_a = this.selector) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
            // e.target 객체를 타입스크립트가 인지하지 못하므로 명시적으로 타입 지정
            const eventTarget = e.target;
            eventTarget.style.background = color;
        });
    }
}
