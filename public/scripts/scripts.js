/*** General Helpers ***/
const createElement = (el, attr= {}, text ='') => {
  const element = document.createElement(el);
  for ( let prop in attr) {
    element[prop] = attr[prop];
  }
  element.textContent = text;

  return element;
}

const appendChildren = (parent, ...children) => {
  children.forEach(child => parent.appendChild(child));
}


const createSearchForm = () => {
  const form = createElement(
    'form',
    { 
      'action': "#",
      'method': 'get'
    }
  );

  const searchInput = createElement(
    'input', 
    {
      'type': 'search',
      'id': 'search-input',
      'placeholder': 'Search books..' 
    }
  );
  const searchSubmit = createElement(
    'input',
    {
      'type': 'submit',
      'value': 'Search',
      'id': 'search-submit'
    }
  );

  appendChildren(form, searchInput, searchSubmit);
  document.querySelector('.search-container').appendChild(form);

  // form.addEventListener('submit', filterHandler);
  // searchInput.addEventListener('keyup', filterHandler);
};

createSearchForm();