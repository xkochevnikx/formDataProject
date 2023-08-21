let formWrapper = document.querySelector('.form-wrapper');
let successBox = document.querySelector('.success-box');
let loaderBox = document.querySelector('.loader-box');
let form = formWrapper.querySelector('.form');
let counter = form.querySelector('.form__counter');
let selectBody = form.querySelector('.select-body');
let selectItem = selectBody.querySelectorAll('.select-item');
let textarea = form.querySelector('.form-textarea');
let select = form.querySelector('#fieldset-select');
let span = form.querySelector('.error-service');
let choiseSelect = form.querySelector('.current-select');
form.addEventListener('submit', handleSubmit);
form.addEventListener('focusin', handleFocus);
form.addEventListener('focusout', handleBlur);
textarea.addEventListener('input', handleCounter);
successBox.addEventListener('click', handleCloseSuccess);
select.addEventListener('click', activeSelect);
formWrapper.addEventListener('click', closeSelect);
let placeholder = null;
let currentSelect = choiseSelect.innerText;

//todo - обработчики на селект айтемы
Array.from(selectItem).forEach((item) => {
    item.addEventListener('click', selectItemchoice);
});

//todo основной обработчик события
async function handleSubmit(e) {
    e.preventDefault();

    let inputs = form.querySelectorAll('.required');

    if (!validate(inputs)) {
        let data = serializeForm(inputs);
        loaderFn();
        // let response = await fetchUsers(data);
        // if (response.ok) {
        //     form.reset();
        //     selectReset();
        //     counter.innerText = '1000';
        //     successFetch();
        // }
    }
}

//todo - функция валидации
function validate(formNode) {
    let result = false;
    Array.from(formNode).forEach((node) => {
        const input = node;
        toggleError(input);
    });
    return result;
}

//todo - функция принимает ноду и возвращает данные для отправки на сервер
function serializeForm(formNode) {
    const data = [];

    Array.from(formNode).forEach((element) => {
        if (element.closest('.rules__input')) {
            data.push({ [element.dataset.name]: element.checked });
        }

        if (element.closest('.form-input')) {
            data.push({ [element.dataset.name]: element.value });
        }

        if (element.closest('.select-header')) {
            data.push({ [element.dataset.name]: element.dataset.value });
        }
    });

    data.push({ [textarea.dataset.name]: textarea.value });

    return data;
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
    // toggleError(e.target);
}

//todo - обработка выхода из фокуса
function handleBlur(e) {
    let input = e.target;
    input.placeholder = placeholder;
}

//todo - функция переключения данных об ошибке
function toggleError(element) {
    let error = element.closest('.fieldset:invalid');
    if (error) {
    }
}

//todo - функция добавления лоадера на страницу
function loaderFn() {
    formWrapper.classList.remove('active');
    loaderBox.classList.add('active');
}

//todo - запрос успешно отправлен
function successFetch() {
    loaderBox.classList.remove('active');
    successBox.classList.add('active');
}

//todo - закрываем окно с информацией об успешной отправке данных
function handleCloseSuccess() {
    successBox.classList.remove('active');
    formWrapper.classList.add('active');
    select.classList.remove('choise');
}

//todo - открыть селект
function activeSelect() {
    selectBody.classList.toggle('active');
}

//todo - закрываю селект за пределами формы
function closeSelect(e) {
    if (e.target.classList.contains('form-wrapper')) {
        selectBody.classList.remove('active');
    }
}

//TODO - обработчик на полях селекта
function selectItemchoice() {
    choiseSelect.innerText = this.innerText;
    form.querySelector('.select-header').setAttribute(
        'data-value',
        this.dataset.value
    );
    selectBody.classList.remove('active');
    select.classList.add('choise');
}

//todo - очистка селекта после отправки формы
function selectReset() {
    choiseSelect.innerText = currentSelect;
    form.querySelector('.select-header').removeAttribute('data-value');
}
