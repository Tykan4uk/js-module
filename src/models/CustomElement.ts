export interface CustomElement {
  tag: string;
  className: string;
  innerText?: string | undefined;
  onclick?: EventListenerOrEventListenerObject | undefined;
  value?: string | undefined;
  src?: string | undefined;
  alt?: string | undefined;
}