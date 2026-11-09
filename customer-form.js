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
      <span>${Number(item.quantity)} × ${escapeHtml(item.name)} <small>${escapeHtml(item.unit || "")}</small></span>
      <strong>${formatMoney(Number(item.price) * Number(item.quantity))}</strong>
    </div>
  `).join("");
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function updateAddressField() {
  const needsAddress = fulfilment.value === "delivery";
  addressField.hidden = !needsAddress;
  addressInput.required = needsAddress;
}

fulfilment.addEventListener("change", updateAddressField);
customerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!customerForm.reportValidity()) return;

  const formData = new FormData(customerForm);
  const name = String(formData.get("fullName")).trim();
  const provider = String(formData.get("paymentMethod"));
  const order = getOrder();
  const itemCount = order.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  formSuccess.innerHTML = `
    <strong>Demo complete — thank you, ${escapeHtml(name)}!</strong>
    <span>Your ${escapeHtml(provider)} payment was simulated successfully${itemCount ? ` for ${itemCount} ${itemCount === 1 ? "item" : "items"}` : ""}. No money was transferred and no order was sent to the school.</span>
    <span class="demo-reference">SIMULATION ONLY · NO REAL PAYMENT</span>
  `;
  formSuccess.hidden = false;
  formSuccess.scrollIntoView({ behavior: "smooth", block: "nearest" });
  sessionStorage.removeItem("machameOrder");
  renderOrder();
});

document.getElementById("year").textContent = new Date().getFullYear();
updateAddressField();
renderOrder();
