function playGame() {
  var url = document.querySelector("#playButton").dataset.src;
  var html = `<iframe src="${url}" style="width:100%;height:100%" frameborder="0" id="gameframe"></iframe>`;
  document.querySelector(".game-play").innerHTML = html;
}
function open_fullscreen() {
  let game = document.getElementById("gameframe");
  if (game.requestFullscreen) {
    game.requestFullscreen();
  } else if (game.mozRequestFullScreen) {
    /* Firefox */
    game.mozRequestFullScreen();
  } else if (game.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    game.webkitRequestFullscreen();
  } else if (game.msRequestFullscreen) {
    /* IE/Edge */
    game.msRequestFullscreen();
  }
}

// ==============================
// Modal game launcher
// ==============================

// Debounce function for performance
function debounce(func, wait) {
  var timeout;
  return function executedFunction() {
    var context = this;
    var args = arguments;
    var later = function () {
      timeout = null;
      func.apply(context, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Use passive event listeners for better performance
document.addEventListener("DOMContentLoaded", function () {
  // Delegate clicks on game items (home + category) to open modal instead of navigating
  document.addEventListener(
    "click",
    function (e) {
      var anchor = e.target.closest(
        ".list-game .game-item a, .list-item a.item"
      );
      if (anchor) {
        e.preventDefault();
        var url = anchor.getAttribute("href");
        var titleNode = anchor.querySelector(".recommend-title, .heading-game");
        var title = titleNode
          ? titleNode.textContent.trim()
          : anchor.getAttribute("title") || "Game";
        openGameModal(url, title);
      }
    },
    { passive: false }
  );
});

function openGameModal(url, title) {
  // Create modal if not exists
  var modal = document.getElementById("game-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "game-modal";
    modal.className = "game-modal";
    modal.innerHTML =
      "" +
      '<div class="game-modal__dialog" role="dialog" aria-modal="true" aria-label="Game dialog">' +
      '<div class="game-modal__header" id="game-modal-header">' +
      '<h2 class="game-modal__title" id="game-modal-title"></h2>' +
      '<div class="game-modal__controls">' +
      '<button type="button" class="game-modal__btn" id="game-btn-full">⛶ Fullscreen</button>' +
      '<button type="button" class="game-modal__btn game-modal__btn--close" id="game-btn-close">✕ Close</button>' +
      "</div>" +
      "</div>" +
      '<div class="game-modal__body">' +
      '<iframe class="game-modal__iframe" id="game-iframe-modal" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock" allow="fullscreen; pointer-lock; autoplay; microphone; camera"></iframe>' +
      "</div>" +
      "</div>";
    document.body.appendChild(modal);
    // Close on overlay click
    modal.addEventListener("click", function (ev) {
      if (ev.target === modal) {
        closeGameModal();
      }
    });
    // ESC to close
    document.addEventListener("keydown", handleModalEsc);
    // Buttons
    modal
      .querySelector("#game-btn-close")
      .addEventListener("click", closeGameModal);
    modal
      .querySelector("#game-btn-full")
      .addEventListener("click", toggleModalFullscreen);
  }

  // Set title and src
  var titleEl = modal.querySelector("#game-modal-title");
  var frame = modal.querySelector("#game-iframe-modal");
  titleEl.textContent = title || "Game";
  frame.src = url;

  // Show modal
  modal.classList.add("show");
  document.body.classList.add("noScroll");
  // Focus iframe when loaded
  frame.onload = function () {
    try {
      frame.contentWindow && frame.contentWindow.focus();
    } catch (_) {}
  };
}

function closeGameModal() {
  var doClose = function () {
    var modal = document.getElementById("game-modal");
    if (modal) {
      var frame = modal.querySelector("#game-iframe-modal");
      if (frame) {
        frame.src = "about:blank";
      }
      modal.classList.remove("show");
    }
    // Always remove noScroll class
    document.body.classList.remove("noScroll");
    // Reset body position
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
  };

  try {
    var inFs =
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement ||
      document.msFullscreenElement;
    if (inFs) {
      var p;
      if (document.exitFullscreen) p = document.exitFullscreen();
      else if (document.webkitExitFullscreen)
        p = document.webkitExitFullscreen();
      else if (document.mozCancelFullScreen) p = document.mozCancelFullScreen();
      else if (document.msExitFullscreen) p = document.msExitFullscreen();

      if (p && typeof p.then === "function") {
        p.finally(doClose);
      } else {
        setTimeout(doClose, 50);
      }
      return;
    }
  } catch (e) {
    // ignore and proceed to close
  }

  doClose();
}

function handleModalEsc(e) {
  if (e.key === "Escape") {
    // If in fullscreen, just exit fullscreen; else close modal
    if (document.fullscreenElement) {
      document.exitFullscreen();
      return;
    }
    closeGameModal();
  }
}

function toggleModalFullscreen() {
  var dialog = document.querySelector("#game-modal .game-modal__dialog");
  if (!dialog) return;
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    dialog.requestFullscreen && dialog.requestFullscreen();
  }
}
