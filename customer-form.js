const orderItems = document.getElementById("orderItems");
const orderEmpty = document.getElementById("orderEmpty");
const orderItemCount = document.getElementById("orderItemCount");
const orderTotal = document.getElementById("orderTotal");
const customerForm = document.getElementById("customerForm");
const formSuccess = document.getElementById("formSuccess");
const fulfilment = document.getElementById("fulfilment");
const addressField = document.getElementById("addressField");
const addressInput = document.getElementById("address");

function formatMoney(value) {
  return `TZS ${Number(value).toLocaleString("en-TZ")}`;
}

function getOrder() {
  try {
    const savedOrder = JSON.parse(sessionStorage.getItem("machameOrder") || "[]");
    return Array.isArray(savedOrder) ? savedOrder : [];
  } catch {
    return [];
  }
}

function renderOrder() {
  const order = getOrder();
  const itemCount = order.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const total = order.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  orderItemCount.textContent = `${itemCount} ${itemCount === 1 ? "item" : "items"}`;
  orderTotal.textContent = formatMoney(total);
  orderEmpty.hidden = order.length !== 0;
  orderItems.innerHTML = order.map((item) => `
    <div class="order-line">
      <span>${item.quantity} × ${item.name} <small>${item.unit}</small></span>
      <span>${formatMoney(Number(item.price) * Number(item.quantity))}</span>
    </div>
  `).join("");
}

function updateAddressField() {
  const needsAddress = fulfilment.value === "delivery";
  addressField.hidden = !needsAddress;
  addressInput.required = needsAddress;
}

fulfilment.addEventListener("change", updateAddressField);
customerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = new FormData(customerForm).get("fullName").trim();
  formSuccess.textContent = `Thank you, ${name}. Your request is prepared. This demo does not send orders to the school yet.`;
  formSuccess.hidden = false;
  formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  sessionStorage.removeItem("machameOrder");
});

document.getElementById("year").textContent = new Date().getFullYear();
updateAddressField();
renderOrder();