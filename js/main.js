let form = document.querySelector('#form');
form.addEventListener('submit', handleSubmit);

//todo - функция принимает ноду и возвращает данные для отправки на сервер
function serializeForm(formNode) {
    const { elements } = formNode;
    const data = [];
    Array.from(elements)
        .filter((element) => !!element.name)
        .map((element) => {
            const { name, value } = element;
            if (element.type !== 'checkbox') {
                data.push({ [name]: value });
            }
        });
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

//todo - функция навешивает класс ошибки на родителя (fieldset) инпута
function addErrorClass(element) {
    let parent = element.parentNode;
    parent.classList.add('error');
}

//todo - мапер ошибок
let mapTypeErrorMessage = {
    name: 'Введите имя',
    phone: 'Введите номер телефона',
    service: 'Выберете услугу',
};

//todo - функция добавления сообщения об ошибке
function addAllAlertMessage(element, errorString) {
    addErrorClass(element);
    let parentDiv = element.closest('div');
    let alert = document.createElement('span');
    alert.setAttribute('id', 'errorSpan');
    if (errorString) {
        alert.textContent = `${errorString}`;
        parentDiv.appendChild(alert);
    }
    if (!errorString) {
        alert.textContent = `${mapTypeErrorMessage[element.name]}`;
        parentDiv.appendChild(alert);
    }
}

//todo - функция удаления данных об ошибки при каждом новом событии все затирается
function removeError(element) {
    let parentDiv = element.closest('div');
    let parent = element.parentNode;
    let span = parentDiv.querySelector('#errorSpan');
    parent.classList.remove('error');
    span?.remove();
}

//todo - функция валидации
function validate(formNode) {
    let result = false;
    Array.from(formNode).forEach((element) => {
        removeError(element);
        if (
            element.tagName === 'INPUT' &&
            element.type !== 'checkbox' &&
            !element.value.trim()
        ) {
            result = true;
            addAllAlertMessage(element);
        }
        if (
            element.tagName === 'INPUT' &&
            element.value.trim() &&
            element.dataset.length
        ) {
            if (
                element.value.length > element.dataset.length ||
                element.value.length < element.dataset.length
            ) {
                result = true;
                addAllAlertMessage(
                    element,
                    'Номер телефона должен состоять из 12 символов.'
                );
            }
        }
        if (element.tagName === 'SELECT' && !element.value.trim()) {
            result = true;
            addAllAlertMessage(element);
        }
        if (element.type === 'checkbox' && !element.checked) {
            result = true;
            addErrorClass(element);
        }
    });
    return result;
}

//todo - функция добавления лоадера на страницу
function loader() {
    let wrap = document.querySelector('.form-box_wrapper');
    Array.from(wrap.children).map((child) => {
        child.remove();
    });
    wrap.style.cssText = 'margin: 0; padding: 0';
    let loader = wrap.nextElementSibling;
    loader.style.cssText =
        'display: block; width: 100%; display: flex; flex-direction: column; gap: 20px; align-items: center; justify-content: center;';
}

//todo основной обработчик события
async function handleSubmit(e) {
    e.preventDefault();
    console.log(validate(e.target));
    if (!validate(e.target)) {
        let data = serializeForm(e.target);
        loader();
        let response = await fetchUsers(data);
        // if (response.ok) {
        //     successFetch();
        // } else {
        //     errorFetch();
        // }
    }
}
