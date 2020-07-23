const memos = document.querySelector('.memo__list');

let workDB = JSON.parse(localStorage.getItem('work')) || [];
let lifeDB = JSON.parse(localStorage.getItem('life')) || [];
let hobbyDB = JSON.parse(localStorage.getItem('hobby')) || [];
let wishDB = JSON.parse(localStorage.getItem('wish')) || [];
let healthDB = JSON.parse(localStorage.getItem('health')) || [];
let habitDB = JSON.parse(localStorage.getItem('habit')) || [];
let allDB = [...workDB, ...lifeDB, ...hobbyDB, ...wishDB, ...healthDB, ...habitDB];
// * 데이터에 아예 menu를 같이 저장하는 편이 db 수정할때도 더 편할 것 같음
// let allDB = {
// 	work: workDB,
// 	life: lifeDB,
// 	hobby: hobbyDB,
// 	wish: wishDB,
// 	health: healthDB,
// 	habit: habitDB,
// };

// * submitBtn 눌렸을 때
const submitBtn = document.querySelector('.input__memo__submit');
submitBtn.addEventListener('click', (event) => {
	const menu = getMenu();
	const text = getText();
	const id = createUUID();

	addMemo(menu, text.value, id);
	const memo = getMemoForm(menu, text.value, id);
	memos.appendChild(memo);

	text.value = '';
});

// * 처음 시작했을 때
allDB.forEach((memo) => {
	const form = getMemoForm(memo.menu, memo.text, memo.id);
	// console.log(form);
	memos.appendChild(form);
});

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
			console.log('edit button pressed');

			// 1. 거기있는 menu, text, id 가져와서 db에서 삭제하고 -> input 에 그대로 넣어줘야됨
			// deleteMemo(event.target.id);
			// input.value = text;
		}

		if (event.target.clasName === 'memo__menu') {
			// menu 수정하기? -> 보류
		}
		console.log(event.target.className);

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
	console.log(id);
	const [deleteMemo] = allDB.filter((memo) => {
		if (memo.id === id) return memo;
	});

	// db에서 해당하는 애 찾고, 삭제
	let db = getMenuDB(deleteMemo.menu);
	db = db.filter((memo) => memo.id !== id);
	setMenuDB(deleteMemo.menu, db);

	// 화면에서 삭제
	const deleteTodo = document.querySelector(`.memo[id="${id}"]`);
	deleteTodo.remove();
}

// * 수정시에도 재사용할수있도록
function addMemo(menu, text, id) {
	console.log(`가져온 menu: ${menu}, text: ${text}`);

	// main 화면 Update

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
	// console.log(text.value);
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
