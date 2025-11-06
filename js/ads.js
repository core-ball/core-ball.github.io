// Ads Manager
(function () {
  "use strict";

  // Ad codes configuration - Thêm mã quảng cáo vào đây
  var adCodes = {
    "ad-banner-728x90": "", // Mã quảng cáo 728x90 (HTML/script)
    "ad-sidebar-left": "", // Mã quảng cáo 160x600 bên trái
    "ad-sidebar-right": "", // Mã quảng cáo 160x600 bên phải
  };

  // Create ad container
  function createAdContainer(id, width, height, adCode) {
    var adContainer = document.createElement("div");
    adContainer.id = id;
    adContainer.className = "ad-container";
    adContainer.style.width = width + "px";
    adContainer.style.height = height + "px";
    adContainer.style.margin = "20px auto";
    adContainer.style.display = "flex";
    adContainer.style.alignItems = "center";
    adContainer.style.justifyContent = "center";
    adContainer.style.backgroundColor = "rgba(10, 10, 10, 0.9)";
    adContainer.style.border = "2px solid rgba(0, 217, 255, 0.3)";
    adContainer.style.borderRadius = "8px";
    adContainer.style.overflow = "hidden";

    // Nếu có mã quảng cáo thì chèn vào, không thì hiển thị placeholder
    if (adCode && adCode.trim() !== "") {
      adContainer.innerHTML = adCode;
      // Nếu có script trong mã quảng cáo, chạy lại script
      var scripts = adContainer.getElementsByTagName("script");
      for (var i = 0; i < scripts.length; i++) {
        var newScript = document.createElement("script");
        if (scripts[i].src) {
          newScript.src = scripts[i].src;
        } else {
          newScript.textContent = scripts[i].textContent;
        }
        document.head.appendChild(newScript);
      }
    } else {
      // Placeholder text
      var placeholder = document.createElement("div");
      placeholder.className = "ad-placeholder";
      placeholder.textContent = "Advertisement " + width + "x" + height;
      placeholder.style.color = "rgba(255, 255, 255, 0.5)";
      placeholder.style.fontSize = "14px";
      placeholder.style.textAlign = "center";
      placeholder.style.padding = "10px";
      adContainer.appendChild(placeholder);
    }

    return adContainer;
  }

  // Initialize ads on page load
  function initAds() {
    // Banner ad 728x90 for index page and category pages
    var bannerAd = document.getElementById("ad-banner-728x90");
    if (bannerAd) {
      var adCode = adCodes["ad-banner-728x90"] || "";
      var adContainer = createAdContainer(
        "ad-container-728x90",
        728,
        90,
        adCode
      );
      bannerAd.appendChild(adContainer);
    }

    // Sidebar ads 160x600 for category pages
    var leftAd = document.getElementById("ad-sidebar-left");
    var rightAd = document.getElementById("ad-sidebar-right");

    if (leftAd) {
      var leftAdCode = adCodes["ad-sidebar-left"] || "";
      var leftContainer = createAdContainer(
        "ad-container-left",
        160,
        600,
        leftAdCode
      );
      leftContainer.style.position = "sticky";
      leftContainer.style.top = "80px";
      leftAd.appendChild(leftContainer);
    }

    if (rightAd) {
      var rightAdCode = adCodes["ad-sidebar-right"] || "";
      var rightContainer = createAdContainer(
        "ad-container-right",
        160,
        600,
        rightAdCode
      );
      rightContainer.style.position = "sticky";
      rightContainer.style.top = "80px";
      rightAd.appendChild(rightContainer);
    }
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAds);
  } else {
    initAds();
  }
})();
