// Builds DOM nodes with textContent only, so user data can never be interpreted as HTML (no XSS).
export function el(tag, options = {}, children = []) {
  const { className, text, dataset, on, ...attributes } = options;
  const node = document.createElement(tag);

  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  Object.assign(node.dataset, dataset);
  Object.entries(attributes).forEach(([name, value]) => {
    if (value === undefined || value === false) return;
    node.setAttribute(name, value === true ? '' : value);
  });
  Object.entries(on ?? {}).forEach(([event, handler]) => node.addEventListener(event, handler));

  node.append(...children);
  return node;
}

export function showAlert(container, message, type = 'danger') {
  container.replaceChildren(
    el('div', { className: `alert alert-${type}`, role: 'alert', text: message }),
  );
}

export function clearAlert(container) {
  container.replaceChildren();
}

export function setBusy(button, isBusy, busyLabel = 'Patientez…') {
  if (isBusy) {
    button.dataset.label = button.textContent;
    button.textContent = busyLabel;
  } else if (button.dataset.label) {
    button.textContent = button.dataset.label;
  }
  button.disabled = isBusy;
}

export function describeError(error) {
  const details = error.details?.map((detail) => detail.message).join(' · ');
  return details ? `${error.message} : ${details}` : error.message;
}
