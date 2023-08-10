let form = document.querySelector('#form');

function serializeForm(formNode) {
    const { elements } = formNode;

    const data = Array.from(elements)
        .filter((item) => !!item.name)
        .map((element) => {
            const { name, value } = element;
            return { name, value };
        });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    serializeForm(form);
});
