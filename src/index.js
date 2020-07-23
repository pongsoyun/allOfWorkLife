let memos = document.querySelector('.memo__list');

let workDB = JSON.parse(localStorage.getItem('work')) || [];
let lifeDB = JSON.parse(localStorage.getItem('life')) || [];
let hobbyDB = JSON.parse(localStorage.getItem('hobby')) || [];
let wishDB = JSON.parse(localStorage.getItem('wish')) || [];
let healthDB = JSON.parse(localStorage.getItem('health')) || [];
let habitDB = JSON.parse(localStorage.getItem('habit')) || [];
let allDB = [...workDB, ...lifeDB, ...hobbyDB, ...wishDB, ...healthDB, ...habitDB];

// * Showing habit
let habitIndex = 0;
showingHabit();

function showingHabit() {
	const habitText = document.querySelector('.habbit__text');

	habitText.innerText = habitDB.length === 0 ? `여기에 습관을 입력해주세요 🥰` : habitDB[habitIndex].text;

	window.setInterval(() => {
		habitIndex = habitIndex >= habitDB.length - 1 ? 0 : habitIndex + 1;
		habitText.innerText = habitDB.length === 0 ? `여기에 습관을 입력해주세요 🥰` : habitDB[habitIndex].text;
	}, 5000);
}

const habitBtn = document.querySelector('.habit__btn__container');
habitBtn.addEventListener('click', (event) => {
	const habitText = document.querySelector('.habbit__text');
	switch (event.target.className) {
		case 'habit__prev__btn':
			habitIndex = habitIndex <= 0 ? habitDB.length - 1 : habitIndex - 1;
			break;
		case 'habit__next__btn':
			habitIndex = habitIndex >= habitDB.length - 1 ? 0 : habitIndex + 1;
			break;
	}
	habitText.innerText = habitDB.length === 0 ? `여기에 습관을 입력해주세요 🥰` : habitDB[habitIndex].text;
});

// * submitBtn 눌렸을 때
const submitBtn = document.querySelector('.input__memo__submit');
submitBtn.addEventListener('click', (event) => {
	const menu = getMenu();
	const text = getText();
	const id = createUUID();

	if (text.value) {
		// ''일경우 반응 x
		addMemo(menu, text.value, id);
		const memo = getMemoForm(menu, text.value, id);
		memos.appendChild(memo);
		memo.scrollIntoView({ behavior: 'smooth', block: 'end' });
	}
	text.value = '';
});

// * 처음 시작했을 때
filterMemos('nav__all');

// * 항상 listener, menu
const nav = document.querySelector('.menus__container');
nav.addEventListener('click', (navMenu) => {
	const navChoice = navMenu.target.className;
	filterMemos(navChoice);
});

// * <main> filter해주는 부분
function filterMemos(navChoice) {
	const db = getNavDB(navChoice); //에 해당하는 것만 보여줄거임

	memos.innerHTML = '';
	db.forEach((memo) => {
		const form = getMemoForm(memo.menu, memo.text, memo.id);
		memos.appendChild(form);
	});
}

function getNavDB(navClassName) {
	let db = [];
	switch (navClassName) {
		case 'nav__all':
			db = allDB;
			break;
		case 'nav__work':
			db = workDB;
			break;
		case 'nav__life':
			db = lifeDB;
			break;
		case 'nav__hobby':
			db = hobbyDB;
			break;
		case 'nav__wish':
			db = wishDB;
			break;
		case 'nav__health':
			db = healthDB;
			break;
		case 'nav__habit':
			db = habitDB;
			break;
	}
	return db;
}

// * 메모 폼 하나 만들어주기
function getMemoForm(menu, text, id) {
	const memo = document.createElement('li');
	memo.setAttribute('class', 'memo');
	memo.setAttribute('id', id);
	memo.innerHTML = `
    <div class="memo__text" id = ${id}>
	    ${text}
	</div>
    <div class="memo__info">
		<span class="memo__menu" id=${id}>${menu}</span>
		<i class="fas fa-trash-alt memo__delete__btn" id=${id}></i>
	</div>
	`;

	memo.addEventListener('click', (event) => {
		if (event.target.className === 'memo__text') {
			// 수정하기
			// * 삭제하려는 menu, text, id 가져와서
			// * db에서 삭제하고
			deleteMemo(event.target.id);

			// * input 에 그대로 넣어주고
			const input = document.querySelector('.input__memo__text');
			input.value = text;

			// * radio check하기
			const menus = document.querySelectorAll('input[type="radio"]');
			for (let radioMenu of menus) {
				if (radioMenu.id === menu) radioMenu.checked = true;
			}
		}

		if (event.target.clasName === 'memo__menu') {
			// menu 수정하기? -> 보류
		}

		if (event.target.className === 'fas fa-trash-alt memo__delete__btn') {
			// 삭제하기
			deleteMemo(event.target.id);
		}
	});

	return memo;
}

// * UUID
function createUUID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

function deleteMemo(id) {
	const [deleteMemo] = allDB.filter((memo) => {
		if (memo.id === id) return memo;
	});

	// db에서 해당하는 애 찾고, 삭제
	let db = getMenuDB(deleteMemo.menu);
	db = db.filter((memo) => memo.id !== id);
	setMenuDB(deleteMemo.menu, db);

	// 화면에서 삭제
	const deleteForm = document.querySelector(`.memo[id="${id}"]`);
	deleteForm.remove();
}

// * 수정시에도 재사용할수있도록
function addMemo(menu, text, id) {
	// local Storage에 등록
	let db = ''; // default

	// * 현재 가져올 db 문자열에 해당하는 db 찾기
	db = getMenuDB(menu);

	localStorage.setItem(menu, JSON.stringify([...db, { menu, text, id }])); // id, star ?
	allDB.push({ menu, text, id });
	db = JSON.parse(localStorage.getItem(menu));

	// * 현재 넣을 db 찾기
	setMenuDB(menu, db);
}

function getMenu() {
	const menus = document.querySelectorAll('input[type="radio"]');
	for (let menu of menus) {
		if (menu.checked) return menu.id;
	}
	// return ''; // 사실 이 경우는 없음
}

function getText() {
	const text = document.querySelector('.input__memo__text');
	return text;
}

function getMenuDB(menu) {
	let db = '';

	switch (menu) {
		case 'work':
			db = workDB;
			break;
		case 'life':
			db = lifeDB;
			break;
		case 'hobby':
			db = hobbyDB;
			break;
		case 'wish':
			db = wishDB;
			break;
		case 'health':
			db = healthDB;
			break;
		case 'habit':
			db = habitDB;
			break;
	}

	return db;
}

function setMenuDB(menu, db) {
	localStorage.setItem(menu, JSON.stringify(db));

	switch (menu) {
		case 'work':
			workDB = db;
			break;
		case 'life':
			lifeDB = db;
			break;
		case 'hobby':
			hobbyDB = db;
			break;
		case 'wish':
			wishDB = db;
			break;
		case 'health':
			healthDB = db;
			break;
		case 'habit':
			habitDB = db;
			break;
	}
}
