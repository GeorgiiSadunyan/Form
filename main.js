document.addEventListener('DOMContentLoaded', function () {
  // Элементы
  const popup = document.getElementById('popup');
  const form = document.getElementById('feedbackForm');
  const openButton = document.querySelector('button');
  const closeButton = document.createElement('button');
  closeButton.innerText = 'Закрыть форму';

  // Проверяем, есть ли сохраненные данные формы в локальном хранилище
  const storedData = JSON.parse(localStorage.getItem('formData')) || {};
  for (const key in storedData) {
    if (Object.hasOwnProperty.call(storedData, key)) {
      const element = document.getElementById(key);
      if (element) {
        element.value = storedData[key];
      }
    }
  }

  // Функции
  function openForm() {
    // Показываем всплывающее окно
    popup.style.display = 'block';
    // Добавляем кнопку закрытия
    form.appendChild(closeButton);
    // Добавляем обработчик события закрытия для кнопки закрытия
    closeButton.addEventListener('click', closeForm);
    // Обновляем URL
    history.pushState(null, null, '#form');
  }

  function closeForm() {
    // Скрываем всплывающее окно
    popup.style.display = 'none';
    // Удаляем кнопку закрытия
    form.removeChild(closeButton);
    // Удаляем обработчик события закрытия для кнопки закрытия
    closeButton.removeEventListener('click', closeForm);
    // Обновляем URL
    history.pushState(null, null, window.location.pathname);
  }

  function submitForm(event) {
    event.preventDefault();

    const formData = {
      fullName: document.getElementById('fullName').value,
      email: document.getElementById('email').value,
      phone: document.getElementById('phone').value,
      organization: document.getElementById('organization').value,
      message: document.getElementById('message').value,
    };

    localStorage.setItem('formData', JSON.stringify(formData));

    fetch('https://formcarry.com/s/GL0myYCRBX', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then(response => {
        if (!response.ok) {
          form.reset();
          closeForm();
          alert('Форма успешно отправлена!');
        } else {
          alert('Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.'); //
        }
      })
      .catch(error => {
        console.error('Ошибка:', error);
        alert('Ошибка при отправке формы. Пожалуйста, попробуйте еще раз.');
      });
  }

  // Добавляем обработчик события для кнопки открытия
  openButton.addEventListener('click', openForm);

  // Добавляем обработчик события для отправки формы
  form.addEventListener('submit', submitForm);

  // Обрабатываем нажатие кнопки "Назад" в браузере
  window.addEventListener('popstate', function (event) {
    if (event.state === null) {
      closeForm();
    }
  });
});
