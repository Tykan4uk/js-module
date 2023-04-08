import { CustomElement } from "../models/CustomElement";

export function createElement(customElement: CustomElement) {
  const element = document.createElement(customElement.tag);

  element.className = customElement.className;
  element.innerText = customElement.innerText ?? '';
  if (customElement.onclick !== null)
    element.addEventListener("click", customElement.onclick!);
  if (customElement.value !== null)
    element.setAttribute('value', customElement.value!);
  if (customElement.src !== null)
    element.setAttribute('src', customElement.src!);
  if (customElement.alt !== null)
    element.setAttribute('alt', customElement.alt!);

  return element;
}