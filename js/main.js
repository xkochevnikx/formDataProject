let form = document.querySelector('#form');
form.addEventListener('submit', handleSubmit);

function serializeForm(formNode) {
    const { elements } = formNode;
    const data = [];
    Array.from(elements)
        .filter((item) => !!item.name)
        .map((element) => {
            const { name, type } = element;
            const value = type === 'checkbox' ? element.checked : element.value;
            data.push({ [name]: value });
        });
    return data;
}

async function handleSubmit(e) {
    e.preventDefault();
    let data = serializeForm(e.target);
}
