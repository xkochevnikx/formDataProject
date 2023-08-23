let formWrapper = document.querySelector('.form-wrapper');
let successBox = document.querySelector('.success-box');
let loaderBox = document.querySelector('.loader-box');
let form = formWrapper.querySelector('.form');
let button = form.querySelector('.form__button');
let counter = form.querySelector('.form__counter');
let inputs = form.querySelectorAll('.required');
let textarea = form.querySelector('.form__textaria');
form.addEventListener('submit', handleSubmit);
form.addEventListener('input', handleInput);
textarea.addEventListener('input', handleCounter);
successBox.addEventListener('click', handleCloseSuccess);

function submitOpen() {
    let result = Array.from(inputs).filter(
        (elem) => elem.dataset.valid === 'true'
    );
    if (result.length > 4) {
        button.removeAttribute('disabled');
        button.classList.add('success');
    }
}

function handleInput(e) {
    if (e.target.classList.contains('required')) {
        inputCheck(e.target);
        submitOpen();
    }
}

function inputCheck(element) {
    if (
        !element.classList.contains('required-select') &&
        element.type !== 'checkbox'
    ) {
        let value = element.value.trim();
        let regExp = new RegExp(element.getAttribute('data-reg'));

        if (regExp.test(value)) {
            element.classList.remove('error');
            element.classList.add('success');
            element.setAttribute('data-valid', true);
        }
        if (!regExp.test(value)) {
            element.classList.remove('success');
            element.classList.add('error');
            element.setAttribute('data-valid', false);
        }
    } else {
        element.classList.add('success');
        element.setAttribute('data-valid', true);
    }
    if (element.classList.contains('rules__input') && element.checked) {
        console.log(element);
        element.setAttribute('data-valid', true);
    }
}

async function handleSubmit(e) {
    e.preventDefault();

    let data = serializeForm(inputs);
    loaderFn();
    let response = await fetchUsers(data);
    if (response.ok) {
        form.reset();
        counter.innerText = '1000/1000';
        successFetch();
    }
}

function serializeForm(formNode) {
    const data = [];

    Array.from(formNode).forEach((element) => {
        if (element.classList.contains('rules__input')) {
            data.push({ [element.dataset.name]: element.checked });
        } else {
            data.push({ [element.name]: element.value });
        }
    });

    data.push({ [textarea.dataset.name]: textarea.value });

    return data;
}

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

function handleCounter() {
    let count = textarea.maxLength - textarea.value.length;
    counter.innerText = `${count}/1000`;
}

function loaderFn() {
    formWrapper.classList.remove('active');
    loaderBox.classList.add('active');
}

function successFetch() {
    loaderBox.classList.remove('active');
    successBox.classList.add('active');
}

function handleCloseSuccess() {
    successBox.classList.remove('active');
    formWrapper.classList.add('active');
}
