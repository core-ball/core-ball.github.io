// Ads Manager
(function () {
  "use strict";

  // Ad codes configuration - Thêm mã quảng cáo vào đây
  var adCodes = {
    "ad-banner-728x90":
      '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9494070306900396" crossorigin="anonymous"></script><!-- Core-ball - ngang 728x90 --><ins class="adsbygoogle" style="display:inline-block;width:728px;height:90px" data-ad-client="ca-pub-9494070306900396" data-ad-slot="4133887981"></ins><script>(adsbygoogle = window.adsbygoogle || []).push({});</script>', // Mã quảng cáo 728x90 (HTML/script)
    "ad-sidebar-left": "", // Mã quảng cáo 160x600 bên trái
    "ad-sidebar-right": "", // Mã quảng cáo 160x600 bên phải
  };

  // Ad display conditions tracking
  var adConditions = {
    timeOnPage: false, // ≥ 15 giây
    scrolled: false, // ≥ 100px
    clicked: false, // ít nhất 1 click hoặc chạm
  };

  var pageLoadTime = Date.now();
  var maxScrollY = 0;
  var adContainers = [];

  // Check if all conditions are met
  function checkAdConditions() {
    return (
      adConditions.timeOnPage && adConditions.scrolled && adConditions.clicked
    );
  }

  // Show ads when all conditions are met
  function showAds() {
    if (checkAdConditions()) {
      adContainers.forEach(function (container) {
        if (container) {
          container.style.display = "flex";
          container.style.visibility = "visible";
          container.style.opacity = "1";
          // Load ad scripts when showing
          loadAdScripts(container);
        }
      });
    }
  }

  // Track time on page (≥ 15 seconds)
  function checkTimeOnPage() {
    var timeElapsed = (Date.now() - pageLoadTime) / 1000;
    if (timeElapsed >= 15) {
      adConditions.timeOnPage = true;
      showAds();
    } else {
      setTimeout(checkTimeOnPage, (15 - timeElapsed) * 1000);
    }
  }

  // Track scroll (≥ 100px)
  function handleScroll() {
    maxScrollY = Math.max(maxScrollY, window.scrollY || window.pageYOffset);
    if (maxScrollY >= 100 && !adConditions.scrolled) {
      adConditions.scrolled = true;
      showAds();
    }
  }

  // Track clicks/touches
  function handleUserInteraction() {
    if (!adConditions.clicked) {
      adConditions.clicked = true;
      showAds();
      // Remove listeners after first interaction
      document.removeEventListener("click", handleUserInteraction);
      document.removeEventListener("touchstart", handleUserInteraction);
    }
  }

  // Create ad container
  function createAdContainer(id, width, height, adCode) {
    var adContainer = document.createElement("div");
    adContainer.id = id;
    adContainer.className = "ad-container";
    adContainer.style.width = width + "px";
    adContainer.style.height = height + "px";
    adContainer.style.margin = "20px auto";
    adContainer.style.display = "none"; // Hidden initially
    adContainer.style.visibility = "hidden";
    adContainer.style.opacity = "0";
    adContainer.style.transition = "opacity 0.3s ease";
    adContainer.style.alignItems = "center";
    adContainer.style.justifyContent = "center";
    adContainer.style.backgroundColor = "rgba(10, 10, 10, 0.9)";
    adContainer.style.border = "2px solid rgba(0, 217, 255, 0.3)";
    adContainer.style.borderRadius = "8px";
    adContainer.style.overflow = "hidden";

    // Nếu có mã quảng cáo thì chèn vào, không thì hiển thị placeholder
    if (adCode && adCode.trim() !== "") {
      adContainer.innerHTML = adCode;
      // Nếu có script trong mã quảng cáo, chỉ chạy khi ads được hiển thị
      // Scripts will be loaded when ad is shown
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

  // Check if adsbygoogle script is already loaded
  function isAdsByGoogleLoaded() {
    var existingScript = document.querySelector(
      'script[src*="adsbygoogle.js"]'
    );
    return existingScript !== null;
  }

  // Initialize adsbygoogle array if not exists
  function initAdsByGoogleArray() {
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }
  }

  // Load adsbygoogle main script (only once, when ads are shown)
  function loadAdsByGoogleScript() {
    // Initialize array first
    initAdsByGoogleArray();

    // Check if script is already loaded
    if (isAdsByGoogleLoaded()) {
      return;
    }

    // Create and load the script
    var script = document.createElement("script");
    script.src =
      "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9494070306900396";
    script.async = true;
    script.crossOrigin = "anonymous";
    document.head.appendChild(script);
  }

  // Load ad scripts when ad is shown
  function loadAdScripts(adContainer) {
    if (!adContainer) return;

    // Initialize adsbygoogle array if not exists (before script loads)
    initAdsByGoogleArray();

    // Load adsbygoogle main script first if not loaded
    // Note: Script might already be loaded in head (index.html)
    loadAdsByGoogleScript();

    // Find and initialize adsbygoogle ins elements
    var adInsElements = adContainer.getElementsByClassName("adsbygoogle");
    if (adInsElements.length > 0) {
      // Initialize each ad slot
      var initAdSlot = function (insElement) {
        // Check if already initialized
        if (insElement.hasAttribute("data-adsbygoogle-status")) {
          return;
        }

        // Function to push ad to adsbygoogle array
        var pushAd = function () {
          try {
            (window.adsbygoogle = window.adsbygoogle || []).push({});
          } catch (e) {
            console.error("Error initializing ad:", e);
          }
        };

        // If adsbygoogle is ready, push immediately
        if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
          pushAd();
        } else {
          // Wait for adsbygoogle script to load
          var attempts = 0;
          var maxAttempts = 100; // 10 seconds max wait (100 * 100ms)
          var checkInterval = setInterval(function () {
            attempts++;
            if (window.adsbygoogle && Array.isArray(window.adsbygoogle)) {
              pushAd();
              clearInterval(checkInterval);
            } else if (attempts >= maxAttempts) {
              // Timeout - try to push anyway
              pushAd();
              clearInterval(checkInterval);
            }
          }, 100);
        }
      };

      // Initialize all ad slots
      for (var i = 0; i < adInsElements.length; i++) {
        initAdSlot(adInsElements[i]);
      }
    }

    // Load other scripts (non-adsbygoogle)
    var scripts = adContainer.getElementsByTagName("script");
    for (var i = 0; i < scripts.length; i++) {
      var script = scripts[i];
      // Skip adsbygoogle script (already handled above)
      if (script.src && script.src.indexOf("adsbygoogle.js") !== -1) {
        continue;
      }
      // Skip inline adsbygoogle push scripts (already handled above)
      if (
        script.textContent &&
        script.textContent.indexOf("adsbygoogle") !== -1
      ) {
        continue;
      }
      // Check if script already loaded
      if (script.hasAttribute("data-loaded")) {
        continue;
      }
      script.setAttribute("data-loaded", "true");

      var newScript = document.createElement("script");
      if (script.src) {
        newScript.src = script.src;
        newScript.async = true;
      } else {
        newScript.textContent = script.textContent;
      }
      document.head.appendChild(newScript);
    }
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
      adContainers.push(adContainer);
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
      adContainers.push(leftContainer);
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
      adContainers.push(rightContainer);
    }

    // Start tracking conditions
    checkTimeOnPage();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleUserInteraction, {
      passive: true,
    });
    document.addEventListener("touchstart", handleUserInteraction, {
      passive: true,
    });

    // Check initial scroll position
    handleScroll();
  }

  // Control Auto Ads display based on conditions
  function controlAutoAds() {
    // Check if Auto Ads script is loaded (from head or AdSense)
    var autoAdsScript = document.querySelector('script[src*="adsbygoogle.js"]');

    if (autoAdsScript) {
      // If Auto Ads is enabled, we need to prevent it from loading until conditions are met
      // However, Auto Ads loads automatically, so we can't fully control it
      // Instead, we can hide Auto Ads containers until conditions are met

      // Function to hide/show auto ads
      var toggleAutoAds = function (show) {
        // Find all auto ads containers (Google creates these dynamically)
        var autoAdContainers = document.querySelectorAll(
          'ins.adsbygoogle[data-ad-status], div[id^="google_ads_iframe"], div[class*="adsbygoogle"]'
        );

        autoAdContainers.forEach(function (container) {
          // Only hide/show if it's an auto ad (not our manual ad)
          var isManualAd = container.closest(
            "#ad-banner-728x90, #ad-sidebar-left, #ad-sidebar-right"
          );
          if (!isManualAd) {
            if (show) {
              container.style.display = "";
              container.style.visibility = "visible";
              container.style.opacity = "1";
            } else {
              container.style.display = "none";
              container.style.visibility = "hidden";
              container.style.opacity = "0";
            }
          }
        });
      };

      // Initially hide auto ads
      toggleAutoAds(false);

      // Watch for new auto ads being inserted
      var observer = new MutationObserver(function (mutations) {
        if (!checkAdConditions()) {
          // Conditions not met, hide any new auto ads
          toggleAutoAds(false);
        }
      });

      // Observe the document body for new ad insertions
      observer.observe(document.body, {
        childList: true,
        subtree: true,
      });

      // Show auto ads when conditions are met
      // Override showAds to also show auto ads
      var checkAndShowAutoAds = function () {
        if (checkAdConditions()) {
          toggleAutoAds(true);
        }
      };

      // Check conditions periodically and show auto ads when ready
      var checkInterval = setInterval(function () {
        if (checkAdConditions()) {
          toggleAutoAds(true);
          clearInterval(checkInterval);
        }
      }, 500);

      // Also check when showAds is called
      var originalShowAds = showAds;
      showAds = function () {
        originalShowAds();
        checkAndShowAutoAds();
      };

      // Clean up interval after 60 seconds (max wait time)
      setTimeout(function () {
        clearInterval(checkInterval);
      }, 60000);
    }
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
      adContainers.push(adContainer);
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
      adContainers.push(leftContainer);
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
      adContainers.push(rightContainer);
    }

    // Start tracking conditions
    checkTimeOnPage();
    window.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("click", handleUserInteraction, {
      passive: true,
    });
    document.addEventListener("touchstart", handleUserInteraction, {
      passive: true,
    });

    // Check initial scroll position
    handleScroll();

    // Control Auto Ads if enabled
    // Wait a bit for Auto Ads script to potentially load
    setTimeout(controlAutoAds, 1000);
  }

  // Run on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAds);
  } else {
    initAds();
  }
})();
