let formContainer = document.querySelector('.form-container');
let formWrapper = formContainer.querySelector('.form-wrapper');
let successBox = formContainer.querySelector('.success-box');
let loaderBox = formContainer.querySelector('.loader-box');
let form = formWrapper.querySelector('.form');
let counter = form.querySelector('.form__counter');
let selectBody = form.querySelector('.select-body');
let textarea = form.querySelector('.form-textarea');
let select = form.querySelector('.fieldset-select');
form.addEventListener('submit', handleSubmit);
form.addEventListener('focusin', handleFocus);
form.addEventListener('focusout', handleBlur);
textarea.addEventListener('input', handleCounter);
successBox.addEventListener('click', handleCloseSuccess);
select.addEventListener('click', activeSelect);
formWrapper.addEventListener('click', closeSelect);
let placeholder = null;

//todo - функция принимает ноду и возвращает данные для отправки на сервер
function serializeForm(formNode) {
    const data = [];
    Array.from(formNode).forEach((element) => {
        if (element.closest('.rules-box__input')) {
            data.push({ [element.dataset.name]: element.checked });
        } else {
            data.push({ [element.dataset.name]: element.value });
        }
    });
    data.push({ [textarea.dataset.name]: textarea.value });

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

//todo - функция добавления сообщения об ошибке
function addAlertMessage(element) {
    if (element.closest('fieldset:invalid')) {
        let selector = `${
            '.error' +
            element.dataset.name[0]?.toUpperCase() +
            element.dataset.name?.slice(1)
        }`;
        let spanError = form.querySelector(selector);
        spanError?.classList.add('error');
    }
}

//todo - функция удаления данных об ошибке
function removeError(element) {
    let error = element.closest('fieldset:invalid');
    if (error) {
        let selector = `${
            '.error' +
            element.dataset.name[0]?.toUpperCase() +
            element.dataset.name?.slice(1)
        }`;
        let spanError = form.querySelector(selector);
        spanError?.classList.remove('error');
    }
}

//todo - функция валидации
function validate(formNode) {
    let result = false;
    Array.from(formNode).forEach((node) => {
        const input = node;
        removeError(input);
        if (input.closest('fieldset:invalid')) {
            result = true;
            addAlertMessage(input);
        }
    });
    return result;
}

//todo - функция добавления лоадера на страницу
function loaderFn() {
    formWrapper.classList.remove('isActiv');
    loaderBox.classList.add('isActiv');
}

//todo - запрос успешно отправлен
function successFetch() {
    loaderBox.classList.remove('isActiv');
    successBox.classList.add('isActiv');
}

//todo - закрываем окно с информацией об успешной отправке данных
function handleCloseSuccess() {
    successBox.classList.remove('isActiv');
    formWrapper.classList.add('isActiv');
}

//todo - открыть селект
function activeSelect() {
    selectBody.classList.toggle('isActiv');
}

//todo - закрываю селект за пределами формы
function closeSelect(e) {
    if (e.target.classList.contains('form-wrapper')) {
        selectBody.classList.remove('isActiv');
    }
}

//todo основной обработчик события
async function handleSubmit(e) {
    e.preventDefault();

    let inputs = form.querySelectorAll('.required');

    if (!validate(inputs)) {
        let data = serializeForm(inputs);
        loaderFn();
        let response = await fetchUsers(data);
        if (response.ok) {
            form.reset();
            counter.innerText = '1000';
            successFetch();
        }
    }
}
