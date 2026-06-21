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
    },
    es: {
        "nav-features": "Características",
        "nav-install": "Instalación",
        "badge": "Versión 1.0 Disponible Ahora",
        "hero-title": "Toma el Control del <br><span class=\"gradient-text\">Volumen del Micrófono</span>",
        "hero-subtitle": "Un servicio de Windows ultraligero que bloquea permanentemente el volumen del micrófono. No importa qué intente cambiarlo, vuelve al instante.",
        "btn-download": "Descargar v1.0",
        "btn-docs": "Documentación",
        "feat-title": "¿Por qué usar MICFix?",
        "feat-subtitle": "Creado desde cero para Windows con la máxima optimización.",
        "feat-1-title": "Bloqueo de Volumen",
        "feat-1-desc": "Mantiene el volumen deseado. Si un juego o actualización intenta cambiarlo, MICFix lo revierte instantáneamente.",
        "feat-2-title": "0% Uso de CPU",
        "feat-2-desc": "Arquitectura basada en eventos. Sin bucles de comprobación. Simplemente duerme hasta que ocurre un evento.",
        "feat-3-title": "Servicio Invisible",
        "feat-3-desc": "Se ejecuta como una DLL nativa a través de svchost.exe. Sin archivos .exe molestos en el Administrador de tareas.",
        "feat-4-title": "Configuración en Vivo",
        "feat-4-desc": "Edita el archivo volume.json para ajustar el porcentaje. El servicio se actualiza al instante sin necesidad de reiniciar.",
        "inst-title": "Instalación y Uso",
        "inst-subtitle": "Empezar es increíblemente sencillo.",
        "inst-1-title": "Descargar y Extraer",
        "inst-1-desc": "Descarga el último zip. Extrae los archivos en una sola carpeta.",
        "inst-2-title": "Instalar",
        "inst-2-desc": "Haz clic derecho en <code>MICFixInstall.exe</code> y selecciona <strong>\"Ejecutar como administrador\"</strong>. Solo debes hacerlo una vez.",
        "inst-3-title": "Configurar",
        "inst-3-desc": "Ve a tu carpeta Documentos y edita <code>MICFix\\volume.json</code> para cambiar el volumen deseado.",
        "uninst-title": "¿Quieres eliminarlo?",
        "uninst-desc": "Ejecuta <code>MICFixUninstall.exe</code> como Administrador. Se detendrá limpiamente y eliminará todos los registros.",
        "footer-1": "Construido con API Win32 nativas para un máximo rendimiento.",
        "footer-2": "© 2026 bangtony2. Publicado bajo la Licencia MIT."
    },
    it: {
        "nav-features": "Caratteristiche",
        "nav-install": "Installazione",
        "badge": "Versione 1.0 Ora Disponibile",
        "hero-title": "Prendi il Controllo del <br><span class=\"gradient-text\">Volume del Microfono</span>",
        "hero-subtitle": "Un servizio Windows leggero che blocca permanentemente il volume del microfono. Non importa cosa cerchi di cambiarlo, ritorna all'istante.",
        "btn-download": "Scarica v1.0",
        "btn-docs": "Documentazione",
        "feat-title": "Perché usare MICFix?",
        "feat-subtitle": "Costruito da zero per Windows pensando alle prestazioni.",
        "feat-1-title": "Blocco del Volume",
        "feat-1-desc": "Imponi il volume desiderato. Se un gioco o un'app cerca di cambiarlo, MICFix annulla istantaneamente la modifica.",
        "feat-2-title": "0% Utilizzo CPU",
        "feat-2-desc": "Architettura guidata dagli eventi. Nessun ciclo di polling. Dorme letteralmente finché non si verifica un evento.",
        "feat-3-title": "Servizio Invisibile",
        "feat-3-desc": "Viene eseguito come una DLL nativa tramite svchost.exe. Nessun file .exe fastidioso nel Task Manager.",
        "feat-4-title": "Configurazione Live",
        "feat-4-desc": "Modifica il file volume.json per regolare il volume. Il servizio si aggiorna istantaneamente senza riavvio.",
        "inst-title": "Installazione e Uso",
        "inst-subtitle": "Iniziare è incredibilmente semplice.",
        "inst-1-title": "Scarica ed Estrai",
        "inst-1-desc": "Scarica l'ultimo zip. Estrai i file in una singola cartella.",
        "inst-2-title": "Installa",
        "inst-2-desc": "Fai clic con il tasto destro su <code>MICFixInstall.exe</code> e seleziona <strong>\"Esegui come amministratore\"</strong>.",
        "inst-3-title": "Configura",
        "inst-3-desc": "Vai nella cartella Documenti e modifica <code>MICFix\\volume.json</code> per impostare il livello di volume desiderato.",
        "uninst-title": "Vuoi rimuoverlo?",
        "uninst-desc": "Esegui <code>MICFixUninstall.exe</code> come Amministratore. Rimuoverà il servizio senza lasciare traccia.",
        "footer-1": "Costruito con API Win32 native per le massime prestazioni.",
        "footer-2": "© 2026 bangtony2. Rilasciato sotto Licenza MIT."
    },
    de: {
        "nav-features": "Funktionen",
        "nav-install": "Installation",
        "badge": "Version 1.0 Jetzt Verfügbar",
        "hero-title": "Übernimm die Kontrolle über deine <br><span class=\"gradient-text\">Mikrofonlautstärke</span>",
        "hero-subtitle": "Ein leichter Windows-Dienst mit 0% CPU-Auslastung, der die Mikrofonlautstärke dauerhaft sperrt. Springt sofort zurück, wenn Apps versuchen, sie zu ändern.",
        "btn-download": "Download v1.0",
        "btn-docs": "Dokumentation",
        "feat-title": "Warum MICFix nutzen?",
        "feat-subtitle": "Komplett von Grund auf für Windows mit Fokus auf Leistung entwickelt.",
        "feat-1-title": "Lautstärkesperre",
        "feat-1-desc": "Erzwingt deine gewünschte Mikrofonlautstärke. MICFix macht Änderungen von Apps sofort rückgängig.",
        "feat-2-title": "0% CPU-Nutzung",
        "feat-2-desc": "Ereignisgesteuerte Architektur. Keine Polling-Schleifen. Schläft, bis ein Ereignis eintritt.",
        "feat-3-title": "Unsichtbarer Dienst",
        "feat-3-desc": "Läuft als native DLL über svchost.exe. Keine nervigen .exe-Dateien im Task-Manager.",
        "feat-4-title": "Live-Konfiguration",
        "feat-4-desc": "Bearbeite die Datei volume.json. Der Dienst wird sofort ohne Neustart aktualisiert.",
        "inst-title": "Installation & Nutzung",
        "inst-subtitle": "Der Einstieg ist unglaublich einfach.",
        "inst-1-title": "Herunterladen & Entpacken",
        "inst-1-desc": "Lade die neueste Zip-Datei herunter und entpacke sie in einen Ordner.",
        "inst-2-title": "Installieren",
        "inst-2-desc": "Rechtsklick auf <code>MICFixInstall.exe</code> -> <strong>\"Als Administrator ausführen\"</strong>. Nur einmal nötig.",
        "inst-3-title": "Konfigurieren",
        "inst-3-desc": "Navigiere zu deinen Dokumenten und bearbeite <code>MICFix\\volume.json</code>, um das gewünschte Level einzustellen.",
        "uninst-title": "Möchtest du es entfernen?",
        "uninst-desc": "Führe <code>MICFixUninstall.exe</code> als Administrator aus. Es stoppt den Dienst sauber und entfernt alle Registry-Einträge.",
        "footer-1": "Erstellt mit nativen Win32-APIs für maximale Leistung.",
        "footer-2": "© 2026 bangtony2. Veröffentlicht unter der MIT-Lizenz."
    },
    fr: {
        "nav-features": "Fonctionnalités",
        "nav-install": "Installation",
        "badge": "Version 1.0 Disponible",
        "hero-title": "Prenez le Contrôle du <br><span class=\"gradient-text\">Volume de votre Micro</span>",
        "hero-subtitle": "Un service Windows léger (0% CPU) qui verrouille en permanence le volume de votre micro. Revient instantanément si une application tente de le modifier.",
        "btn-download": "Télécharger v1.0",
        "btn-docs": "Documentation",
        "feat-title": "Pourquoi utiliser MICFix ?",
        "feat-subtitle": "Conçu de zéro pour Windows avec la performance à l'esprit.",
        "feat-1-title": "Verrouillage du Volume",
        "feat-1-desc": "Applique votre volume souhaité. Si un jeu tente de le modifier, MICFix annule le changement instantanément.",
        "feat-2-title": "0% Utilisation CPU",
        "feat-2-desc": "Architecture basée sur les événements. Pas de boucles de vérification. Il dort jusqu'à ce qu'un événement se produise.",
        "feat-3-title": "Service Invisible",
        "feat-3-desc": "S'exécute comme une DLL native via svchost.exe. Aucun fichier .exe dans votre Gestionnaire des tâches.",
        "feat-4-title": "Configuration en Direct",
        "feat-4-desc": "Modifiez le fichier volume.json. Le service se met à jour instantanément sans redémarrage.",
        "inst-title": "Installation et Utilisation",
        "inst-subtitle": "Commencer est incroyablement simple.",
        "inst-1-title": "Télécharger et Extraire",
        "inst-1-desc": "Téléchargez le dernier fichier zip. Extrayez le contenu dans un seul dossier.",
        "inst-2-title": "Installer",
        "inst-2-desc": "Faites un clic droit sur <code>MICFixInstall.exe</code> et choisissez <strong>\"Exécuter en tant qu'administrateur\"</strong>.",
        "inst-3-title": "Configurer",
        "inst-3-desc": "Allez dans vos Documents et modifiez <code>MICFix\\volume.json</code> pour changer le volume.",
        "uninst-title": "Vous voulez le désinstaller ?",
        "uninst-desc": "Exécutez <code>MICFixUninstall.exe</code> en tant qu'administrateur. Il supprimera tout proprement sans laisser de traces.",
        "footer-1": "Construit avec des API Win32 natives pour des performances maximales.",
        "footer-2": "© 2026 bangtony2. Publié sous licence MIT."
    },
    no: {
        "nav-features": "Funksjoner",
        "nav-install": "Installasjon",
        "badge": "Versjon 1.0 Tilgjengelig Nå",
        "hero-title": "Ta Kontroll Over <br><span class=\"gradient-text\">Mikrofonvolumet Ditt</span>",
        "hero-subtitle": "En lett Windows-tjeneste (0% CPU) som låser mikrofonvolumet ditt permanent. Spretter tilbake umiddelbart hvis en app prøver å endre det.",
        "btn-download": "Last ned v1.0",
        "btn-docs": "Dokumentasjon",
        "feat-title": "Hvorfor bruke MICFix?",
        "feat-subtitle": "Bygget fra grunnen av for Windows med fokus på ytelse.",
        "feat-1-title": "Volumlås",
        "feat-1-desc": "Tvinger frem ønsket volum. Hvis et spill eller systemoppdatering prøver å endre det, tilbakestiller MICFix det umiddelbart.",
        "feat-2-title": "0% CPU-Bruk",
        "feat-2-desc": "Hendelsesstyrt arkitektur. Ingen polling. Sover til en hendelse inntreffer.",
        "feat-3-title": "Usynlig Tjeneste",
        "feat-3-desc": "Kjører som en innfødt DLL gjennom svchost.exe. Ingen irriterende .exe-filer i Oppgavebehandling.",
        "feat-4-title": "Live Konfigurasjon",
        "feat-4-desc": "Rediger volume.json for å justere prosentandelen. Oppdateres umiddelbart uten omstart.",
        "inst-title": "Installasjon & Bruk",
        "inst-subtitle": "Det er utrolig enkelt å komme i gang.",
        "inst-1-title": "Last Ned & Pakk Ut",
        "inst-1-desc": "Last ned den nyeste zip-filen. Pakk ut innholdet i en mappe.",
        "inst-2-title": "Installer",
        "inst-2-desc": "Høyreklikk på <code>MICFixInstall.exe</code> og velg <strong>\"Kjør som administrator\"</strong>.",
        "inst-3-title": "Konfigurer",
        "inst-3-desc": "Naviger til Dokumenter-mappen og finn <code>MICFix\\volume.json</code> for å justere nivået.",
        "uninst-title": "Vil du fjerne det?",
        "uninst-desc": "Kjør <code>MICFixUninstall.exe</code> som Administrator. Stopper og fjerner alt helt rent.",
        "footer-1": "Bygget med native Win32 APIer for maksimal ytelse.",
        "footer-2": "© 2026 bangtony2. Utgitt under MIT-lisensen."
    },
    pl: {
        "nav-features": "Funkcje",
        "nav-install": "Instalacja",
        "badge": "Wersja 1.0 Dostępna",
        "hero-title": "Przejmij Kontrolę Nad <br><span class=\"gradient-text\">Głośnością Mikrofonu</span>",
        "hero-subtitle": "Lekka usługa Windows, która trwale blokuje głośność mikrofonu. Natychmiast cofa wszelkie zmiany wprowadzane przez aplikacje.",
        "btn-download": "Pobierz v1.0",
        "btn-docs": "Dokumentacja",
        "feat-title": "Dlaczego MICFix?",
        "feat-subtitle": "Zbudowany od podstaw dla Windows z myślą o wydajności.",
        "feat-1-title": "Blokada Głośności",
        "feat-1-desc": "Wymusza wybraną głośność. Jeśli gra spróbuje ją zmienić, MICFix natychmiast ją przywróci.",
        "feat-2-title": "0% Zużycia CPU",
        "feat-2-desc": "Architektura oparta na zdarzeniach. Bez pętli sprawdzających. Śpi, dopóki nie wystąpi zdarzenie.",
        "feat-3-title": "Niewidoczna Usługa",
        "feat-3-desc": "Działa jako natywna biblioteka DLL przez svchost.exe. Żadnych plików .exe w Menedżerze Zadań.",
        "feat-4-title": "Konfiguracja na Żywo",
        "feat-4-desc": "Edytuj plik volume.json. Usługa aktualizuje się natychmiast bez restartu.",
        "inst-title": "Instalacja i Użycie",
        "inst-subtitle": "Rozpoczęcie jest niezwykle proste.",
        "inst-1-title": "Pobierz i Wypakuj",
        "inst-1-desc": "Pobierz najnowszy plik zip. Wypakuj zawartość do jednego folderu.",
        "inst-2-title": "Zainstaluj",
        "inst-2-desc": "Kliknij prawym przyciskiem na <code>MICFixInstall.exe</code> i wybierz <strong>\"Uruchom jako administrator\"</strong>.",
        "inst-3-title": "Skonfiguruj",
        "inst-3-desc": "Przejdź do folderu Dokumenty i edytuj <code>MICFix\\volume.json</code>.",
        "uninst-title": "Chcesz to usunąć?",
        "uninst-desc": "Uruchom <code>MICFixUninstall.exe</code> jako Administrator. Usunie wszystkie ślady w systemie.",
        "footer-1": "Zbudowany z natywnych API Win32 dla maksymalnej wydajności.",
        "footer-2": "© 2026 bangtony2. Wydany na licencji MIT."
    }
};

const flags = {
    en: '<img src="https://flagcdn.com/w20/us.png" alt="US">',
    ua: '<img src="https://flagcdn.com/w20/ua.png" alt="UA">',
    es: '<img src="https://flagcdn.com/w20/es.png" alt="ES">',
    it: '<img src="https://flagcdn.com/w20/it.png" alt="IT">',
    de: '<img src="https://flagcdn.com/w20/de.png" alt="DE">',
    fr: '<img src="https://flagcdn.com/w20/fr.png" alt="FR">',
    no: '<img src="https://flagcdn.com/w20/no.png" alt="NO">',
    pl: '<img src="https://flagcdn.com/w20/pl.png" alt="PL">'
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
            // Find the closest button if clicked on img
            const targetBtn = e.target.closest('.lang-option');
            const selectedLang = targetBtn.getAttribute("data-lang");
            setLanguage(selectedLang);
            // Save manual choice to localStorage
            localStorage.setItem("micfix_lang", selectedLang);
        });
    });
});

async function initLanguage() {
    const savedLang = localStorage.getItem("micfix_lang");
    if (savedLang && translations[savedLang]) {
        setLanguage(savedLang);
    } else {
        // Fetch IP based location
        try {
            const res = await fetch("https://get.geojs.io/v1/ip/country.json");
            const data = await res.json();
            
            const countryToLang = {
                "UA": "ua",
                "ES": "es", "MX": "es", "AR": "es", "CO": "es", "CL": "es", "PE": "es",
                "IT": "it",
                "DE": "de", "AT": "de", "CH": "de",
                "FR": "fr", "BE": "fr",
                "NO": "no",
                "PL": "pl"
            };
            
            const lang = countryToLang[data.country] || "en";
            setLanguage(lang);
        } catch (e) {
            console.error("Could not fetch location data:", e);
            setLanguage("en");
        }
    }
}

function setLanguage(lang) {
    if (!translations[lang]) return;
    
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
