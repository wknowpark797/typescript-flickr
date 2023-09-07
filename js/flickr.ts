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

	constructor(selector: string, opt: Opt) {
		this.frame = document.querySelector(selector);
		this.wrap = null;
		this.loading = null;
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
		// this.enableInterest && this.createBtnSet();
		// this.enableSearch && this.createSearchBox();
		this.fecthData(this.setURL('interest'));
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
		// this.createList(items);
	}
}
