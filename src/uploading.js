class dropDownService {
  static genres;

  static getGenres = async () => {
    let result;

    if (this.genres === undefined) {
      const response = await fetch('https://musicality-api.azurewebsites.net/DropDown/GetGenres').catch(() => { });

      result = (response?.ok ?? false) ? await response.json() : undefined;

      this.genres = result;
    } else {
      result = this.genres;
    }

    return result
  }
}

const items = [];

const dropHandler = (event) => {
  event.preventDefault();

  if (event.dataTransfer.items) {
    [...event.dataTransfer.items].forEach(item => {
      if (item.type.startsWith('audio') && items.length < 10) {
        const file = item.getAsFile();
        items.push(file);
        addUploadItem(file.name);
      }

      if (items.length === 10) {
        document.querySelector('.drop_zone').style.display = 'none';
      }
    });
  };
}

const dragOverHandler = (event) => {
  event.preventDefault();
}

const clickHandler = (event) => {
  if (event.target.files) {
    [...event.target.files].forEach(file => {
      if (file.type.startsWith('audio') && items.length < 10) {
        items.push(file);
        addUploadItem(file.name);
      }

      if (items.length === 10) {
        document.querySelector('.drop_zone').style.display = 'none';
      }
    });
  };
}

const createElement = ({ tag, className, innerText, onclick, value, src, alt }) => {
  const element = document.createElement(tag);
  element.className = className;
  element.innerText = innerText ?? '';
  if (onclick !== undefined)
    element.addEventListener("click", onclick);
  if (value !== undefined)
    element.value = value;
  if (src !== undefined)
    element.src = src;
  if (alt !== undefined)
    element.alt = alt;

  return element;
}

const addUploadItem = (name) => {
  const listItem = createElement({
    tag: 'div',
    className: 'upload-list-item'
  });

  const itemRemove = createElement({
    tag: 'div',
    className: 'upload-list-item-remove',
    innerText: '×',
    onclick: removeUploadItem
  });

  const itemImg = createElement({
    tag: 'img',
    className: 'upload-list-item-img',
    src: './src/images/file.png',
    alt: 'file'
  });

  const itemName = createElement({
    tag: 'span',
    className: 'upload-list-item-name',
    innerText: name
  });

  const itemDropDown = createElement({
    tag: 'select',
    className: 'upload-list-genre-dropdown'
  });

  fillGenresDropDown(itemDropDown);

  listItem.append(itemRemove, itemImg, itemName, itemDropDown);

  document.querySelector('.upload-list').append(listItem);
  document.querySelector('.send-button').style.display = 'flex';
  document.querySelector('.send-result').style.display = 'none';
}

const fillGenresDropDown = async (element) => {
  const genres = await dropDownService.getGenres();

  genres.forEach(genre => {
    const option = createElement({
      tag: 'option',
      value: genre.id,
      innerText: genre.genre
    });

    element.append(option);
  })
}

const removeUploadItem = (event) => {
  event.target.parentElement.remove();

  const name = event.target.parentElement.querySelector('.upload-list-item-name').innerText;

  const removeItem = items.findIndex(item => item.name === name);

  items.splice(removeItem, 1);

  if (items.length < 10) {
    document.querySelector('.drop_zone').style.display = 'flex';
  }

  if (items.length === 0) {
    document.querySelector('.send-button').style.display = 'none';
  }

  document.querySelector('.send-button').style.backgroundColor = '#ebebeb';
  document.querySelector('.send-button').style.color = '#000';
}

const sendFiles = async () => {
  document.querySelector('.send-button').style.display = 'none';
  document.querySelector('#send-loader').style.display = 'flex';

  const data = new FormData();
  items.forEach(item => {
    const genreElement = [...document.querySelectorAll('.upload-list-genre-dropdown')]
      .find(element => element.parentElement.querySelector('.upload-list-item-name').innerText === item.name);
    const namedFile = new File([item], `${genreElement.value}.${item.name}`, {
      type: item.type,
      lastModified: item.lastModified,
    })
    data.append('file', namedFile);
  });

  const response = await fetch('https://musicality-api.azurewebsites.net/AudioRedactor/CutFilesFromWeb', {
    method: 'POST',
    mode: 'cors',
    body: data
  }).catch(() => { });

  document.querySelector('#send-loader').style.display = 'none';

  if (response?.ok ?? false) {
    items.length = 0;
    document.querySelector('.upload-list').innerHTML = '';
    document.querySelector('.drop_zone').style.display = 'flex';
    document.querySelector('.send-button').style.backgroundColor = '#ebebeb';
    document.querySelector('.send-button').style.color = '#000';
    document.querySelector('.send-result').style.display = 'flex';
  } else {
    document.querySelector('.send-button').style.display = 'flex';
    document.querySelector('.send-button').style.backgroundColor = '#dc0007';
    document.querySelector('.send-button').style.color = '#fff';
  }
}