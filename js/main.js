let form = document.querySelector('.form');
let counter = document.querySelector('.form__counter');
let textarea = document.querySelector('.form__item-textarea');
let successButton = document.querySelector('.success_box');
let formWrapper = document.querySelector('.form_wrapper');
let nameInput = document.form.name;
let select = document.querySelector('.select_header');
form.addEventListener('submit', handleSubmit);
form.addEventListener('focusin', handleFocus);
form.addEventListener('focusout', handleBlur);
textarea.addEventListener('input', handleCounter);
successButton.addEventListener('click', handleCloseSuccess);
select.addEventListener('click', openSelect);
select.addEventListener('click', removeSelectError);
let placeholder = null;

//todo - функция принимает ноду и возвращает данные для отправки на сервер
function serializeForm(formNode) {
    const data = [];
    data.push({ [textarea.name]: textarea.value });
    Array.from(formNode).map((element) => {
        if (element.type !== 'checkbox') {
            const { name, value } = element;
            data.push({ [name]: value });
        } else {
            const { name, checked } = element;
            data.push({ [name]: checked });
        }
    });
    return data;
}

//todo функция для отображения счетчика поля комментариев
function handleCounter() {
    let count = textarea.maxLength - textarea.value.length;
    counter.innerText = `${count}`;
}

//todo - обработка фокуса
function handleFocus(e) {
    let input = e.target;
    placeholder = input.placeholder;
    input.placeholder = '';
    removeError(e.target);
}

//todo - обработка выхода из фокуса
function handleBlur(e) {
    let input = e.target;
    input.placeholder = placeholder;
}

//todo - события блюр на дивах нет поэтому добавил отдельный хелпер удаляющий ошибку при "фокусе"
function removeSelectError() {
    let value = this.dataset.value;
    if (!value) {
        removeError(this);
    }
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
    let name = divSelectChecker(element);
    addErrorClass(element);
    let selector = `${'.error' + name[0]?.toUpperCase() + name?.slice(1)}`;
    let spanError = document.querySelector(selector);
    spanError?.classList.add('error');
}

function divSelectChecker(element) {
    let name = null;
    if (element.tagName === 'DIV') {
        name = element.dataset.name;
    } else {
        name = element.name;
    }
    return name;
}

//todo - функция удаления данных об ошибке
function removeError(element) {
    let name = divSelectChecker(element);
    element.parentNode.classList.remove('error');
    let selector = `${'.error' + name[0]?.toUpperCase() + name?.slice(1)}`;
    let spanError = document.querySelector(selector);
    spanError?.classList.remove('error');
}

//todo - функция валидации
function validate(formNode) {
    let result = false;
    for (let node of formNode) {
        const input = node;

        removeError(input);
        if (input.value === '' && input.type !== 'checkbox') {
            result = true;
            addAlertMessage(input);
        }
        if (input.type === 'checkbox' && !input.checked) {
            result = true;
            addErrorClass(input);
        }
        if (input.tagName === 'DIV' && !input.dataset.value) {
            result = true;
            addAlertMessage(input);
        }
    }
    return result;
}

//todo - функция добавления лоадера на страницу
function loaderFn() {
    formWrapper.style.display = 'none';
    document.querySelector('.loader_box').style.display = 'flex';
}

//todo - запрос успешно отправлен
function successFetch() {
    document.querySelector('.loader_box').style.display = 'none';
    successButton.style.display = 'flex';
}

//todo - закрываем окно с информацией об успешной отправке данных
function handleCloseSuccess() {
    successButton.style.display = 'none';
    formWrapper.style.display = 'flex';
}

//todo - открыть селект
function openSelect() {
    document.querySelector('.select_body').classList.toggle('isActiv');
    document.querySelectorAll('.select_item').forEach((select) => {
        select.addEventListener('click', function () {
            let content = this.innerText.trim();
            let value = this.dataset.value;
            document.querySelector('.current_select').innerText = content;
            document
                .querySelector('.select_header')
                .setAttribute('data-value', value);
            document.querySelector('.select_body').classList.remove('isActiv');
        });
    });
}

//todo основной обработчик события
async function handleSubmit(e) {
    e.preventDefault();

    let inputs = document.querySelectorAll('.required');

    if (!validate(inputs)) {
        let data = serializeForm(inputs);
        form.reset();
        counter.innerText = '1000';
        loaderFn();
        let response = await fetchUsers(data);
        if (response.ok) {
            successFetch();
        }
    }
}
