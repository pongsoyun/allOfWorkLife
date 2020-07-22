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
    <div class="memo__text">
	    ${text}						
	</div>
    <div class="memo__info">
		<span class="memo__menu">${menu}</span>
		<i class="fas fa-trash-alt memo__delete__btn"></i>
	</div>
    `;

	memo.addEventListener('click', (event) => {
		if (event.target.className === 'memo__text') {
			// 수정하기
			console.log('edit button pressed');
		}

		if (event.target.clasName === 'memo__menu') {
			// menu 수정하기? -> 보류
		}

		if (event.target.className === 'memo__delete__btn') {
			// 삭제하기
			console.log('delete button pressed');
		}
	});

	return memo;
}

// * UUID
function createUUID() {
	return '_' + Math.random().toString(36).substr(2, 9);
}

// * 수정시에도 재사용할수있도록
function addMemo(menu, text, id) {
	console.log(`가져온 menu: ${menu}, text: ${text}`);

	// main 화면 Update

	// local Storage에 등록
	let db = ''; // default

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

	localStorage.setItem(menu, JSON.stringify([...db, { menu, text, id }])); // id, star ?
	db = JSON.parse(localStorage.getItem(menu));

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

function getMenu() {
	const menus = document.querySelectorAll('input[type="radio"]');
	for (let menu of menus) {
		if (menu.checked) return menu.id;
	}
	// return ''; // 사실 이 경우는 없음

	// * NodeList -> Arrayㄹ로 변환해 filter 쓰려면
	// const menusArr = Array.from(menus);
	// const realMenu = menusArr.filter((menu) => menu.checked === true);

	// * 이렇게 하려면 항상 주시하고있어야되니까 함수안에 넣지 못함..
	// menus.addEventListener('click', (event) => {
	// 	// text 클릭시 ''라 처리해주기
	// 	if (event.target.id) {
	// 		console.log(event.target.id);
	// 		return event.target.id;
	// 	}
	// });
}

function getText() {
	const text = document.querySelector('.input__memo__text');
	// console.log(text.value);
	return text;
}
