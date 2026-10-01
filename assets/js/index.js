function getErrorHolder(field) {
  if (field.classList.contains("custom-select")) {
    return field.parentElement;
  }
  return field;
}


function showError(field, message) {
  clearError(field); 

  field.style.borderColor = "#ef4444";

  const p = document.createElement("p");
  p.className = "text-red-500 text-sm mt-2";
  p.setAttribute("data-error", "true");
  p.textContent = message;

  getErrorHolder(field).insertAdjacentElement("afterend", p);
}
function clearError(field) {
  field.style.borderColor = "";

  const next = getErrorHolder(field).nextElementSibling;
  if (next && next.hasAttribute("data-error")) {
    next.remove();
  }
}

function initTheme() {
  const html = document.documentElement;
  const button = document.getElementById("theme-toggle-button");


  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    html.classList.remove("dark");
  } else if (saved === "dark") {
    html.classList.add("dark");
  }

  button.addEventListener("click", function () {
    html.classList.toggle("dark"); 

    if (html.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  });
}


const colorThemes = [
  { name: "بنفسجي", primary: "#6366f1", secondary: "#8b5cf6", accent: "#a855f7" }, 
  { name: "وردي", primary: "#ec4899", secondary: "#f97316", accent: "#f43f5e" },
  { name: "أخضر", primary: "#10b981", secondary: "#059669", accent: "#34d399" },
  { name: "أزرق", primary: "#3b82f6", secondary: "#06b6d4", accent: "#6366f1" },
  { name: "أحمر", primary: "#ef4444", secondary: "#f43f5e", accent: "#ec4899" },
  { name: "برتقالي", primary: "#f59e0b", secondary: "#ea580c", accent: "#f97316" },
];

function applyFont(name) {
  const body = document.body;
  body.classList.remove("font-alexandria", "font-tajawal", "font-cairo");
  body.classList.add("font-" + name);

  const options = document.querySelectorAll(".font-option");
  for (let i = 0; i < options.length; i++) {
    if (options[i].dataset.font === name) {
      options[i].classList.add("active");
    } else {
      options[i].classList.remove("active");
    }
  }
}


function applyColor(index) {
  
  if (colorThemes[index] === undefined) {
    index = 0;
  }
  const theme = colorThemes[index];
  const root = document.documentElement;

  root.style.setProperty("--color-primary", theme.primary);
  root.style.setProperty("--color-secondary", theme.secondary);
  root.style.setProperty("--color-accent", theme.accent);


  const swatches = document.querySelectorAll(".color-option");
  for (let i = 0; i < swatches.length; i++) {
    if (i === index) {
      swatches[i].style.outline = "3px solid " + theme.primary;
      swatches[i].style.outlineOffset = "3px";
    } else {
      swatches[i].style.outline = "";
      swatches[i].style.outlineOffset = "";
    }
  }
}

function initSettings() {
  const toggle = document.getElementById("settings-toggle");
  const sidebar = document.getElementById("settings-sidebar");
  const closeBtn = document.getElementById("close-settings");
  const resetBtn = document.getElementById("reset-settings");
  const grid = document.getElementById("theme-colors-grid");


  for (let i = 0; i < colorThemes.length; i++) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className =
      "color-option w-14 h-14 mx-auto rounded-full border-2 transition-all duration-300 hover:scale-105 cursor-pointer";
    btn.style.background =
      "linear-gradient(135deg, " + colorThemes[i].primary + ", " + colorThemes[i].secondary + ")";
    btn.style.borderColor = "#334155";
    btn.title = colorThemes[i].name;


    btn.addEventListener("click", function () {
      applyColor(i);
      localStorage.setItem("color", i);
    });
    grid.appendChild(btn);
  }


  function setOpen(open) {
    if (open) {
      sidebar.classList.remove("translate-x-full"); 
      
      toggle.style.transform = "translateY(-50%) translateX(-" + sidebar.offsetWidth + "px)";
    } else {
      sidebar.classList.add("translate-x-full"); 
      toggle.style.transform = "translateY(-50%)";
    }
  }

  function isOpen() {
    return !sidebar.classList.contains("translate-x-full");
  }

  setOpen(false);

  toggle.addEventListener("click", function () {
    setOpen(!isOpen());
  });
  closeBtn.addEventListener("click", function () {
    setOpen(false);
  });


  const fontButtons = document.querySelectorAll(".font-option");
  for (let i = 0; i < fontButtons.length; i++) {
    fontButtons[i].addEventListener("click", function () {
      const name = fontButtons[i].dataset.font;
      applyFont(name);
      localStorage.setItem("font", name);
    });
  }

  
  resetBtn.addEventListener("click", function () {
    localStorage.removeItem("font");
    localStorage.removeItem("color");
    applyFont("tajawal");
    applyColor(0);
  });

  
  const savedFont = localStorage.getItem("font");
  const savedColor = localStorage.getItem("color");

  if (savedFont) {
    applyFont(savedFont);
  } else {
    applyFont("tajawal");
  }

  if (savedColor) {
    applyColor(Number(savedColor));
  } else {
    applyColor(0);
  }
}

function initNav() {
  const navLinks = document.querySelector(".nav-links");
  const links = navLinks.querySelectorAll('a[href^="#"]');

  
  function updateActive() {
    const y = window.scrollY + 120; 
    let currentId = "";

    for (let i = 0; i < links.length; i++) {
      const section = document.querySelector(links[i].getAttribute("href"));
      if (section) {
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= y) {
          currentId = section.id; 
        }
      }
    }

    for (let i = 0; i < links.length; i++) {
      if (links[i].getAttribute("href") === "#" + currentId) {
        links[i].classList.add("active");
      } else {
        links[i].classList.remove("active");
      }
    }
  }
  window.addEventListener("scroll", updateActive);
  updateActive();

  
  let menuBtn = document.querySelector(".mobile-menu-btn");
  if (!menuBtn) {
    menuBtn = document.createElement("button");
    menuBtn.type = "button";
    menuBtn.className = "mobile-menu-btn text-slate-600 dark:text-slate-300 text-2xl";
    menuBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    navLinks.parentElement.appendChild(menuBtn);
  }

  function setMenu(open) {
    const icon = menuBtn.querySelector("i");
    if (open) {
      navLinks.classList.add("active");
      icon.className = "fa-solid fa-xmark";
    } else {
      navLinks.classList.remove("active");
      icon.className = "fa-solid fa-bars";
    }
  }

  menuBtn.addEventListener("click", function () {
    setMenu(!navLinks.classList.contains("active"));
  });

  
  for (let i = 0; i < links.length; i++) {
    links[i].addEventListener("click", function () {
      setMenu(false);
    });
  }
}


function initScrollTop() {
  const btn = document.getElementById("scroll-to-top");

  function update() {
    if (window.scrollY > 400) {
      
      btn.classList.remove("opacity-0", "invisible");
      btn.classList.add("opacity-100", "visible");
    } else {
      
      btn.classList.add("opacity-0", "invisible");
      btn.classList.remove("opacity-100", "visible");
    }
  }
  window.addEventListener("scroll", update);
  update();

  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function initPortfolioFilter() {
  const buttons = document.querySelectorAll(".portfolio-filter");
  const items = document.querySelectorAll(".portfolio-item");


  const activeClasses = [
    "bg-linear-to-r", "from-primary", "to-secondary", "text-white",
    "hover:shadow-lg", "hover:shadow-primary/50",
  ];
  const inactiveClasses = [
    "bg-white", "dark:bg-slate-800", "text-slate-600", "dark:text-slate-300",
    "hover:bg-slate-100", "dark:hover:bg-slate-700",
    "border", "border-slate-300", "dark:border-slate-700",
  ];

  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function () {
      const filter = buttons[i].dataset.filter; 

      for (let j = 0; j < buttons.length; j++) {
        const isSelected = j === i;

        for (let k = 0; k < activeClasses.length; k++) {
          if (isSelected) buttons[j].classList.add(activeClasses[k]);
          else buttons[j].classList.remove(activeClasses[k]);
        }
        for (let k = 0; k < inactiveClasses.length; k++) {
          if (isSelected) buttons[j].classList.remove(inactiveClasses[k]);
          else buttons[j].classList.add(inactiveClasses[k]);
        }
      }

      
      for (let j = 0; j < items.length; j++) {
        if (filter === "all" || items[j].dataset.category === filter) {
          items[j].classList.remove("hidden");
        } else {
          items[j].classList.add("hidden");
        }
      }
    });
  }
}

function initCarousel() {
  const track = document.getElementById("testimonials-carousel");
  const cards = track.querySelectorAll(".testimonial-card");
  const prevBtn = document.getElementById("prev-testimonial");
  const nextBtn = document.getElementById("next-testimonial");
  const firstDot = document.querySelector(".carousel-indicator");
  const dotsBox = firstDot ? firstDot.parentElement : null;

  let index = 0; 
  function cardsPerView() {
    return Math.round(track.parentElement.offsetWidth / cards[0].offsetWidth);
  }

  
  function maxIndex() {
    const max = cards.length - cardsPerView();
    if (max < 0) return 0;
    return max;
  }

  
  function buildDots() {
    if (!dotsBox) return;
    dotsBox.innerHTML = "";

    for (let i = 0; i <= maxIndex(); i++) {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className =
        "carousel-indicator w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer";

      dot.addEventListener("click", function () {
        goTo(i);
      });
      dotsBox.appendChild(dot);
    }
  }


  function updateDots() {
    if (!dotsBox) return;
    const dots = dotsBox.querySelectorAll(".carousel-indicator");

    for (let i = 0; i < dots.length; i++) {
      if (i === index) {
        dots[i].classList.add("bg-accent");
        dots[i].classList.remove("bg-slate-400", "dark:bg-slate-600");
      } else {
        dots[i].classList.remove("bg-accent");
        dots[i].classList.add("bg-slate-400", "dark:bg-slate-600");
      }
    }
  }

  
  function goTo(i) {
    if (i < 0) i = 0;
    if (i > maxIndex()) i = maxIndex();
    index = i;

    
    track.style.transform = "translateX(" + index * cards[0].offsetWidth + "px)";
    updateDots();
  }

  
  nextBtn.addEventListener("click", function () {
    if (index >= maxIndex()) {
      goTo(0);
    } else {
      goTo(index + 1);
    }
  });

  
  prevBtn.addEventListener("click", function () {
    if (index <= 0) {
      goTo(maxIndex());
    } else {
      goTo(index - 1);
    }
  });

  
  window.addEventListener("resize", function () {
    buildDots();
    goTo(index);
  });

  buildDots();
  goTo(0);
}

function initCustomSelects() {
  const selects = document.querySelectorAll(".custom-select");


  function closeSelect(select) {
    const optionsBox = select.nextElementSibling; 
    optionsBox.classList.add("hidden");
    select.setAttribute("aria-expanded", "false");
    select.querySelector("i").style.transform = "";
  }


  function openSelect(select) {
    for (let i = 0; i < selects.length; i++) {
      if (selects[i] !== select) {
        closeSelect(selects[i]);
      }
    }
    const optionsBox = select.nextElementSibling;
    optionsBox.classList.remove("hidden");
    select.setAttribute("aria-expanded", "true");
    select.querySelector("i").style.transform = "rotate(180deg)";
  }


  function chooseOption(select, option) {
    const text = select.querySelector(".selected-text");

    select.dataset.value = option.dataset.value; 
    text.textContent = option.dataset.value;
    text.classList.remove("text-slate-500", "dark:text-slate-400");
    text.classList.add("text-slate-800", "dark:text-white");

    clearError(select); 
    closeSelect(select);
  }

  for (let i = 0; i < selects.length; i++) {
    const select = selects[i];
    const optionsBox = select.nextElementSibling;
    const options = optionsBox.querySelectorAll(".custom-option");

    
    select.dataset.placeholder = select.querySelector(".selected-text").textContent;

    select.addEventListener("click", function (e) {
      e.stopPropagation();
      if (select.getAttribute("aria-expanded") === "true") {
        closeSelect(select);
      } else {
        openSelect(select);
      }
    });

    for (let j = 0; j < options.length; j++) {
      options[j].addEventListener("click", function (e) {
        e.stopPropagation();
        chooseOption(select, options[j]);
      });
    }
  }


  document.addEventListener("click", function () {
    for (let i = 0; i < selects.length; i++) {
      closeSelect(selects[i]);
    }
  });
}


function resetCustomSelect(select) {
  delete select.dataset.value;
  const text = select.querySelector(".selected-text");
  text.textContent = select.dataset.placeholder;
  text.classList.add("text-slate-500", "dark:text-slate-400");
  text.classList.remove("text-slate-800", "dark:text-white");
}


function showSuccessPopup() {
  
  if (typeof Swal === "undefined") {
    alert("تم إرسال رسالتك بنجاح! شكراً لتواصلك.");
    return;
  }

  if (!document.getElementById("swal-custom-style")) {
    const style = document.createElement("style");
    style.id = "swal-custom-style";
    style.textContent =
      ".swal-popup { border: 1px solid #334155; border-radius: 1.5rem; }" +
      ".swal-icon-clean { border: none !important; }" +
      ".swal-check { width: 5rem; height: 5rem; border-radius: 9999px;" +
      "  background: linear-gradient(135deg, #00d57a, #00b86b);" +
      "  display: flex; align-items: center; justify-content: center;" +
      "  color: #fff; font-size: 2rem; }" +
      ".swal-confirm { background: linear-gradient(to right, var(--color-primary), var(--color-secondary));" +
      "  color: #fff; font-weight: 700; cursor: pointer;" +
      "  padding: .75rem 2rem; border-radius: .75rem; }";
    document.head.appendChild(style);
  }

  Swal.fire({
    iconHtml: '<div class="swal-check"><i class="fa-solid fa-check"></i></div>',
    title: "تم إرسال رسالتك بنجاح!",
    text: "شكراً لتواصلك. سأرد عليك في أقرب وقت ممكن.",
    background: "#1e293b",
    color: "#fff",
    confirmButtonText: "حسناً",
    buttonsStyling: false,
    customClass: {
      popup: "swal-popup",
      icon: "swal-icon-clean",
      confirmButton: "swal-confirm",
    },
  });
}

function initContactForm() {
  const form = document.querySelector('form[aria-label="نموذج التواصل"]');
  form.noValidate = true; 

  const nameInput = document.getElementById("full-name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  const detailsInput = document.getElementById("project-details");
  const typeSelect = document.querySelector('.custom-select[data-name="project-type"]');
  const budgetSelect = document.querySelector('.custom-select[data-name="budget"]');
  const submitBtn = form.querySelector('button[type="submit"]');


  function validateForm() {
    let isValid = true;
    let firstInvalid = null; 

    
    if (nameInput.value.trim().length < 3) {
      showError(nameInput, "يرجى إدخال الاسم الكامل");
      isValid = false;
      if (firstInvalid === null) firstInvalid = nameInput;
    } else {
      clearError(nameInput);
    }


    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(emailInput.value.trim())) {
      showError(emailInput, "يرجى إدخال بريد إلكتروني صحيح");
      isValid = false;
      if (firstInvalid === null) firstInvalid = emailInput;
    } else {
      clearError(emailInput);
    }


    const phone = phoneInput.value.replace(/[\s\-()]/g, "");
    const phonePattern = /^\+?\d{10,15}$/;
    if (phone !== "" && !phonePattern.test(phone)) {
      showError(phoneInput, "يرجى إدخال رقم هاتف صحيح");
      isValid = false;
      if (firstInvalid === null) firstInvalid = phoneInput;
    } else {
      clearError(phoneInput);
    }

    
    if (!typeSelect.dataset.value) {
      showError(typeSelect, "يرجى اختيار نوع المشروع");
      isValid = false;
      if (firstInvalid === null) firstInvalid = typeSelect;
    } else {
      clearError(typeSelect);
    }

    
    if (detailsInput.value.trim().length < 10) {
      showError(detailsInput, "يرجى إدخال المزيد من التفاصيل");
      isValid = false;
      if (firstInvalid === null) firstInvalid = detailsInput;
    } else {
      clearError(detailsInput);
    }


    if (firstInvalid !== null) {
      firstInvalid.focus();
    }
    return isValid;
  }

  const fields = [nameInput, emailInput, phoneInput, detailsInput];
  for (let i = 0; i < fields.length; i++) {
    fields[i].addEventListener("input", function () {
      clearError(fields[i]);
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); 

    if (!validateForm()) {
      return; 
    }


    const data = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      phone: phoneInput.value.trim(),
      projectType: typeSelect.dataset.value,
      budget: budgetSelect.dataset.value || "",
      details: detailsInput.value.trim(),
    };
    console.log("بيانات الفورم:", data);

    const originalHTML = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.textContent = "جاري الإرسال...";

    setTimeout(function () {
      form.reset();
      resetCustomSelect(typeSelect);
      resetCustomSelect(budgetSelect);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHTML;

      showSuccessPopup();
    }, 1200);
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initTheme();
  initSettings();
  initNav();
  initScrollTop();
  initPortfolioFilter();
  initCarousel();
  initCustomSelects();
  initContactForm();
});