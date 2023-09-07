var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MyFlickr_defOpt;
class MyFlickr {
    constructor(selector, opt) {
        // 기본값
        _MyFlickr_defOpt.set(this, { num: 50, enableSearch: true, enableInterest: true });
        this.frame = document.querySelector(selector);
        this.wrap = null;
        this.loading = null;
        this.opt = Object.assign(Object.assign({}, __classPrivateFieldGet(this, _MyFlickr_defOpt, "f")), opt);
        this.api_key = this.opt.api_key;
        this.myId = this.opt.myId;
        this.num = this.opt.num;
        this.enableSearch = this.opt.enableSearch;
        this.enableInterest = this.opt.enableInterest;
        this.bindingEvent();
    }
    bindingEvent() {
        this.createInit();
        // this.enableInterest && this.createBtnSet();
        // this.enableSearch && this.createSearchBox();
        // this.fecthData(this.setURL('interest'));
    }
    createInit() {
        var _a, _b;
        const img = document.createElement('img');
        const src = document.createAttribute('src');
        const wrap = document.createElement('ul');
        src.value = 'img/loading.gif';
        img.setAttributeNode(src);
        wrap.classList.add('wrap');
        img.classList.add('loading');
        (_a = this.frame) === null || _a === void 0 ? void 0 : _a.append(wrap);
        (_b = this.frame) === null || _b === void 0 ? void 0 : _b.append(img);
        // wrap, loading 값은 createInit 메서드가 호출되어야 만들어지는 값이지만
        // 인스턴스에 값을 넘기려면 멤버변수에 등록이 되어야하므로 멤버변수를 추가해주고 타입 지정
        this.wrap = wrap;
        this.loading = img;
    }
}
_MyFlickr_defOpt = new WeakMap();
