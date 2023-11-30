const add = document.querySelector('.add')
const clear = document.querySelector('.clear')

const storage = JSON.parse(localStorage.getItem('users')) || {}

/**
 * Функция добавления слушателей на кнопки удаления и изменения
 * в карточке пользователя
 * @param {HTMLDivElement} userCard - карточка пользователя
 */
function setListeners(userCard) {
    const deleteBtn = userCard.querySelector('.delete')
    const changeBtn = userCard.querySelector('.change')

    const userEmail = deleteBtn.dataset.deleteUserEmail

    const newName = document.querySelector('#name')                 /// получили доступ
    const newSecondName = document.querySelector('#secondName')     /// получили доступ
    const newAge = document.querySelector('#age')                   /// получили доступ
    const newEmail = document.querySelector('#email')               /// получили доступ

    deleteBtn.addEventListener('click', () => {
        console.log(
            `%c Удаление пользователя ${userEmail} `,
            'background: red; color: white',
        )
        userCard.remove()                                           /// удаляем карточку из DOM на которую нажали 
        delete storage[userEmail]                                   /// удаляем данные из storage на которую нажали 
        localStorage.setItem('users', JSON.stringify(storage))      /// обновляем в local. Записываем новый storage
    })

    changeBtn.addEventListener('click', () => {
        console.log(
            `%c Изменение пользователя ${userEmail} `,
            'background: green; color: white',
        )
        const data = storage[userEmail]         // Записываем данные объекта storage по найденому userEmail  на которого нажали
        newName.value = data.name               // Записываем данные
        newSecondName.value = data.secondName   // Записываем данные 
        newAge.value = data.age                 // Записываем данные
        newEmail.value = data.email             // Записываем данные
    })
}

/**
 * Функция создания карточки пользователя
 * @param {Object} data - объект с данными пользователя
 * @param {string} data.name - имя пользователя
 * @param {string} data.secondName - фамилия пользователя
 * @param {string} data.email - email пользователя
 * @returns {string} - возвращает строку с разметкой карточки пользователя
 */
function createCard({ name, secondName, age, email}) {
    return `
        <div data-user=${email} class="user-outer">
            <div class="user-info">
                <p>${name}</p>
                <p>${secondName}</p>
                <p>${age}</p>
                <p class="email">${email}</p>
            </div>
            <div class="menu">
                <button data-delete-user-email=${email} class="delete">Удалить</button>
                <button data-change-user-email=${email} class="change">Изменить</button>
            </div>
        </div>
    `
}

/**
 * Функция перерисовки карточек пользователей при загрузке страницы
 * @param {Object} storage - объект с данными пользователей
 */
function rerenderCards(storage) {
    const users = document.querySelector('.users')

    if (!storage) {
        console.log('localStorage пустой')
        return
    }

    users.innerHTML = ''
    
    Object.keys(storage).forEach((email) => {
        const userData = storage[email]
        const userCard = document.createElement('div')
        userCard.className = 'user'
        userCard.dataset.email = email
        userCard.innerHTML = createCard(userData)
        users.append(userCard)
        setListeners(userCard)
    })
}

/**
 * Функция добавления карточки пользователя в список пользователей и в localStorage
 * @param {Event} e - событие клика по кнопке добавления
 */
function addCard(e) {
    e.preventDefault()
    const newName = document.querySelector('#name')
    const newSecondName = document.querySelector('#secondName')
    const newAge = document.querySelector('#age') 
    const newEmail = document.querySelector('#email')

    const users = document.querySelector('.users') // Получаем доступ к Users

    if (!newEmail.value 
        || !newName.value
        || !newSecondName.value
        || !newAge.value
    ) {
        resetInputs(newName, newSecondName, newEmail)
        return
    } 

    const allKey = Object.keys(storage)         // Записываем все ключи полученные из Local

    /*Пробегаемся по всем ключам и если наше значение из input равно значению ключ, 
    то получаем доступ к user у которого имеется атрибут data-email= "значение которое в input"  и удалем его */
    for (let i = 0; i < allKey.length; i++) {  
        if (newEmail.value === allKey[i]){
            const usersCardClear = document.querySelector(`.user[data-email="${newEmail.value}"]`)
            usersCardClear.remove()
        }
    }
    // Тут далее создается новая карточка с данными и добавляе
    const data = {
        name: newName.value,
        secondName: newSecondName.value,
        age: newAge.value, 
        email: newEmail.value,   
    }
    
    storage[newEmail.value] = data

    const userCard = document.createElement('div')
    userCard.className = 'user'
    userCard.dataset.email = newEmail.value
    userCard.innerHTML = createCard(data) // Добавляем карточку
    users.append(userCard)
    setListeners(userCard)

    // Добавление данных в localStorage
    localStorage.setItem('users', JSON.stringify(storage))
    resetInputs(newName, newSecondName, newAge, newEmail) 

    console.log(storage)
}

/**
 * Функция очистки полей ввода
 * @param {HTMLInputElement} inputs
 */
function resetInputs(...inputs) {
    inputs.forEach((input) => {
        input.value = ''
    })
}

// Функция очистки localStorage
function clearLocalStorage() {
    localStorage.removeItem('users')
    window.location.reload()
}

// Добавление слушателей на кнопки добавления и очистки
add.addEventListener('click', addCard)
clear.addEventListener('click', clearLocalStorage)

// При загрузке страницы перерисовываются карточки пользователей
window.addEventListener('load', () => {
    rerenderCards(JSON.parse(localStorage.getItem('users')))
})
