const hideAfter = 4000;
const transitionDelay = 150;
const hideDelay = 800;

const validators = {
    name: (val, _) => val.length > 0,
    surname: (val, _) => val.length > 0,
    email: (val, _) => {
        const pattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return pattern.test(val)
    },
    birthdate: (val, _) => {
        const pattern = /^\d{4}-\d{2}-\d{2}$/;
        return pattern.test(val)
    },
    password: (val, _) => {
        const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return pattern.test(val)
    },
    confirmPassword: (val, form) => val === form.elements['password'].value,
    description: (val, _) => val.length >= 10,
};

// client-side routing imao
const push = elem => {
    switch (elem.id) {
        case 'linkToRegister':
            document.getElementById('tableWrapper').classList.add('hidden');
            document.getElementById('tableWrapper').classList.remove('visible');
            document.getElementById('registerFormWrapper').classList.add('visible');
            document.getElementById('registerFormWrapper').classList.remove('hidden');
            document.getElementById('linkToRegister').classList.add('active');
            document.getElementById('linkToTable').classList.remove('active');
            break;
        case 'linkToTable':
            document.getElementById('registerFormWrapper').classList.remove('visible');
            document.getElementById('registerFormWrapper').classList.add('hidden');
            document.getElementById('tableWrapper').classList.remove('hidden');
            document.getElementById('tableWrapper').classList.add('visible');
            document.getElementById('linkToRegister').classList.remove('active');
            document.getElementById('linkToTable').classList.add('active');
            break;
        default:
            break;
    }
}


const makeVisible = elem => {
    elem.classList.add('is-invalid');
    elem.previousElementSibling.classList.add('visible');
    setTimeout(() => elem.previousElementSibling.classList.add('alert-visible'), transitionDelay);
    setTimeout(() => {
        elem.previousElementSibling.classList.remove('alert-visible');
        setTimeout(() => {
            elem.classList.remove('is-invalid');
            elem.previousElementSibling.classList.remove('visible');
        }, hideDelay);
    }, hideAfter);
}

const validateInput = (input, form) => {
    if (validators[input.id] && !validators[input.id](input.value, form)) {
        makeVisible(input);
        return false;
    }
    return true;
};

const addBlurEventListeners = form => {
    for (const elem of form.elements) {
        elem.onblur = () => {
            validateInput(elem, form);
        }
    }
}

const validateFields = form => {
    let errors = 0;
    let i = 0;
    for (const elem of form.elements) {
        if (!validateInput(elem, form))
            errors++;
    }
    if (errors === 0)
        return true;
    return false;
};

const showNotification = () => {
    const info = document.getElementById('alertSuccess');
    info.classList.add('visible');
    setTimeout(() => info.classList.add('alert-visible'), 150);
    setTimeout(() => info.classList.remove('alert-visible'), 3200);
    setTimeout(() => info.classList.remove('visible'), 4000);
};

const clearForm = form => {
    for (let elem of form.elements) {
        elem.value = '';
    }
    form.elements[form.elements.length - 1].value = 'Zarejestruj się';
};

const submitForm = form => {
    console.log('post request');
    showNotification();
    clearForm(form);
};

const cancelEditable = cell => {
    const input = cell.children[0];
    cell.innerText = input.value;
    cell.classList.remove('editable');
};

const makeEditable = cell => {
    if (!cell.classList.contains('editable')) {
        let input = document.createElement('input');
        input.type = 'text';
        input.value = cell.innerText;
        cell.innerText = '';
        input.addEventListener('blur', () => cancelEditable(cell));
        input.addEventListener('keyup', event => {
            if (event.keyCode === 13 || event.keyCode === 27) {   // enter or ESC
                cancelEditable(cell);
            }
        });
        input.classList.add('table-input');
        if (cell.parentElement.classList.contains('gray'))
            input.classList.add('gray');
        cell.appendChild(input);
        cell.classList.add('editable');
        input.focus();
    }
};

const recolour = table => {
    for (let i = 1; i < table.childElementCount; i++) {
        let row = table.children[i];
        row.classList.remove('gray');
        if (i % 2 == 0)
            row.classList.add('gray');
    }
};

const removeRow = (table, row) => {
    table.removeChild(row);
    recolour(table);
}


const addRow = table => {
    const numOfRows = table.childElementCount - 1;
    let row = document.createElement('tr');
    table.appendChild(row);
    for (let i = 0; i < 4; i++) {
        let cell = document.createElement('td');
        cell.addEventListener('click', () => makeEditable(cell));
        cell.innerText = 'Sample data';
        row.appendChild(cell);
    }
    let cell = document.createElement('td');
    let deleteButton = document.createElement('button');
    const src = './assets/delete-icon.svg';
    deleteButton.innerHTML = `<img src="${src}"/>`;
    deleteButton.children[0].classList.add('svg-filter');
    deleteButton.classList.add('centered', 'btn', 'btn-danger');
    deleteButton.addEventListener('click', () => removeRow(table, row))
    cell.appendChild(deleteButton);
    row.appendChild(cell);
    recolour(table);
};


const createTable = () => {
    let root = document.getElementById('tableWrapper');
    let table = document.createElement('table');
    table.classList.add('table', 'table-bordered');
    root.appendChild(table);
    let thead = document.createElement('thead');
    for (let i = 0; i < 4; i++) {
        let th = document.createElement('th')
        th.innerText = `Col ${i + 1}`;
        thead.appendChild(th);
    };
    table.appendChild(thead);
    for (let i = 0; i < 3; i++) {
        addRow(table);
    }
    let button = document.createElement('button');
    button.classList.add('btn', 'btn-secondary', 'float-right');
    button.innerText = 'Dodaj wiersz';
    button.addEventListener('click', () => addRow(table));
    root.appendChild(button);
};

window.onload = () => {

    const registerForm = document.getElementById('registerForm');

    addBlurEventListeners(registerForm);

    registerForm.onsubmit = event => {
        event.preventDefault();
        if (validateFields(registerForm)) {
            submitForm(registerForm);
        };
    };

    createTable();

}

