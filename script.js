let once = false;
let counterReset = document.createElement('style');
let defaultType = 'hebrew';
let items = [];

const rootNode = document.querySelector('body');
const countInput = document.querySelector('#count');
const offsetInput = document.querySelector('#offset');
const hideBtn = document.querySelector('#hide');
const showBtn = document.querySelector('#show');
const randBtn = document.querySelector('#rand');
const resetBtn = document.querySelector('#reset');
const counterTypeSelector = document.querySelector('#counterTypeSelector');
const status = document.querySelector('#status');

const counterTypes = ["decimal", "decimal-leading-zero", "arabic-indic", "armenian", "upper-armenian", "lower-armenian", "bengali", "cambodian", "khmer", "cjk-decimal", "devanagari", "georgian", "gujarati", "gurmukhi", "hebrew", "kannada", "lao", "malayalam", "mongolian", "myanmar", "oriya", "persian", "lower-roman", "upper-roman", "tamil", "telugu", "thai", "tibetan"]
counterTypes.map(type => {
  const option = document.createElement('option');
  option.value = type;
  option.innerHTML = type.toUpperCase();
  if (type == defaultType) {
    option.selected = true;
  }
  counterTypeSelector.appendChild(option)
});

const randomize = () => {
  return getItems().map((d, index) => Math.floor(Math.random() * getItems().length));
}

const createNode = () => {
  const el = document.createElement('label');
  const input = document.createElement('input')
  const span = document.createElement('span');
  input.type = 'checkbox';
  input.checked = true;
  input.addEventListener('click', () => count())
  el.appendChild(input);
  el.appendChild(span);
  return el;
}

const getNodes = () => {
  return Array.prototype.slice.call(items);
}

const getItems = () => {
  return getNodes().map(label => label.querySelector('input[type="checkbox"]'));
}

const resetGrid = (val) => {
  getItems().map((d, index) => d.checked = val || false);
  count();
  return val;
}

const destroyAll = () => {
  getNodes().map((d, index) => {
    rootNode.removeChild(d);
  });
  items = [];
}

const select = (values) => {
  resetGrid();
  values.map(r => getItems()[r].checked = r%2);
  count();
}

const count = () => {
  const current = getItems().filter((d, index) => d.checked);
  status.innerHTML = `${current.length}/${getItems().length}`;
}

const getOffsetInput = () => {
  return Number(offsetInput.value) - 1;
}

const getItemCounterValue = () => {
  return Number(countInput.value);
}

const resetCounter = (limit) => {
  // const offsetInput = getOffsetInput();
  counterReset.innerHTML = `body{counter-reset: my-counter ${limit}}`;
}

const onOffsetChange = () => {
  const offsetInput = getOffsetInput();
  const itemsCount = getItemCounterValue();

  if (itemsCount < offsetInput) {
    destroyAll();
    resetCounter(-1);
    return false;
  }

  destroyAll();
  resetCounter(getOffsetInput());
  render();
}

const onCountChange = () => {
  destroyAll();
  resetCounter();
  render();
}

const render = () => {
  const ln = getItemCounterValue() - getOffsetInput();

  if (ln < 0) {
    return resetGrid(false);
  }

  Array(ln).fill().map(i => {
    const el = createNode();
    items.push(el);
    document.body.appendChild(el);
  });

  count();
}

const onCounterTypeSelectorChange = (evt) => {
  document.styleSheets[1].rules[15].style.content = `counter(my-counter, ${evt.target.value})`
}

const onReset = (defaultType) => {
  destroyAll();
  reset(199, -4);
  resetCounter();
  render();
}

const reset = (count, offset) => {
  countInput.value = count;
  offsetInput.value = offset;
}

const getUrlParam = (name, url) => {
  if (!url) url = location.href;
  name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
  var regexS = "[\\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  return results == null ? null : results[1];
}

hideBtn.addEventListener('click', (evt) => resetGrid(false));
showBtn.addEventListener('click', (evt) => resetGrid(true));
randBtn.addEventListener('click', (evt) => select(randomize()));
resetBtn.addEventListener('click', (evt) => onReset())
countInput.addEventListener('change', (evt) => onCountChange())
offsetInput.addEventListener('change', (evt) => onOffsetChange())
counterTypeSelector.addEventListener('change', (evt) => onCounterTypeSelectorChange(evt))

document.body.appendChild(counterReset);

const startAt = Number(getUrlParam('startAt'));
const endAt = Number(getUrlParam('endAt'));
const counterStyleType = getUrlParam('counterStyleType');

if (!once) {
  if (typeof startAt == 'number' && typeof endAt == 'number') {
    reset(endAt, startAt);
    resetCounter(startAt);
    render();
  }

  if (counterStyleType) {
    onCounterTypeSelectorChange({target: {value: counterStyleType}})
  }

  once = true;  
} else {
  resetCounter();
  render();
  select(randomize());
}