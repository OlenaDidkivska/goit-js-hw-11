class Pagination {
  constructor({
    currentPage = 1,
    totalPages = 1,
    containerSelector = 'body',
    onPageChange,
  }) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.container = document.querySelector(containerSelector);
    this.onPageChange = onPageChange;
  }

  init() {
    this.render();
    this.setEvents();
  }

  render() {
    let itemsTemplate = '';
    for (let i = 1; i <= this.totalPages; i += 1) {
      const template = `
            <li data-page="${i}" class="page-item ${
        i === this.currentPage ? 'active' : ''
      }">
                <a class="page-link" href="#">${i}</a>
            </li>
            `;

      itemsTemplate += template;
    }

    const fullPaginationTemplate = `
        <ul class="pagination">
            ${itemsTemplate}
        </ul>
        `;

    this.container.insertAdjacentHTML('afterbegin', fullPaginationTemplate);
  }
}

export default Pagination;
