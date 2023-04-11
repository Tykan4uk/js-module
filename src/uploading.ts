import { createElement } from "./helpers/htmlHelpers";
import { dropDownService } from "./services/dropDownService";

const items: any[] = [];

const dropHandler = (event: any) => {
  event.preventDefault();

  if (event.dataTransfer.items) {
    [...event.dataTransfer.items].forEach(item => {
      if (item.type.startsWith('audio') && items.length < 10) {
        const file = item.getAsFile();
        items.push(file);
        addUploadItem(file.name);
      }

      if (items.length === 10) {
        document.querySelector<HTMLElement>('.drop_zone')!.style.display = 'none';;
      }
    });
  };
}

const dragOverHandler = (event: any) => {
  event.preventDefault();
}

const clickHandler = (event: any) => {
  if (event.target.files) {
    [...event.target.files].forEach(file => {
      if (file.type.startsWith('audio') && items.length < 10) {
        items.push(file);
        addUploadItem(file.name);
      }

      if (items.length === 10) {
        document.querySelector<HTMLElement>('.drop_zone')!.style.display = 'none';;
      }
    });
  };
}

const addUploadItem = (name: string) => {
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

  document.querySelector('.upload-list')!.append(listItem);
  document.querySelector<HTMLElement>('.send-button')!.style.display = 'flex';
  document.querySelector<HTMLElement>('.send-result')!.style.display = 'none';
}

const fillGenresDropDown = async (element: Element) => {
  const genres = await dropDownService.getGenres();

  genres?.forEach(genre => {
    const option = createElement({
      tag: 'option',
      value: `${genre.id}`,
      innerText: genre.genre,
      className: ''
    });

    element.append(option);
  })
}

const removeUploadItem = (event: any) => {
  event.target.parentElement.remove();

  const name = event.target.parentElement.querySelector('.upload-list-item-name').innerText;

  const removeItem = items.findIndex(item => item.name === name);

  items.splice(removeItem, 1);

  if (items.length < 10) {
    document.querySelector<HTMLElement>('.drop_zone')!.style.display = 'flex';
  }

  if (items.length === 0) {
    document.querySelector<HTMLElement>('.send-button')!.style.display = 'none';
  }

  document.querySelector<HTMLElement>('.send-button')!.style.display = '#ebebeb';
  document.querySelector<HTMLElement>('.send-button')!.style.display = '#000';
}

const sendFiles = async () => {
  document.querySelector<HTMLElement>('.send-button')!.style.display = 'none';
  document.querySelector<HTMLElement>('#send-loader')!.style.display = 'flex';

  const data = new FormData();
  items.forEach(item => {
    const genreElement = [...document.querySelectorAll<HTMLSelectElement>('.upload-list-genre-dropdown')]
      .find(element => element.parentElement!.querySelector('.upload-list-item-name')!.innerHTML === item.name);
    const namedFile = new File([item], `${genreElement?.value}.${item.name}`, {
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

  document.querySelector<HTMLElement>('#send-loader')!.style.display = 'none';

  if (response?.ok ?? false) {
    items.length = 0;
    document.querySelector('.upload-list')!.innerHTML = '';
    document.querySelector<HTMLElement>('.drop_zone')!.style.display = 'flex';
    document.querySelector<HTMLElement>('.send-button')!.style.backgroundColor = '#ebebeb';
    document.querySelector<HTMLElement>('.send-button')!.style.color = '#000';
    document.querySelector<HTMLElement>('.send-result')!.style.display = 'flex';
  } else {
    document.querySelector<HTMLElement>('.send-button')!.style.display = 'flex';
    document.querySelector<HTMLElement>('.send-button')!.style.backgroundColor = '#dc0007';
    document.querySelector<HTMLElement>('.send-button')!.style.color = '#fff';
  }
}

document.querySelector('.drop_zone')!.addEventListener('drop', dropHandler);
document.querySelector('.drop_zone')!.addEventListener('dragover', dragOverHandler);
document.querySelector('.drop_zone')!.addEventListener('change', clickHandler);
document.querySelector('.send-button')!.addEventListener('click', sendFiles);
dropDownService.getGenres();
document.getElementById('navigation-uploading')!.className = 'navigation-item-active';