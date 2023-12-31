const { Isotope }: any = window;

interface DefOpt {
	num: number;
	enableSearch: boolean;
	enableInterest: boolean;
}
interface Opt {
	api_key: string;
	num: number;
	myId: string;
	enableSearch: boolean;
	enableInterest: boolean;
}
interface Data {
	farm: number;
	id: string;
	isfamily: number;
	isfriend: number;
	ispublic: number;
	owner: string;
	secret: string;
	server: string;
	title: string;
}

class MyFlickr {
	// 기본값
	#defOpt: DefOpt = { num: 50, enableSearch: true, enableInterest: true };

	// 멤버변수 지정
	frame: HTMLElement | null;
	opt: Opt;
	api_key: string;
	myId: string;
	num: number;
	enableSearch: boolean;
	enableInterest: boolean;
	wrap: HTMLElement | null;
	loading: HTMLImageElement | null;
	btnInterest: HTMLButtonElement | null;
	btnMine: HTMLButtonElement | null;
	input: HTMLInputElement | null;
	btnSearch: HTMLButtonElement | null;

	constructor(selector: string, opt: Opt) {
		this.frame = document.querySelector(selector);
		this.wrap = null;
		this.loading = null;
		this.btnInterest = null;
		this.btnMine = null;
		this.input = null;
		this.btnSearch = null;
		this.opt = { ...this.#defOpt, ...opt };
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
		this.fecthData(this.setURL('user', this.myId));
	}

	createInit() {
		const img = document.createElement('img');
		const src = document.createAttribute('src');
		const wrap = document.createElement('ul');
		src.value = 'img/loading.gif';

		img.setAttributeNode(src);
		wrap.classList.add('wrap');
		img.classList.add('loading');
		this.frame?.append(wrap);
		this.frame?.append(img);
		// wrap, loading 값은 createInit 메서드가 호출되어야 만들어지는 값이지만
		// 인스턴스에 값을 넘기려면 멤버변수에 등록이 되어야하므로 멤버변수를 추가해주고 타입 지정
		this.wrap = wrap;
		this.loading = img;
	}

	// 두번째 인수값에 객체를 전달받을 수 있지만 값이 없는 경우를 위해 옵셔널 체이닝 처리
	setURL(type: string, opt?: Object) {
		const baseURL = `https://www.flickr.com/services/rest/?format=json&nojsoncallback=1&api_key=${this.api_key}&per_page=${this.num}&method=`;
		const method_interest = 'flickr.interestingness.getList';
		const method_user = 'flickr.people.getPhotos';
		const method_search = 'flickr.photos.search';

		if (type === 'interest') return `${baseURL}${method_interest}`;
		if (type === 'search') return `${baseURL}${method_search}&tags=${opt}`;
		if (type === 'user') return `${baseURL}${method_user}&user_id=${opt}`;
	}

	// url값으로 문자를 지정하되 값이 없을 때를 고려하여 undefined 추가
	async fecthData(url: string | undefined) {
		this.loading?.classList.remove('off');
		this.wrap?.classList.remove('on');

		// 인수에 값을 전달할 때 값이 없을수도 있는 경우 대체값을 지정
		const res = await fetch(url || '');
		const json = await res.json();
		const items = json.photos.photo;
		if (items.length === 0) {
			this.loading?.classList.add('off');
			this.wrap?.classList.add('on');
			return alert('해당 검색어의 결과이미지가 없습니다.');
		}
		console.log('items: ', items);
		this.createList(items);
	}

	createList(arr: Data[]) {
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
		this.wrap && (this.wrap.innerHTML = tags);

		this.setLoading();

		const btnUsers = this.frame?.querySelectorAll('.profile .userid') as NodeListOf<HTMLSpanElement> | [];
		const btnThumbs = this.frame?.querySelectorAll('.thumb') as NodeListOf<HTMLImageElement> | [];

		btnThumbs.forEach((btn) =>
			btn.addEventListener('click', (e: Event) => {
				// 타입스크립트에서는 e.target의 속성을 읽지 못하기 때문에 직접 HTMLElement타입을 지정한 객체를 변수로 옮겨담아서 호출한다.
				const eventTarget = e.target as HTMLElement;
				this.createPop(eventTarget.getAttribute('alt'));
			})
		);
		btnUsers.forEach((btn) =>
			btn.addEventListener('click', (e: Event) => {
				const eventTarget = e.target as HTMLElement;
				this.fecthData(this.setURL('user', eventTarget.innerText));
			})
		);
	}

	setLoading() {
		// imgs 반복문이 실행되므로 처음 값이 없을 때 빈배열을 넘겨준다.
		// 노드리스트 타입 지정 - NodeListOf<HTMLImageElement>
		const imgs: NodeListOf<HTMLImageElement> | [] = this.wrap?.querySelectorAll<HTMLImageElement>('img') || [];
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
		// 클래스 안쪽에서 CDN으로 가져오는 외부 클래스를 호출하면 type 에러 발생
		// 직접 window 객체에서 해당 데이터를 비구조화 할당으로 가져와 타입 지정
		new Isotope(this.wrap, {
			itemSelector: '.item',
			transitionDuration: '0.5s',
		});
		this.wrap?.classList.add('on');
		this.loading?.classList.add('off');
	}

	createBtnSet() {
		const btnSet = document.createElement('nav');
		btnSet.classList.add('btnSet');
		btnSet.innerHTML = `
      <button class="btnInterest">Interest Gallery</button>
      <button class="btnMine">My Gallery</button>
    `;
		this.frame?.prepend(btnSet);
		this.frame && (this.btnInterest = this.frame.querySelector('.btnInterest'));
		this.frame && (this.btnMine = this.frame.querySelector('.btnMine'));
		this.btnInterest?.addEventListener('click', () => this.fecthData(this.setURL('interest')));
		this.btnMine?.addEventListener('click', () => this.fecthData(this.setURL('user', this.myId)));
	}

	createSearchBox() {
		const searchBox = document.createElement('div');
		searchBox.classList.add('searchBox');
		searchBox.innerHTML = `    
      <input type="text" id="search" placeholder="검색어 입력">
      <button class="btnSearch">Search</button>
    `;

		this.frame?.prepend(searchBox);
		this.frame && (this.input = this.frame.querySelector('#search'));
		this.frame && (this.btnSearch = this.frame.querySelector('.btnSearch'));
		this.btnSearch?.addEventListener('click', () => this.getSearch());
		this.input?.addEventListener('keypress', (e) => e.code === 'Enter' && this.getSearch());
	}

	getSearch() {
		const value = this.input?.value.trim();
		this.input && (this.input.value = '');
		if (value === '') return alert('검색어를 입력해주세요.');
		this.fecthData(this.setURL('search', value));
	}

	createPop(url: string | null) {
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
		btnClose?.addEventListener('click', () => this.removePop());
		setTimeout(() => document.querySelector('.pop')?.classList.add('on'), 0);
	}

	removePop() {
		document.body.style.overflow = 'auto';
		const pop = document.querySelector('.pop');
		pop?.classList.remove('on');
		setTimeout(() => {
			pop?.remove();
		}, 1000);
	}
}
