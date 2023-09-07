class MyFlickr {
	//default Option private 설정으로 capsule화
	#defOpt = { num: 50, enableSearch: true, enableInterest: true };

	constructor(selector, opt) {
		this.frame = document.querySelector(selector);
		this.opt = { ...this.#defOpt, ...opt };
		this.api_key = this.opt.api_key;
		this.myId = this.opt.myId;
		this.num = this.opt.num;
		this.enableSearch = this.opt.enableSearch;
		this.enableInterest = this.opt.enableInterest;
		this.isError = false;

		//인스턴스 생성떄 필수 옵션 누락시 에러문구 띄우고 메서드 호출 취소
		['frame', 'api_key', 'myId'].forEach((key) => {
			if (!this[key]) {
				console.error(`${key} 항목은 필수 입력 사항입니다.`);
				this.isError = true;
			}
		});

		//모든 필수 옵션값이 들어와야 이벤트 바인딩 메서드 실행
		!this.isError && this.bindingEvent();
	}

	//이벤트 바인딩 메서드
	bindingEvent() {
		this.createInit();
		//enableInterest, enableSearh 옵션이 true일때만 관련 DOM생성 및 이벤트 연결
		this.enableInterest && this.createBtnSet();
		this.enableSearch && this.createSearchBox();
		this.fecthData(this.setURL('interest'));
	}

	//필수 DOM 생성
	createInit() {
		const img = document.createElement('img');
		const src = document.createAttribute('src');
		const wrap = document.createElement('ul');
		src.value = 'img/loading.gif';

		img.setAttributeNode(src);
		wrap.classList.add('wrap');
		img.classList.add('loading');
		this.frame.append(wrap);
		this.frame.append(img);
		this.wrap = wrap;
		this.loading = img;
	}

	//검색창 관련 DOM 생성
	createSearchBox() {
		const searchBox = document.createElement('div');
		searchBox.classList.add('searchBox');
		searchBox.innerHTML = `    
      <input type="text" id="search" placeholder="검색어 입력">
      <button class="btnSearch">Search</button>
    `;

		this.frame.prepend(searchBox);
		this.input = this.frame.querySelector('#search');
		this.btnSearch = this.frame.querySelector('.btnSearch');
		this.btnSearch.addEventListener('click', () => this.getSearch());
		this.input.addEventListener('keypress', (e) => e.code === 'Enter' && this.getSearch());
	}

	//Button Set 관련 DOM 생성
	createBtnSet() {
		const btnSet = document.createElement('nav');
		btnSet.classList.add('btnSet');
		btnSet.innerHTML = `
      <button class="btnInterest">Interest Gallery</button>
      <button class="btnMine">My Gallery</button>
    `;
		this.frame.prepend(btnSet);
		this.btnInterest = this.frame.querySelector('.btnInterest');
		this.btnMine = this.frame.querySelector('.btnMine');
		this.btnInterest.addEventListener('click', () => this.fecthData(this.setURL('interest')));
		this.btnMine.addEventListener('click', () => this.fecthData(this.setURL('user', this.myId)));
	}

	//선택된 타입과 옵션에 따른 fetching URL 반환
	setURL(type, opt) {
		const baseURL = `https://www.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=${this.api_key}&per_page=${this.num}&method=`;
		const method_interest = 'flickr.interestingness.getList';
		const method_user = 'flickr.people.getPhotos';
		const method_search = 'flickr.photos.search';

		if (type === 'interest') return `${baseURL}${method_interest}`;
		if (type === 'search') return `${baseURL}${method_search}&tags=${opt}`;
		if (type === 'user') return `${baseURL}${method_user}&user_id=${opt}`;
	}

	//검색어 관련 fetching Event trigger
	getSearch() {
		const value = this.input.value.trim();
		this.input.value = '';
		if (value === '') return alert('검색어를 입력해주세요.');
		this.fecthData(this.setURL('search', value));
	}

	//setURL이 반환한 URL에 따른 fetching Data 반환
	async fecthData(url) {
		this.loading.classList.remove('off');
		this.wrap.classList.remove('on');

		const res = await fetch(url);
		const json = await res.json();
		const items = json.photos.photo;
		if (items.length === 0) {
			this.loading.classList.add('off');
			this.wrap.classList.add('on');
			return alert('해당 검색어의 결과이미지가 없습니다.');
		}
		this.createList(items);
	}

	//fetching Data에 따른 갤러리 리스트 동적 생성
	createList(arr) {
		let tags = '';

		arr.forEach((item) => {
			tags += `
          <li class='item'>
            <div>           
              <img class='thumb' src='https://live.staticflickr.com/${item.server}/${item.id}_${
				item.secret
			}_m.jpg' alt='https://live.staticflickr.com/${item.server}/${item.id}_${item.secret}_b.jpg' />          
              <p>${item.title === '' ? 'Have a good day!!' : item.title}</p>
  
              <article class='profile'>	
                <img src='http://farm${item.farm}.staticflickr.com/${item.server}/buddyicons/${item.owner}.jpg' />				
                <span class='userid'>${item.owner}</span>
              </article>
            </div>
          </li>
        `;
		});
		this.wrap.innerHTML = tags;

		this.setLoading();

		const btnUsers = this.frame.querySelectorAll('.profile .userid');
		const btnThumbs = this.frame.querySelectorAll('.thumb');
		btnThumbs.forEach((btn) => btn.addEventListener('click', (e) => this.createPop(e.target.getAttribute('alt'))));
		btnUsers.forEach((btn) => btn.addEventListener('click', (e) => this.fecthData(this.setURL('user', e.target.innerText))));
	}

	//이미지의 로딩상태를 확인해서 로딩바 숨김 유무 결정
	//이미지 로딩상태 추적중 누락되는 이미지 있을시 대체 이미지 출력
	setLoading() {
		const imgs = this.wrap.querySelectorAll('img');
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

	//모든 이미지 로딩 완료시 동기적으로 isotope layout 적용
	isoLayout() {
		new Isotope(this.wrap, {
			itemSelector: '.item',
			transitionDuration: '0.5s',
		});
		this.wrap.classList.add('on');
		this.loading.classList.add('off');
	}

	//동적 팝업 생성
	createPop(url) {
		document.body.style.overflow = 'hidden';
		const aside = document.createElement('aside');
		aside.className = 'pop';
		const tags = `
      <div class='con'>
        <img src='${url}' />
      </div>
  
      <span class='close'>close</span>
    `;
		aside.innerHTML = tags;
		document.body.append(aside);
		const btnClose = document.querySelector('.pop .close');
		btnClose.addEventListener('click', () => this.removePop());
		setTimeout(() => document.querySelector('.pop').classList.add('on'), 0);
	}

	//팝업 제거
	removePop() {
		document.body.style.overflow = 'auto';
		const pop = document.querySelector('.pop');
		pop.classList.remove('on');
		setTimeout(() => {
			pop.remove();
		}, 1000);
	}
}
