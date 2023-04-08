import { createElement } from "./helpers/htmlHelpers";
import { Track } from "./models/Track";
import { tracksService } from "./services/trackService";

const getMusicList = async (page = 1) => {
  const pageSize = +(document.querySelector<HTMLSelectElement>('.page-size-dropdown')!.value ?? '10');

  document.getElementById('music-list-loader')!.style.display = 'block';

  const response = await tracksService.getListByPage(`${page}`, `${pageSize}`);

  document.getElementById('music-list-loader')!.style.display = 'none';

  if (response.total > 0) {
    let counter = (page - 1) * pageSize + 1;

    document.querySelector<HTMLElement>('.list-header')!.style.display = 'flex';

    document.querySelector<HTMLElement>('.music-list')!.style.display = 'flex';

    response.tracks.forEach(track => {
      addListElement(track, counter);

      counter++;
    });

    const maxPage = Math.ceil(response.total / pageSize);

    document.querySelector<HTMLElement>('.pagination')!.style.display = 'flex';

    addPagination(page, maxPage);
  } else {
    document.getElementById('music-list-warning')!.style.display = 'flex';
  }
}

const getPage = async (page: number) => {
  const pageSize = +(document.querySelector<HTMLSelectElement>('.page-size-dropdown')!.value ?? '10');
  document.querySelector('.music-list')!.innerHTML = '';
  document.querySelector<HTMLElement>('#music-list-inner-loader')!.style.display = 'flex';

  const response = await tracksService.getListByPage(`${page}`, `${pageSize}`);

  document.querySelector<HTMLElement>('#music-list-inner-loader')!.style.display = 'none';
  document.querySelector('.pagination-pages')!.innerHTML = '<span class="pagination-page">Page</span>';

  if (response.total > 0) {
    let counter = (page - 1) * pageSize + 1;

    response.tracks.forEach(track => {
      addListElement(track, counter);

      counter++;
    });

    const maxPage = Math.ceil(response.total / pageSize);

    addPagination(page, maxPage);
  } else {
    document.getElementById('music-list-warning')!.style.display = 'flex';
  }
}

const addListElement = (track: Track, number: number) => {
  const listItem = createElement({
    tag: 'div',
    className: 'music-list-item'
  });

  const numberSpan = createElement({
    tag: 'span',
    className: 'music-list-item-number',
    innerText: `${number}.`
  });

  const authorSpan = createElement({
    tag: 'span',
    className: 'music-list-item-author',
    innerText: track.singer
  });

  const titleSpan = createElement({
    tag: 'span',
    className: 'music-list-item-title',
    innerText: track.title
  });

  const genreSpan = createElement({
    tag: 'span',
    className: 'music-list-item-genre',
    innerText: track.genre
  });

  const playButton = createElement({
    tag: 'div',
    className: 'music-list-item-play-button'
  });

  const playIcon = createElement({
    tag: 'span',
    className: 'music-list-item-play-button-play',
    innerText: '▶'
  });

  playButton.append(playIcon);

  const checkButton = createElement({
    tag: 'div',
    className: 'music-list-item-check-button',
    innerText: 'Need check'
  });

  listItem.append(numberSpan, authorSpan, titleSpan, genreSpan, playButton, checkButton);

  document.querySelector('.music-list')!.append(listItem);
}

const addPagination = (page: number, maxPage: number) => {
  if (page !== 1) {
    addBeforeArrows(page)
  }

  if (maxPage < 8) {
    for (let i = 1; i <= maxPage; i++) {
      addPaginationElement(i, (i === page));
    }
  } else {
    if (page > 5) {
      addPaginationElement(1);
      addPaginationDotes();
      addPaginationElement(page - 2);
      addPaginationElement(page - 1);
      addPaginationElement(page, true);

      if (page <= (maxPage - 5)) {
        addPaginationElement(page + 1);
        addPaginationElement(page + 2);
        addPaginationDotes();
        addPaginationElement(maxPage);
      }

      if (page > (maxPage - 5)) {
        for (let i = page + 1; i <= maxPage; i++) {
          addPaginationElement(i, (i === page));
        }
      }
    } else {
      for (let i = 1; i < 8; i++) {
        addPaginationElement(i, (i === page))
      }
      addPaginationDotes();
      addPaginationElement(maxPage);
    }
  }

  if (page !== maxPage) {
    addAfterArrows(page, maxPage);
  }
}

const addPaginationElement = (number: number, isActive = false) => {
  const element = createElement({
    tag: 'span',
    className: isActive ? 'pagination-page-active' : 'pagination-page-button',
    innerText: `${number}`,
    onclick: isActive ? undefined : () => { getPage(number); }
  });

  document.querySelector('.pagination-pages')!.append(element);
}

const addBeforeArrows = (currentPage: number) => {
  const firstPage = createElement({
    tag: 'span',
    className: 'pagination-page-first',
    innerText: '«',
    onclick: () => { getPage(1); }
  });

  const prevPage = createElement({
    tag: 'span',
    className: 'pagination-page-prev',
    innerText: '‹',
    onclick: () => { getPage(currentPage - 1); }
  });

  document.querySelector('.pagination-pages')!.append(firstPage, prevPage);
}

const addAfterArrows = (currentPage: number, maxPage: number) => {
  const nextPage = createElement({
    tag: 'span',
    className: 'pagination-page-next',
    innerText: '›',
    onclick: () => { getPage(currentPage + 1); }
  });

  const lastPage = createElement({
    tag: 'span',
    className: 'pagination-page-last',
    innerText: '»',
    onclick: () => { getPage(maxPage); }
  });

  document.querySelector('.pagination-pages')!.append(nextPage, lastPage);
}

const addPaginationDotes = () => {
  const paginationDotes = createElement({
    tag: 'span',
    className: 'pagination-page-dotes',
    innerText: '...'
  });

  document.querySelector('.pagination-pages')!.append(paginationDotes);
}

getMusicList();
document.querySelector('.page-size-dropdown')!.addEventListener('change', () => getPage(1));