let form = document.querySelector('#form');
form.addEventListener('submit', handleSubmit);

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

function addErrorClass(element) {
    let parent = element.parentNode;
    parent.classList.add('error');
}

let mapTypeErrorMessage = {
    name: 'Введите имя',
    phone: 'Введите номер телефона',
    service: 'Выберете услугу',
};

function alertMessage(element) {
    addErrorClass(element);
    let parentDiv = element.closest('div');
    let alert = document.createElement('span');
    alert.setAttribute('id', 'errorSpan');
    alert.textContent = `${mapTypeErrorMessage[element.name]}`;
    parentDiv.appendChild(alert);
}

function removeError(element) {
    let parentDiv = element.closest('div');
    let parent = element.parentNode;
    let span = parentDiv.querySelector('#errorSpan');
    parent.classList.remove('error');
    span?.remove();
}

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
            alertMessage(element);
        }
        if (element.tagName === 'SELECT' && !element.value.trim()) {
            result = true;
            alertMessage(element);
        }
        if (element.type === 'checkbox' && !element.checked) {
            result = true;
            addErrorClass(element);
        }
    });
    return result;
}

async function handleSubmit(e) {
    e.preventDefault();
    if (!validate(e.target)) {
        let data = serializeForm(e.target);
        // loader();
        let response = await fetchUsers(data);
        if (response.ok) {
            console.log(response);
        } else {
            // errorFetch();
        }
    }
}
