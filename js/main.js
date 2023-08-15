let form = document.querySelector('.form');
let counter = document.querySelector('.form__counter');
let textarea = document.querySelector('.form__item-textarea');
let nameInput = document.form.name;
form.addEventListener('submit', handleSubmit);
form.addEventListener('focusin', handleFocus);
form.addEventListener('focusout', handleBlur);
textarea.addEventListener('input', handleCounter);
let placeholder = null;

//todo - функция принимает ноду и возвращает данные для отправки на сервер
function serializeForm(formNode) {
    const { elements } = formNode;
    const data = [];
    Array.from(elements)
        .filter((element) => !!element.name)
        .map((element) => {
            const { name, value } = element;
            data.push({ [name]: value });
        });
    return data;
}

//todo функция для отображения счетчика поля комментариев
function handleCounter() {
    let count = textarea.maxLength - textarea.value.length;
    counter.innerText = `${count}`;
}

//обработка фокуса
function handleFocus(e) {
    let input = e.target;
    placeholder = input.placeholder;
    input.placeholder = '';
    removeError(e.target);
}

function handleBlur(e) {
    let input = e.target;
    input.placeholder = placeholder;
}

//todo - функция отправки данных на сервер
async function fetchUsers(data) {
    const response = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
            'content-type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(data),
    });
    return response;
}

//todo - функция навешивает класс ошибки на родителя (fieldset) инпута
function addErrorClass(element) {
    let parent = element.parentNode;
    parent.classList.add('error');
}

//todo - функция добавления сообщения об ошибке
function addAlertMessage(element) {
    addErrorClass(element);
    let name = element.name;
    let selector = `${'.error' + name[0]?.toUpperCase() + name?.slice(1)}`;
    let spanError = document.querySelector(selector);
    spanError?.classList.add('error');
}

//todo - функция удаления данных об ошибке при каждом новом событии все затирается
function removeError(element) {
    element.parentNode.classList.remove('error');
    let name = element.name;
    let selector = `${'.error' + name[0]?.toUpperCase() + name?.slice(1)}`;
    let spanError = document.querySelector(selector);
    spanError?.classList.remove('error');
}

//todo - функция валидации
function validate(formNode) {
    let result = false;
    for (let index = 0; index < formNode.length; index++) {
        const input = formNode[index];
        removeError(input);
        if (!input.value.trim() && input.type !== 'checkbox') {
            addAlertMessage(input);
        }
        if (input.type === 'checkbox' && !input.checked) {
            addErrorClass(input);
        }
    }
    return result;
}

//todo - функция добавления лоадера на страницу
function loader() {
    let wrap = document.querySelector('.form-box_wrapper');
    let loader = document.querySelector('.loader_box');
    wrap.style.display = 'none';
    loader.style.display = 'flex';
}

//todo основной обработчик события
async function handleSubmit(e) {
    e.preventDefault();
    let inputs = document.querySelectorAll('.required');
    validate(inputs);
    // if (!validate(e.target)) {
    //     let data = serializeForm(inputs);
    //     loader();
    //     let response = await fetchUsers(data);
    //     if (response.ok) {
    //         successFetch();
    //     } else {
    //         errorFetch();
    //     }
    // }
}
