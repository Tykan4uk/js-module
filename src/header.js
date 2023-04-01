const header = `
  <div class="navigation-items">
    <div class="header-logo"></div>
    <a
      href="./index.html"
      class="navigation-item"
      id="navigation-music-list"
    >Music list</a>
    <a
      href="./uploading.html"
      class="navigation-item"
      id="navigation-uploading"
    >Uploading</a>
  </div>
  <div
    class="registration-items">
    <a
      href="#"
      class="registration-item"
    >Log in</a>
    <a
      href="#"
      class="registration-item"
    >Sign in</a>
  </div>
`;

document.querySelector(".header").innerHTML = header;