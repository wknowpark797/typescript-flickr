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
		// this.fecthData(this.setURL('interest'));
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
}
