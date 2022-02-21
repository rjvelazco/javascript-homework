const $codigo = document.getElementById("cod");
const $name = document.getElementById("name");
const $desc = document.getElementById("desc");
const $price = document.getElementById("price");
const $quantity = document.getElementById("quantity");
const $formRules = document.getElementById("form-rules");
// Records
const $totalProdutcs = document.getElementById("total-products");
const $stock = document.getElementById("stock");
const $quantityProducts = document.getElementById("quantity-products");
const $btnsSort = document.querySelectorAll(".btn-sort");

let editing = false;
let editItemCode = null;
let items = [];
let currentSortBy = "codigo";

const INITIAL_RECORD = {
  total: 0,
  quantity: 0,
  stock: 0,
};

let records = { ...INITIAL_RECORD };

const handlerSubmit = (e) => {
  e.preventDefault();
  const item = getFormItem();
  const codigoAlreadyExist = existCodigo(item.codigo);

  if (!isValid(item) || codigoAlreadyExist) {
    showErrors(codigoAlreadyExist, item.codigo);
    return;
  } else {
    $formRules.classList.add("hidden");
  }

  if (editing) {
    editItem(item);
    cleanEdit();
    cleanForm();
    return;
  }

  items.push(item);
  updateRecors(item);
  drawTable(items);
  drawRecords();
  cleanForm();
};

const drawTable = (items) => {
  records = { ...INITIAL_RECORD };
  str = "";

  sortBy(items, currentSortBy);
  if (!items.length) {
    str =
      "<tr><td colspan='6' class='text-center'>No hay items disponibles</td></tr>";
  }
  items.forEach((item) => {
    str += `<tr ${+item.quantity === 0 ? 'class="no-items"' : ""}>`;
    str += addItem(item);
    str += addButtons(item.codigo);
    str += "</tr>";
    updateRecors(item);
  });

  document.getElementById("listing").innerHTML = str;
  drawRecords();
};

const drawRecords = () => {
  $totalProdutcs.value = records.total;
  $stock.value = records.stock;
  $quantityProducts.value = records.quantity;
};

const addItem = (item) => {
  str = "";
  for (const key in item) {
    const value = item[key];
    const text = isNaN(value) ? value || "No hay descripcion." : +value;
    str += `<td ${key === "desc" ? 'class="td-description"' : ""}>${text}</td>`;
  }
  return str;
};

const addButtons = (id) => {
  return `<td class="buttons">
          <button class="btn btn-edit" onclick="setEditItem(${id})">
              Editar
          </button>
          <button class="btn btn-remove" onclick="removeItem(${id})">
              Borrar
          </button>
      </td>`;
};

const getFormItem = () => {
  return {
    codigo: $codigo.value,
    name: $name.value,
    desc: $desc.value,
    price: $price.value,
    quantity: $quantity.value,
  };
};

const getItem = (id) => {
  return items.find((item) => item.codigo == id);
};

const isValid = (item) => {
  const { codigo, name, price, quantity } = item;
  if (!codigo.length || !name.length || !price.length || !quantity.length) {
    return false;
  }

  if (isNaN(price) || isNaN(quantity) || isNaN(codigo) || !isNaN(name)) {
    return false;
  }

  return true;
};

const showErrors = (codigoError = false, codigo) => {
  if (codigoError) {
    alert("Ya existe un producto con el codigo: " + codigo);
  } else {
    $formRules.classList.remove("hidden");
  }
};

const existCodigo = (codigo = "") => {
  if (codigo === editItemCode) {
    return false;
  }

  const exist = items.some((item) => item.codigo === codigo);

  return exist;
};

const cleanForm = () => {
  $codigo.value = "";
  $name.value = "";
  $desc.value = "";
  $price.value = "";
  $quantity.value = "";
};

// Update Records
const updateRecors = (item) => {
  const { quantity, price } = item;
  records.quantity += +quantity;
  records.stock += +price * +quantity;
  records.total++;
};

// Events
const setEditItem = (id) => {
  const item = getItem(id);
  editing = true;
  editItemCode = item.codigo;
  $codigo.value = item.codigo;
  $name.value = item.name;
  $desc.value = item.desc;
  $price.value = item.price;
  $quantity.value = item.quantity;
  document.getElementById("cancel-edit").classList.remove("hidden");
  document.getElementById("cod").setAttribute("disabled", "true");
};

const editItem = (itemEdited) => {
  items = items.map((item) =>
    item.codigo != itemEdited.codigo ? item : itemEdited
  );
  drawTable(items);
};

const cancelEdit = () => {
  cleanEdit();
  cleanForm();
};

const cleanEdit = () => {
  document.getElementById("cancel-edit").classList.add("hidden");
  document.getElementById("cod").removeAttribute("disabled");
  editing = false;
  editItemCode = null;
};

const removeItem = (id) => {
  items = items.filter((item) => item.codigo != id);
  drawTable(items);
};

// Sort Table
const handlerSortClick = ({ target }) => {
  currentSortBy = target.getAttribute("data-key");

  for (let i = 0; i < $btnsSort.length; i++) {
    $btnsSort[i].classList.remove("active");
  }

  target.classList.add("active");

  drawTable(items);
};

const sortBy = (items, key) => {
  return items.sort((a, b) =>
    key === "name" ? sortByAlf(a, b) : sortByNumber(a, b, key)
  );
};

const sortByAlf = (a, b) => {
  if (a.name < b.name) {
    return -1;
  }
  if (a.name > b.name) {
    return 1;
  }

  return 0;
};

const sortByNumber = (a, b, key) => a[key] - b[key];

// Load Empty Message
drawTable(items);
