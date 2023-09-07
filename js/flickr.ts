class ChangeColor {
	// 인스턴스 객체에 넘어가는 값은 DOM으로 변환된 객체 혹은 null
	selector: HTMLElement | null;
	color: string;

	// 생성자 호출시 selector에 전달되는 값은 문자열
	constructor(selector: HTMLElement, color: string) {
		this.selector = selector;
		this.color = color;
		this.bindingEvent(this.color);
	}

	bindingEvent(color: string) {
		this.selector?.addEventListener('click', (e: Event) => {
			// e.target 객체를 타입스크립트가 인지하지 못하므로 명시적으로 타입 지정
			const eventTarget = e.target as HTMLElement;
			eventTarget.style.background = color;
		});
	}
}
