'use strict';

(function(){
  const init = () => {
    fetch('source.json')
      .then(res => res.json())
      .then(res => {
        initSortButtons(res);
        printTable(res);
      })
  };

  const printTable = res => {
    const titles = document.querySelectorAll('th');

    const tableContent = res.reduce((list, item) => {
      let itemsElement = '';
      titles.forEach(title =>
        itemsElement += `<td>${item[title.getAttribute('data-sort-by')] || ''}</td>`
      );

      return (
        `${list}
        <tr>
          ${itemsElement}
        </tr>`
      )
    }, '');

    document.querySelector('#table tbody').innerHTML = tableContent;
  };

  const initSortButtons = (list) => {
    const titleButtons = document.querySelectorAll('th');

    titleButtons.forEach(elem =>
      elem.addEventListener('click', () => sort(list, elem))
    );
  };

  const formatDate = date => {
    const nDate = date.split('/');

    return new Date(nDate[2], nDate[1] - 1, nDate[0]);
  };

  const sortCallback = {
    date: (comp1, comp2) => {
      if(!comp1 && !comp2) return 0;
      if(!comp2) return 1;
      if(!comp1) return -1;

      return formatDate(comp1) - formatDate(comp2);
    },
    number: (comp1, comp2) => Number(comp1) - Number(comp2),
    string: (comp1, comp2) => {
      if (comp1.toLowerCase() < comp2.toLowerCase()) {
        return -1;
      }
      if (comp1.toLowerCase() > comp2.toLowerCase()) {
        return 1;
      }

      return 0;
    }
  };

  const sort = (list, elem) => {
    const sortBy = elem.getAttribute('data-sort-by');
    const type = elem.getAttribute('data-type');
    const order = elem.getAttribute('data-order');
    let nOrder = 'DESC';

    if (!order || order === 'DESC') {
      nOrder = 'ASC';
    }

    elem.setAttribute('data-order', nOrder);

    const newList = list.map(row => {
      if(!row[sortBy]) {
        row[sortBy] = '';
      }

      return row;
    }).sort((a, b) => {
      let comp1 = a[sortBy];
      let comp2 = b[sortBy];

      if(nOrder === 'DESC') {
        comp1 = b[sortBy];
        comp2 = a[sortBy];
      }

      return sortCallback[type](comp1, comp2);
    });

    printTable(newList);
  };

  init();
})();
