const translations = {
    en: {
        "nav-features": "Features",
        "nav-install": "Installation",
        "badge": "Version 1.0 Available Now",
        "hero-title": "Take Control of Your <br><span class=\"gradient-text\">Microphone Volume</span>",
        "hero-subtitle": "A lightweight, zero-CPU Windows service that permanently locks your default microphone volume. No matter what apps or games try to change it — it snaps back instantly.",
        "btn-download": "Download v1.0",
        "btn-docs": "Documentation",
        "feat-title": "Why use MICFix?",
        "feat-subtitle": "Built completely from the ground up for Windows with performance in mind.",
        "feat-1-title": "Volume Lock",
        "feat-1-desc": "Enforces your desired mic volume. If a game, app, or system update tries to change it, MICFix instantly reverts the change.",
        "feat-2-title": "0% CPU Usage",
        "feat-2-desc": "Fully event-driven architecture using Win32 and COM events. No polling loops, no timers. It literally sleeps until an event fires.",
        "feat-3-title": "Invisible Service",
        "feat-3-desc": "Runs as a native DLL payload through Windows svchost.exe. There are no annoying .exe files lingering in your Task Manager.",
        "feat-4-title": "Live Configuration",
        "feat-4-desc": "Edit your volume.json file to adjust the volume percentage. The service updates instantly in real-time without needing a restart.",
        "inst-title": "Installation & Usage",
        "inst-subtitle": "Getting started is incredibly simple.",
        "inst-1-title": "Download & Extract",
        "inst-1-desc": "Download the latest release zip from the button above. Extract the contents (<code>MICFixService.dll</code> and <code>MICFixInstall.exe</code>) into a single folder.",
        "inst-2-title": "Install",
        "inst-2-desc": "Right-click on <code>MICFixInstall.exe</code> and select <strong>\"Run as Administrator\"</strong>. You only need to do this once. The service will automatically start with Windows forever.",
        "inst-3-title": "Configure",
        "inst-3-desc": "Navigate to your Documents folder and find the newly created <code>MICFix\\volume.json</code>. Edit this file to change your desired volume level (0-100).",
        "uninst-title": "Want to remove it?",
        "uninst-desc": "Run <code>MICFixUninstall.exe</code> as Administrator. It will cleanly stop the service, unregister the DLL, and remove all registry entries, leaving no traces behind.",
        "footer-1": "Built with native Win32 APIs for maximum performance.",
        "footer-2": "© 2026 bangtony2. Released under the MIT License."
    },
    ua: {
        "nav-features": "Можливості",
        "nav-install": "Встановлення",
        "badge": "Версія 1.0 вже доступна",
        "hero-title": "Візьміть під контроль <br><span class=\"gradient-text\">Гучність Мікрофона</span>",
        "hero-subtitle": "Легка служба Windows з 0% CPU, яка назавжди фіксує гучність вашого мікрофона. Навіть якщо ігри або програми спробують змінити її — гучність миттєво повернеться назад.",
        "btn-download": "Завантажити v1.0",
        "btn-docs": "Документація",
        "feat-title": "Чому саме MICFix?",
        "feat-subtitle": "Створено з нуля спеціально для Windows з максимальною оптимізацією продуктивності.",
        "feat-1-title": "Фіксація Гучності",
        "feat-1-desc": "Утримує задану вами гучність мікрофона. Якщо гра, додаток або система спробують змінити її, MICFix миттєво поверне все як було.",
        "feat-2-title": "Навантаження 0% CPU",
        "feat-2-desc": "Повністю подієва архітектура на базі Win32 та COM-подій. Жодних циклів перевірки чи таймерів. Служба буквально «спить», поки не відбудеться подія.",
        "feat-3-title": "Невидима Служба",
        "feat-3-desc": "Працює як нативна DLL через системний процес svchost.exe. У вашому Диспетчері завдань не буде жодних зайвих .exe файлів.",
        "feat-4-title": "Конфігурація на льоту",
        "feat-4-desc": "Змініть файл volume.json, щоб налаштувати гучність. Служба застосує зміни миттєво і в реальному часі без необхідності перезапуску.",
        "inst-title": "Встановлення та Використання",
        "inst-subtitle": "Почати роботу неймовірно просто.",
        "inst-1-title": "Завантажте та Розпакуйте",
        "inst-1-desc": "Завантажте останній реліз за кнопкою вище. Розпакуйте вміст (<code>MICFixService.dll</code> та <code>MICFixInstall.exe</code>) у будь-яку одну папку.",
        "inst-2-title": "Встановіть",
        "inst-2-desc": "Натисніть правою кнопкою миші на <code>MICFixInstall.exe</code> та виберіть <strong>\"Запуск від імені адміністратора\"</strong>. Це потрібно зробити лише один раз.",
        "inst-3-title": "Налаштуйте",
        "inst-3-desc": "Перейдіть до папки Документи та знайдіть новостворений <code>MICFix\\volume.json</code>. Змініть цей файл, щоб встановити бажану гучність (0-100).",
        "uninst-title": "Бажаєте видалити?",
        "uninst-desc": "Запустіть <code>MICFixUninstall.exe</code> від імені Адміністратора. Це чисто зупинить службу, видалить DLL та всі записи з реєстру, не залишивши жодних слідів.",
        "footer-1": "Створено на базі нативних Win32 API для максимальної продуктивності.",
        "footer-2": "© 2026 bangtony2. Випущено під ліцензією MIT."
    }
};

const flags = {
    en: '<img src="https://flagcdn.com/w20/us.png" alt="US">',
    ua: '<img src="https://flagcdn.com/w20/ua.png" alt="UA">'
};

let currentLang = 'en';

document.addEventListener("DOMContentLoaded", () => {
    // --- Intersection Observer for scroll animations ---
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-up');
    setTimeout(() => {
        animatedElements.forEach(el => observer.observe(el));
    }, 100);

    // --- Dynamic background blob movement ---
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');
    
    if (blob1 && blob2) {
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            blob1.style.transform = `translate(${x * 3}%, ${y * 3}%)`;
            blob2.style.transform = `translate(${x * -3}%, ${y * -3}%)`;
        });
    }

    // --- Localization Logic ---
    initLanguage();

    const langBtn = document.getElementById("current-lang-btn");
    const langDropdown = document.getElementById("lang-dropdown");

    langBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        langDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
        if (langDropdown.classList.contains("show")) {
            langDropdown.classList.remove("show");
        }
    });

    document.querySelectorAll(".lang-option").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const selectedLang = e.target.getAttribute("data-lang");
            setLanguage(selectedLang);
            // Save manual choice to localStorage
            localStorage.setItem("micfix_lang", selectedLang);
        });
    });
});

async function initLanguage() {
    const savedLang = localStorage.getItem("micfix_lang");
    if (savedLang) {
        setLanguage(savedLang);
    } else {
        // Fetch IP based location
        try {
            const res = await fetch("https://get.geojs.io/v1/ip/country.json");
            const data = await res.json();
            if (data.country === "UA") {
                setLanguage("ua");
            } else {
                setLanguage("en");
            }
        } catch (e) {
            console.error("Could not fetch location data:", e);
            setLanguage("en");
        }
    }
}

function setLanguage(lang) {
    currentLang = lang;
    document.getElementById("current-lang-btn").innerHTML = flags[lang];
    
    const elements = document.querySelectorAll("[data-i18n]");
    elements.forEach(el => {
        const key = el.getAttribute("data-i18n");
        if (translations[lang] && translations[lang][key]) {
            el.innerHTML = translations[lang][key];
        }
    });
}
