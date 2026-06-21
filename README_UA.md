<div align="right">
  Мова: <a href="README.md">🇬🇧 English</a> | 🇺🇦 <b>Українська</b>
</div>

# 🎤 MICFix — Служба фіксації гучності мікрофона

<div align="center">
  <a href="https://bangtony2.github.io/MicVolumeService/" target="_blank">
    <img src="https://img.shields.io/badge/🌐_Відвідати_Офіційний_Сайт-18181b?style=for-the-badge&logo=googlechrome&logoColor=3b82f6" alt="Офіційний Сайт"/>
  </a>
</div>

Легка служба Windows (DLL), яка **назавжди фіксує гучність мікрофона** (за замовчуванням) на заданому рівні. Незалежно від того, чи змінила її система, сторонні застосунки або ви власноруч — гучність повертається назад **миттєво**.

## ✨ Основні можливості

| Можливість | Опис |
|---|---|
| 🔒 **Фіксація гучності** | Утримує гучність мікрофона навіть після змін у системі або користувачем |
| ⚡ **Нульове навантаження (0% CPU)** | Повністю подієва (event-driven) архітектура — жодного опитування (polling) чи таймерів |
| 📦 **Служба у форматі DLL** | Працює через `svchost.exe` — немає окремого `.exe` процесу |
| 🔄 **Конфігурація на льоту** | Змініть `volume.json` → гучність оновиться миттєво |
| 🎯 **Автовизначення** | Автоматично відстежує зміни мікрофона за замовчуванням |
| 🚀 **Встановлення в один клік** | Єдиний файл `MICFixInstall.exe` — запустіть один раз і забудьте |
| 🧹 **Чисте видалення** | `MICFixUninstall.exe` видаляє все без залишків у системі |

## 🏗️ Архітектура

```
svchost.exe -k MICFixGroup
    └── MICFixService.dll
            ├── IAudioEndpointVolumeCallback  → змінилася гучність? → повернути як було
            ├── IMMNotificationClient         → змінився мікрофон? → перепідключитись
            └── FindFirstChangeNotification   → змінився конфіг? → перечитати
```

**Як досягається 0% навантаження на процесор:**
Служба «спить» у функції `WaitForMultipleObjects` і прокидається **лише** тоді, коли спрацьовує одна з подій на рівні операційної системи. Жодних нескінченних циклів, жодних викликів `Sleep()` чи спалювання ресурсів процесора.

## 📥 Встановлення

### Готова збірка (Рекомендовано)
1. Завантажте `MICFixService.dll` та `MICFixInstall.exe` з розділу [Releases](https://github.com/bangtony2/MicVolumeService/releases)
2. Помістіть обидва файли в одну папку
3. Запустіть `MICFixInstall.exe` від імені Адміністратора
4. ✅ Готово! Гучність мікрофона зафіксована

### Збірка з вихідного коду
Потребує **MSVC Build Tools 2022** (або Visual Studio з підтримкою розробки на C++).

```bash
# Відкрийте "Developer Command Prompt for VS 2022"
git clone https://github.com/bangtony2/MicVolumeService.git
cd MicVolumeService
build.bat
```

Результат:
- `MICFixService.dll` — DLL служби (завантажується через `svchost.exe`)
- `MICFixInstall.exe` — Інсталятор (запускається одноразово)
- `MICFixUninstall.exe` — Деінсталятор

**Альтернатива через CMake:**
```bash
cmake -B build -G "Visual Studio 17 2022"
cmake --build build --config Release
```

## ⚙️ Налаштування

Після встановлення файл конфігурації буде створено за шляхом:
```
Documents\MICFix\volume.json
```

```json
{
  "volume": 85
}
```

- Змініть значення (0–100) та **збережіть** файл — гучність оновиться **миттєво**
- Перезапускати службу не потрібно

## 🧹 Видалення

1. Запустіть `MICFixUninstall.exe` від імені Адміністратора
2. Службу буде зупинено та видалено з реєстру
3. Ваш конфігураційний файл (`volume.json`) залишиться недоторканим

## 🔧 Як це працює

| Компонент | Призначення |
|---|---|
| `MICFixService.dll` | Основна DLL служби, яка завантажується через `svchost.exe` |
| `IAudioEndpointVolumeCallback` | COM-колбек (callback) — спрацьовує, коли змінюється гучність мікрофона |
| `IMMNotificationClient` | COM-колбек — спрацьовує, коли змінюється мікрофон за замовчуванням |
| `FindFirstChangeNotification` | Win32 API — спрацьовує під час редагування файлу `volume.json` |
| `WaitForMultipleObjects` | Присипляє потік до виникнення будь-якої з подій (навантаження 0% CPU) |

### Що робить інсталятор
1. Створює файл `Documents\MICFix\volume.json` (за замовчуванням 85%)
2. Копіює `MICFixService.dll` до `C:\ProgramData\MICFix\`
3. Реєструє групу для `svchost` (`MICFixGroup`)
4. Створює службу Windows із параметром автоматичного запуску (`SERVICE_AUTO_START`)
5. Миттєво запускає службу

## 📁 Структура проєкту

```
MicVolumeService/
├── MICFixService.cpp    # DLL служби — Основна логіка (звук, конфігурація, події)
├── MICFixService.def    # Файл експорту DLL (визначає ServiceMain)
├── MICFixInstall.cpp    # Інсталятор (запустити лише один раз)
├── MICFixUninstall.cpp  # Деінсталятор
├── build.bat            # Скрипт для збірки за допомогою MSVC
├── CMakeLists.txt       # Конфігурація збірки для CMake
├── README.md            # Документація англійською
└── README_UA.md         # Документація українською
```

## 📋 Вимоги

- **Операційна система:** Windows 10 / 11
- **Для збірки:** MSVC Build Tools 2022+ (або Visual Studio)
- **Середовище виконання (Runtime):** Не потрібне — статична лінковка (`/MT`), жодних зовнішніх залежностей

## 📜 Ліцензія

MIT
