var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _MyFlickr_defOpt;
const { Isotope } = window;
class MyFlickr {
    constructor(selector, opt) {
        // 기본값
        _MyFlickr_defOpt.set(this, { num: 50, enableSearch: true, enableInterest: true });
        this.frame = document.querySelector(selector);
        this.wrap = null;
        this.loading = null;
        this.btnInterest = null;
        this.btnMine = null;
        this.input = null;
        this.btnSearch = null;
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
        this.enableInterest && this.createBtnSet();
        this.enableSearch && this.createSearchBox();
        this.fecthData(this.setURL('interest'));
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
    // 두번째 인수값에 객체를 전달받을 수 있지만 값이 없는 경우를 위해 옵셔널 체이닝 처리
    setURL(type, opt) {
        const baseURL = `https://www.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=${this.api_key}&per_page=${this.num}&method=`;
        const method_interest = 'flickr.interestingness.getList';
        const method_user = 'flickr.people.getPhotos';
        const method_search = 'flickr.photos.search';
        if (type === 'interest')
            return `${baseURL}${method_interest}`;
        if (type === 'search')
            return `${baseURL}${method_search}&tags=${opt}`;
        if (type === 'user')
            return `${baseURL}${method_user}&user_id=${opt}`;
    }
    // url값으로 문자를 지정하되 값이 없을 때를 고려하여 undefined 추가
    fecthData(url) {
        var _a, _b, _c, _d;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = this.loading) === null || _a === void 0 ? void 0 : _a.classList.remove('off');
            (_b = this.wrap) === null || _b === void 0 ? void 0 : _b.classList.remove('on');
            // 인수에 값을 전달할 때 값이 없을수도 있는 경우 대체값을 지정
            const res = yield fetch(url || '');
            const json = yield res.json();
            const items = json.photos.photo;
            if (items.length === 0) {
                (_c = this.loading) === null || _c === void 0 ? void 0 : _c.classList.add('off');
                (_d = this.wrap) === null || _d === void 0 ? void 0 : _d.classList.add('on');
                return alert('해당 검색어의 결과이미지가 없습니다.');
            }
            console.log('items: ', items);
            this.createList(items);
        });
    }
    createList(arr) {
        var _a, _b;
        let tags = '';
        arr.forEach((item) => {
            tags += `
          <li class='item'>
            <div>           
              <img class='thumb' src='https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_m.jpg' alt='https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_b.jpg' />          
              <p>${item.title === '' ? 'Have a good day!!' : item.title}</p>
  
              <article class='profile'>	
                <img src='http://farm${item.farm}.staticflickr.com/${item.server}/buddyicons/${item.owner}.jpg' />				
                <span class='userid'>${item.owner}</span>
              </article>
            </div>
          </li>
        `;
        });
        this.wrap && (this.wrap.innerHTML = tags);
        this.setLoading();
        const btnUsers = (_a = this.frame) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.profile .userid');
        const btnThumbs = (_b = this.frame) === null || _b === void 0 ? void 0 : _b.querySelectorAll('.thumb');
        // btnThumbs.forEach((btn) =>
        // 	btn.addEventListener('click', (e) => this.createPop(e.target.getAttribute('alt')))
        // );
        // btnUsers.forEach((btn) =>
        // 	btn.addEventListener('click', (e) => this.fecthData(this.setURL('user', e.target.innerText)))
        // );
    }
    setLoading() {
        var _a;
        // imgs 반복문이 실행되므로 처음 값이 없을 때 빈배열을 넘겨준다.
        // 노드리스트 타입 지정 - NodeListOf<HTMLImageElement>
        const imgs = ((_a = this.wrap) === null || _a === void 0 ? void 0 : _a.querySelectorAll('img')) || [];
        let count = 0;
        for (const el of imgs) {
            el.onerror = () => {
                el.setAttribute('src', 'https://www.flickr.com/images/buddyicon.gif');
            };
            el.onload = () => {
                count++;
                count === imgs.length && this.isoLayout();
            };
        }
    }
    isoLayout() {
        var _a, _b;
        // 클래스 안쪽에서 CDN으로 가져오는 외부 클래스를 호출하면 type 에러 발생
        // 직접 window 객체에서 해당 데이터를 비구조화 할당으로 가져와 타입 지정
        new Isotope(this.wrap, {
            itemSelector: '.item',
            transitionDuration: '0.5s',
        });
        (_a = this.wrap) === null || _a === void 0 ? void 0 : _a.classList.add('on');
        (_b = this.loading) === null || _b === void 0 ? void 0 : _b.classList.add('off');
    }
    createBtnSet() {
        var _a, _b, _c;
        const btnSet = document.createElement('nav');
        btnSet.classList.add('btnSet');
        btnSet.innerHTML = `
      <button class="btnInterest">Interest Gallery</button>
      <button class="btnMine">My Gallery</button>
    `;
        (_a = this.frame) === null || _a === void 0 ? void 0 : _a.prepend(btnSet);
        this.frame && (this.btnInterest = this.frame.querySelector('.btnInterest'));
        this.frame && (this.btnMine = this.frame.querySelector('.btnMine'));
        (_b = this.btnInterest) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.fecthData(this.setURL('interest')));
        (_c = this.btnMine) === null || _c === void 0 ? void 0 : _c.addEventListener('click', () => this.fecthData(this.setURL('user', this.myId)));
    }
    createSearchBox() {
        var _a, _b, _c;
        const searchBox = document.createElement('div');
        searchBox.classList.add('searchBox');
        searchBox.innerHTML = `    
      <input type="text" id="search" placeholder="검색어 입력">
      <button class="btnSearch">Search</button>
    `;
        (_a = this.frame) === null || _a === void 0 ? void 0 : _a.prepend(searchBox);
        this.frame && (this.input = this.frame.querySelector('#search'));
        this.frame && (this.btnSearch = this.frame.querySelector('.btnSearch'));
        (_b = this.btnSearch) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => this.getSearch());
        (_c = this.input) === null || _c === void 0 ? void 0 : _c.addEventListener('keypress', (e) => e.code === 'Enter' && this.getSearch());
    }
    getSearch() {
        var _a;
        const value = (_a = this.input) === null || _a === void 0 ? void 0 : _a.value.trim();
        this.input && (this.input.value = '');
        if (value === '')
            return alert('검색어를 입력해주세요.');
        this.fecthData(this.setURL('search', value));
    }
}
_MyFlickr_defOpt = new WeakMap();
