// Shared main-page components: production mounts and library examples use these factories.
(() => {
  const templates = {
  "buildProgress": "<div class=\"parts-card-head\"><div class=\"parts-head-line\"><strong>Обязательные комплектующие</strong><span><span id=\"required-count\">0</span>/7 <span class=\"question-mark\">?</span></span></div><div class=\"progress\"><span class=\"progress-fill\" id=\"progress-fill\"></span></div></div>",
  "buildTips": "<div class=\"tips-card\"><div class=\"tip\"><div><strong>Выберите комплектующие</strong><span>Начинайте с любой категории</span></div><img src=\"assets/configurator/5CGPS2PC598TFP9Q9A0E442ZMQ.webp\" alt=\"\"></div><div class=\"tip\"><div><strong>Соберите полный комплект</strong><span>Завершив сборку, вы можете добавить её в корзину или сохранить в личном кабинете</span></div><img src=\"assets/configurator/0WK5Q77P4NB9FR808PVF01V0G7.webp\" alt=\"\"></div></div>",
  "buildSummary": "<div class=\"build-summary\" id=\"build-summary\" hidden><div class=\"summary-service\"><span>Услуга сборки 3 199 ₽ <span class=\"question-mark\">?</span></span><span class=\"summary-switch\" aria-hidden=\"true\"></span><small>Недоступна для текущей сборки</small></div><div class=\"summary-main\"><div class=\"summary-total\"><div><strong id=\"summary-item-count\">1 товар</strong><small>В сборке</small></div><div><strong id=\"summary-price\">28 799 ₽</strong><small id=\"summary-monthly\">от 2 807 ₽/ мес.</small></div></div><button type=\"button\" class=\"summary-checkout\">Перейти к оформлению</button><div class=\"summary-actions\"><button type=\"button\" id=\"save-build\" data-telemetry-id=\"build.save\">Сохранить</button><button type=\"button\" id=\"clear-build\">Очистить</button><button type=\"button\" aria-label=\"Дополнительно\">•••</button></div></div><div class=\"summary-availability\">В наличии <span id=\"summary-stores\">в 12 магазинах</span></div></div>",
  "buildWarning": "<div class=\"build-warning\" id=\"build-warning\" hidden><strong>Отсутствуют обязательные комплектующие</strong><span>Добавьте их для завершения сборки</span></div>",
  "appBanner": "<div class=\"app-banner\"><strong>Конфигуратор ПК<br>в мобильном<br>приложении</strong><img src=\"assets/configurator/4SWVXY09B28ZE433H3D16PN3W4.svg\" alt=\"\"></div>",
  "siteHeader": "<header class=\"site-header\">\n    <div class=\"topbar container\">\n      <div class=\"topbar-region\"><span class=\"locale\"><img src=\"assets/configurator/53DBCH0XSEQP26P4M131ZHCH8C.webp\" alt=\"\">Ru <span class=\"chevron\"></span></span><span class=\"city\"><svg class=\"location-icon\" viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z\"/><circle cx=\"12\" cy=\"10\" r=\"2.5\"/></svg><span class=\"city-name\">Москва</span></span></div>\n      <nav class=\"top-nav\" aria-label=\"Разделы сайта\"><span>DNS Видео<i class=\"dot\"></i></span><span>Магазины</span><span>Доставка</span><span>Покупателям<i class=\"chevron\"></i></span><span>Юрлицам</span><span>Клуб DNS</span><span>Предложения брендов</span><span>Сотрудничество<i class=\"chevron\"></i></span></nav>\n      <span class=\"phone\">8-800-77-07-999</span>\n    </div>\n    <div class=\"mainbar-wrap\"><div class=\"mainbar container\">\n      <button class=\"mobile-back\" type=\"button\" aria-label=\"Назад\" onclick=\"history.back()\">‹</button>\n      <div class=\"brand\"><img src=\"assets/configurator/5KFA0XHXZYYMP5Q0P982FTDZFM.svg\" alt=\"DNS\"><span class=\"catalog\">Каталог<svg viewBox=\"0 0 20 20\" aria-hidden=\"true\"><path d=\"m4.6 7.5 5.4 5.4 5.4-5.4\"/></svg></span></div>\n      <div class=\"search\"><span>Поиск по сайту</span><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"10.8\" cy=\"10.8\" r=\"6.8\"/><path d=\"m16 16 4.5 4.5\"/></svg></div>\n      <span class=\"mobile-chat\" aria-label=\"Чат\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M4 5h16v11H9l-5 4V5Z\"/></svg></span>\n      <div class=\"header-actions\">\n        <div><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"3\"/><path d=\"M8 16v-3m4 3V8m4 8v-6\"/></svg><span>Сравнение</span></div>\n        <div><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M12 20c-3.5-2.3-9-6.4-9-10.7A5.1 5.1 0 0 1 12 6a5.1 5.1 0 0 1 9 3.3C21 13.6 15.5 17.7 12 20Z\"/></svg><span>Избранное</span></div>\n        <div><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><path d=\"M2.5 4h2.8l2.4 11h10.7l2.7-8H6.2\"/><circle cx=\"9\" cy=\"20\" r=\".8\"/><circle cx=\"18\" cy=\"20\" r=\".8\"/></svg><span>Корзина</span></div>\n        <div><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"9\"/><circle cx=\"12\" cy=\"9\" r=\"2.5\"/><path d=\"M6.5 18c.9-2.5 2.7-3.8 5.5-3.8s4.6 1.3 5.5 3.8\"/></svg><span>Войти</span></div>\n      </div>\n    </div></div>\n  </header>",
  "homeArticles": "<section class=\"articles\" data-scroll-reveal aria-label=\"Статьи о сборке ПК\">\n      <article><img data-image-src=\"assets/configurator/7KMVAKG9XA55E6PQHDP3FT50AM-preview-720.webp\" data-image-srcset=\"assets/configurator/7KMVAKG9XA55E6PQHDP3FT50AM-preview-720.webp 720w, assets/configurator/7KMVAKG9XA55E6PQHDP3FT50AM-preview.webp 1440w\" data-image-sizes=\"(min-width: 1400px) 428px, (min-width: 768px) calc(33.333vw - 38.667px), calc(100vw - 52px)\" loading=\"lazy\" decoding=\"async\" width=\"1440\" height=\"810\" alt=\"\"><noscript><img src=\"assets/configurator/7KMVAKG9XA55E6PQHDP3FT50AM-preview-720.webp\" srcset=\"assets/configurator/7KMVAKG9XA55E6PQHDP3FT50AM-preview-720.webp 720w, assets/configurator/7KMVAKG9XA55E6PQHDP3FT50AM-preview.webp 1440w\" sizes=\"(min-width: 1400px) 428px, (min-width: 768px) calc(33.333vw - 38.667px), calc(100vw - 52px)\" loading=\"lazy\" decoding=\"async\" width=\"1440\" height=\"810\" alt=\"\"></noscript><strong>Как собрать компьютер - тонкости, детали, важные моменты при сборке ПК</strong></article>\n      <article><img data-image-src=\"assets/configurator/51DJ5KD9E05Z55KH03HVYHHHR2-preview-720.webp\" data-image-srcset=\"assets/configurator/51DJ5KD9E05Z55KH03HVYHHHR2-preview-720.webp 720w, assets/configurator/51DJ5KD9E05Z55KH03HVYHHHR2-preview.webp 1440w\" data-image-sizes=\"(min-width: 1400px) 428px, (min-width: 768px) calc(33.333vw - 38.667px), calc(100vw - 52px)\" loading=\"lazy\" decoding=\"async\" width=\"1440\" height=\"809\" alt=\"\"><noscript><img src=\"assets/configurator/51DJ5KD9E05Z55KH03HVYHHHR2-preview-720.webp\" srcset=\"assets/configurator/51DJ5KD9E05Z55KH03HVYHHHR2-preview-720.webp 720w, assets/configurator/51DJ5KD9E05Z55KH03HVYHHHR2-preview.webp 1440w\" sizes=\"(min-width: 1400px) 428px, (min-width: 768px) calc(33.333vw - 38.667px), calc(100vw - 52px)\" loading=\"lazy\" decoding=\"async\" width=\"1440\" height=\"809\" alt=\"\"></noscript><strong>Охлаждаем ПК: сколько вентиляторов нужно ставить и куда</strong></article>\n      <article><img data-image-src=\"assets/configurator/0ZC92NHRS6376DFEHX21XNXMF4-preview-720.webp\" data-image-srcset=\"assets/configurator/0ZC92NHRS6376DFEHX21XNXMF4-preview-720.webp 720w, assets/configurator/0ZC92NHRS6376DFEHX21XNXMF4-preview.webp 1440w\" data-image-sizes=\"(min-width: 1400px) 428px, (min-width: 768px) calc(33.333vw - 38.667px), calc(100vw - 52px)\" loading=\"lazy\" decoding=\"async\" width=\"1440\" height=\"810\" alt=\"\"><noscript><img src=\"assets/configurator/0ZC92NHRS6376DFEHX21XNXMF4-preview-720.webp\" srcset=\"assets/configurator/0ZC92NHRS6376DFEHX21XNXMF4-preview-720.webp 720w, assets/configurator/0ZC92NHRS6376DFEHX21XNXMF4-preview.webp 1440w\" sizes=\"(min-width: 1400px) 428px, (min-width: 768px) calc(33.333vw - 38.667px), calc(100vw - 52px)\" loading=\"lazy\" decoding=\"async\" width=\"1440\" height=\"810\" alt=\"\"></noscript><strong>Как сделать кабель-менеджмент внутри ПК и вне его? Понадобятся: стяжки, хомуты, органайзеры</strong></article>\n    </section>",
  "communityBuilds": "<section class=\"builds\" aria-label=\"Пользовательские сборки\">\n        <h2>Лучшие пользовательские сборки ПК</h2>\n        <article class=\"build-card\">\n          <div class=\"product-strip\"><img data-image-src=\"assets/configurator/6AEQM7QKMS9K7M4KE02EKD2H37.webp\" alt=\"\"><noscript><img src=\"assets/configurator/6AEQM7QKMS9K7M4KE02EKD2H37.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/616VXX13A2AWE8KZJ3B0TGNQY4.webp\" alt=\"\"><noscript><img src=\"assets/configurator/616VXX13A2AWE8KZJ3B0TGNQY4.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/0SZV3M85CTWE872XJZBG6Z5PW8.webp\" alt=\"\"><noscript><img src=\"assets/configurator/0SZV3M85CTWE872XJZBG6Z5PW8.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/3NFBZT809P5D8EVWJQBGWRWGT8.webp\" alt=\"\"><noscript><img src=\"assets/configurator/3NFBZT809P5D8EVWJQBGWRWGT8.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/5JY6C5Z1J5VH9GNJDGYWZ1TN6B.webp\" alt=\"\"><noscript><img src=\"assets/configurator/5JY6C5Z1J5VH9GNJDGYWZ1TN6B.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/3RJFNFAF37ZVWS1JT2DNTFYXHH.webp\" alt=\"\"><noscript><img src=\"assets/configurator/3RJFNFAF37ZVWS1JT2DNTFYXHH.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/5KTKJGCDX8S555P74DXRZQ1WFJ.webp\" alt=\"\"><noscript><img src=\"assets/configurator/5KTKJGCDX8S555P74DXRZQ1WFJ.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/6FEGGTXCS8RP18EB7SWR5W1QCT.webp\" alt=\"\"><noscript><img src=\"assets/configurator/6FEGGTXCS8RP18EB7SWR5W1QCT.webp\" alt=\"\"></noscript></div>\n          <p class=\"build-date\">Сборка из 8 товаров от 2 сентября</p>\n          <p class=\"build-description\">AMD Ryzen 7 5700X OEM | MSI MPG B550 GAMING PLUS | Palit GeForce RTX 5060 Ti Dual | Kingston FURY Beast Black 32 ГБ | 512 ГБ M.2 NVMe накопитель ADATA LEGEND 710</p>\n          <span class=\"like-count\">♡44</span>\n          <div class=\"build-price\"><strong>145 192 ₽</strong><span>от 14 154 ₽/ мес.</span></div>\n          <div class=\"build-service\"><span class=\"checkbox\"></span>Услуга сборки 4 199₽ <span class=\"service-info\">ⓘ</span></div>\n          <div class=\"build-actions\"><button class=\"more\" type=\"button\">...</button><button class=\"buy\" type=\"button\">Купить</button></div>\n          <div class=\"build-delivery\"><span>При заказе 2 октября (ПТ)</span><span>Доставка: доступна</span></div>\n        </article>\n        <article class=\"build-card\">\n          <div class=\"product-strip\"><img data-image-src=\"assets/configurator/13SG6NX7Y8D6XFQS15YRVG10AJ.webp\" alt=\"\"><noscript><img src=\"assets/configurator/13SG6NX7Y8D6XFQS15YRVG10AJ.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/43H30NW5YCYM1BQG0STRQT93CT.webp\" alt=\"\"><noscript><img src=\"assets/configurator/43H30NW5YCYM1BQG0STRQT93CT.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/7S4A1M85CYQYGA2TQBDKETC1V8.webp\" alt=\"\"><noscript><img src=\"assets/configurator/7S4A1M85CYQYGA2TQBDKETC1V8.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/105Z573X23ZVJRHDWJZ4E4P9HD.webp\" alt=\"\"><noscript><img src=\"assets/configurator/105Z573X23ZVJRHDWJZ4E4P9HD.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/6CYWX1AJ2KASGT9VZJ9MG6PKGS.webp\" alt=\"\"><noscript><img src=\"assets/configurator/6CYWX1AJ2KASGT9VZJ9MG6PKGS.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/4BQGWY5SRRTNZ06D1HF8FX03AP.webp\" alt=\"\"><noscript><img src=\"assets/configurator/4BQGWY5SRRTNZ06D1HF8FX03AP.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/01S8NSRKCPWXMBJ8J3JGJYW7X0.webp\" alt=\"\"><noscript><img src=\"assets/configurator/01S8NSRKCPWXMBJ8J3JGJYW7X0.webp\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/4APNMEQ9H12GBP4KD0MFZ5KB5F.webp\" alt=\"\"><noscript><img src=\"assets/configurator/4APNMEQ9H12GBP4KD0MFZ5KB5F.webp\" alt=\"\"></noscript></div>\n          <p class=\"build-date\">Сборка из 8 товаров от 6 сентября</p>\n          <p class=\"build-description\">AMD Ryzen 5 5600 OEM | MSI B550-A PRO | GIGABYTE GeForce RTX 5050 WINDFORCE OC | Colorful BATTLE-AX 16 ГБ | 256 ГБ M.2 NVMe накопитель ARDOR GAMING Simple SI256TSHI</p>\n          <span class=\"like-count\">♡15 <i>1</i></span>\n          <div class=\"build-price\"><strong>96 292 ₽</strong><span>от 9 387 ₽/ мес.</span></div>\n          <div class=\"build-service\"><span class=\"checkbox\"></span>Услуга сборки 4 199₽ <span class=\"service-info\">ⓘ</span></div>\n          <div class=\"build-actions\"><button class=\"more\" type=\"button\">...</button><button class=\"buy\" type=\"button\">Купить</button></div>\n          <div class=\"build-delivery\"><span>В наличии в 1 магазине</span><span>Доставка: доступна</span></div>\n        </article>\n        <button class=\"all-builds\" type=\"button\">Все сборки</button>\n      </section>",
  "homeGuides": "<aside class=\"guides\" aria-label=\"Полезные материалы\"><img data-image-src=\"assets/configurator/5ZHK0YCYSR3NH8F529HR1W09DA.webp\" alt=\"Опции материнских плат\"><noscript><img src=\"assets/configurator/5ZHK0YCYSR3NH8F529HR1W09DA.webp\" alt=\"Опции материнских плат\"></noscript><img data-image-src=\"assets/configurator/1NK9ZTSA9YYERCTWPQ4GGXCTS8.webp\" alt=\"Как выбрать оперативную память\"><noscript><img src=\"assets/configurator/1NK9ZTSA9YYERCTWPQ4GGXCTS8.webp\" alt=\"Как выбрать оперативную память\"></noscript><img data-image-src=\"assets/configurator/1FT1CYNMW4XMFCFJ2H0BNKS18P.webp\" alt=\"Как выбрать процессор\"><noscript><img src=\"assets/configurator/1FT1CYNMW4XMFCFJ2H0BNKS18P.webp\" alt=\"Как выбрать процессор\"></noscript><img data-image-src=\"assets/configurator/72XQT0ZFN9R0XYN5BW6X332J23.webp\" alt=\"3D V-Cache\"><noscript><img src=\"assets/configurator/72XQT0ZFN9R0XYN5BW6X332J23.webp\" alt=\"3D V-Cache\"></noscript><img data-image-src=\"assets/configurator/43026JNNVM8675QE150B7JSE96.webp\" alt=\"Калькуляторы мощности\"><noscript><img src=\"assets/configurator/43026JNNVM8675QE150B7JSE96.webp\" alt=\"Калькуляторы мощности\"></noscript><img data-image-src=\"assets/configurator/1NJV5QR6DTVZ09VQHKMK0M49X8.webp\" alt=\"Как выбрать корпус\"><noscript><img src=\"assets/configurator/1NJV5QR6DTVZ09VQHKMK0M49X8.webp\" alt=\"Как выбрать корпус\"></noscript></aside>",
  "siteFooter": "<footer class=\"footer\"><div class=\"footer-inner container\">\n    <div class=\"footer-brands\"><img data-image-src=\"assets/configurator/4E9F87BMKF6GCPCRS8NP58F32H.svg\" alt=\"DNS\"><noscript><img src=\"assets/configurator/4E9F87BMKF6GCPCRS8NP58F32H.svg\" alt=\"DNS\"></noscript><div><img data-image-src=\"assets/configurator/050KNZMPD8BYQ2VV3K4B0X1HSP.svg\" alt=\"DNS Клуб\"><noscript><img src=\"assets/configurator/050KNZMPD8BYQ2VV3K4B0X1HSP.svg\" alt=\"DNS Клуб\"></noscript><img data-image-src=\"assets/configurator/38HQF8PB414AQM09CPGCJFK6Q7.svg\" alt=\"DNS Техно\"><noscript><img src=\"assets/configurator/38HQF8PB414AQM09CPGCJFK6Q7.svg\" alt=\"DNS Техно\"></noscript></div><img data-image-src=\"assets/configurator/7B39AJSZTYB7R56RNXJGKMC0BR.svg\" alt=\"DNS Group\"><noscript><img src=\"assets/configurator/7B39AJSZTYB7R56RNXJGKMC0BR.svg\" alt=\"DNS Group\"></noscript></div>\n    <div class=\"footer-columns\"><div class=\"footer-column\"><h3>Компания</h3><span>О компании</span><span>Новости</span><span>Партнерам (аренда, сотрудничество)</span><span>Вакансии</span><span>Политика компании в отношении обработки персональных данных</span><span>Правила продаж</span><span>Правила пользования сайта</span><span>На информационном ресурсе применяются рекомендательные технологии</span><span>Сервисные центры</span></div><div class=\"footer-column\"><h3>Покупателям</h3><div class=\"buyer-links\"><span>Как оформить заказ</span><span>Способы оплаты</span><span>Кредиты</span><span>Доставка</span><span>Статус заказа</span><span>Обмен, возврат, гарантия</span><span>Проверка статуса ремонта</span><span>Юридическим лицам</span><span>Проверка счета</span><span>Корпоративные отделы</span><span>Подарочные карты</span><span>Бонусная программа</span><span>Помощь</span><span>Обратная связь</span></div></div><div class=\"footer-column contact\"><h3>Оставайтесь на связи</h3><strong>8-800-77-07-999 (с 05:00 до 00:00)</strong><span>Адреса магазинов</span><div class=\"social\"><img data-image-src=\"assets/configurator/7KK9GV0FYPVQYFQ0J9Z3KXWHF4.svg\" alt=\"\"><noscript><img src=\"assets/configurator/7KK9GV0FYPVQYFQ0J9Z3KXWHF4.svg\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/77ZAGP9YSECQMBZ4JSZH9YC7D0.svg\" alt=\"\"><noscript><img src=\"assets/configurator/77ZAGP9YSECQMBZ4JSZH9YC7D0.svg\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/59M2XNM3CMDWQ22E0KYA2YR1Y6.svg\" alt=\"\"><noscript><img src=\"assets/configurator/59M2XNM3CMDWQ22E0KYA2YR1Y6.svg\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/10345C7S6X3V3ZHM92QFY9B5KZ.svg\" alt=\"\"><noscript><img src=\"assets/configurator/10345C7S6X3V3ZHM92QFY9B5KZ.svg\" alt=\"\"></noscript></div><div class=\"footer-app\"><strong>DNS всегда под рукой</strong><div><img class=\"qr\" data-image-src=\"assets/configurator/069D2130HQ22PWXCSCF75DYE7N.webp\" alt=\"QR-код приложения\"><noscript><img class=\"qr\" src=\"assets/configurator/069D2130HQ22PWXCSCF75DYE7N.webp\" alt=\"QR-код приложения\"></noscript><div class=\"stores\"><img data-image-src=\"assets/configurator/5W1QBEEE19RASK81AEFZR22EHB.svg\" alt=\"\"><noscript><img src=\"assets/configurator/5W1QBEEE19RASK81AEFZR22EHB.svg\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/5EQWM3K6GBCJTTCDW0E69E7Q6D.svg\" alt=\"\"><noscript><img src=\"assets/configurator/5EQWM3K6GBCJTTCDW0E69E7Q6D.svg\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/4NAHHHNWD0VWVETK3VA94XG5VE.svg\" alt=\"\"><noscript><img src=\"assets/configurator/4NAHHHNWD0VWVETK3VA94XG5VE.svg\" alt=\"\"></noscript><img data-image-src=\"assets/configurator/7C26H8FW358S5G9AFTBZ45VFJ3.svg\" alt=\"\"><noscript><img src=\"assets/configurator/7C26H8FW358S5G9AFTBZ45VFJ3.svg\" alt=\"\"></noscript></div></div></div></div></div>\n    <p class=\"footer-note\">Нашли ошибку на сайте? Выделите текст с ошибкой, нажмите Ctrl+Enter и напишите нам</p>\n    <p class=\"footer-copyright\">© 2002–2026 Компания DNS. Администрация Сайта не несет ответственности за размещаемые Пользователями материалы (в т.ч. информацию и изображения), их содержание и качество.</p>\n  </div></footer>"
};
  const categories = {
  "processor-row": {
    "id": "processor-row",
    "image": "assets/configurator/5T0ER0JHNFDG2K4PR885Z6EH6X.svg",
    "title": "Процессор",
    "required": "Обязательно",
    "buttonAttributes": " type=\"button\" id=\"add-processor\" aria-haspopup=\"dialog\" aria-controls=\"processor-modal\""
  },
  "motherboard-row": {
    "id": "motherboard-row",
    "image": "assets/configurator/0S0GBVNS8GEDB23B1Z4B6ZGESY.svg",
    "title": "Мат. плата",
    "required": "Обязательно",
    "buttonAttributes": " type=\"button\" id=\"add-motherboard\" aria-haspopup=\"dialog\" aria-controls=\"motherboard-modal\""
  },
  "power-supply-row": {
    "id": "power-supply-row",
    "image": "assets/configurator/07ER2V8AWTF4MBY3KX9J1Q4490.svg",
    "title": "Блок питания",
    "required": "Обязательно",
    "buttonAttributes": " type=\"button\" id=\"add-power-supply\" aria-haspopup=\"dialog\" aria-controls=\"power-supply-modal\""
  },
  "case-row": {
    "id": "case-row",
    "image": "assets/configurator/12AYWCT9HB3G0WM7V0YQQ57H79.svg",
    "title": "Корпус",
    "required": "Обязательно",
    "buttonAttributes": " type=\"button\" id=\"add-case\" aria-haspopup=\"dialog\" aria-controls=\"case-modal\""
  },
  "gpu-row": {
    "id": "gpu-row",
    "image": "assets/configurator/6BD96VRBSYC6827GH5TH3NCYD8.svg",
    "title": "Видеокарта",
    "required": "",
    "buttonAttributes": " type=\"button\" id=\"add-gpu\" aria-haspopup=\"dialog\" aria-controls=\"gpu-modal\""
  },
  "empty-5": {
    "id": "",
    "image": "assets/configurator/33H8MS1HRYVP2EPMJHZ37RC1DC.svg",
    "title": "Охлаждение процессора",
    "required": "Обязательно",
    "buttonAttributes": " type=\"button\""
  },
  "empty-6": {
    "id": "",
    "image": "assets/configurator/1QFTWM0CWAPPYDYSN112XV57F4.svg",
    "title": "Оперативная память",
    "required": "Обязательно",
    "buttonAttributes": " type=\"button\""
  },
  "empty-7": {
    "id": "",
    "image": "assets/configurator/78B670FX15N8HP1M86QXPBV8GV.svg",
    "title": "Накопители",
    "required": "Обязательно",
    "buttonAttributes": " type=\"button\""
  },
  "empty-8": {
    "id": "",
    "image": "assets/configurator/0X607QM29WBC33BJ37AB0N94TY.svg",
    "title": "Звуковая карта",
    "required": "",
    "buttonAttributes": " type=\"button\""
  },
  "empty-9": {
    "id": "",
    "image": "assets/configurator/5QKA0XSEWYEQR5Y8H9CJHYDF8R.svg",
    "title": "Доп. детали",
    "required": "",
    "buttonAttributes": " type=\"button\""
  },
  "empty-10": {
    "id": "",
    "image": "assets/configurator/5M8479QE75YA7JSYA6PD8BTJH7.svg",
    "title": "Периферия",
    "required": "",
    "buttonAttributes": " type=\"button\""
  },
  "empty-11": {
    "id": "",
    "image": "assets/configurator/423Q22ZXQH511GN19C6YF3J44B.svg",
    "title": "ПО",
    "required": "",
    "buttonAttributes": " type=\"button\""
  }
};
  const parse = html => {const template = document.createElement('template'); template.innerHTML = html; return template.content.firstElementChild;};
  const define = (id, title, create) => {catalogUI.components[id] = {id,title,context:'',create};};
  for (const [id, html] of Object.entries(templates)) define(id, id, () => {
    const component = parse(html);
    if (id === 'siteHeader') component.querySelectorAll('.locale,.city,.top-nav>span,.catalog,.search,.mobile-chat,.header-actions>div').forEach(control => control.setAttribute('aria-disabled','true'));
    if (id === 'buildSummary') component.querySelectorAll('.summary-checkout,.summary-actions>button:not([id])').forEach(control => { control.disabled = true; });
    return component;
  });
  define('emptyCategory', 'Незаполненная категория', data => {
    const row = parse('<div class="part-row"><img alt=""><span></span><small></small><button type="button">Добавить</button></div>');
    if (data.id) row.id = data.id;
    row.querySelector('span').textContent = data.title;
    row.querySelector('img').replaceWith(catalogUI.colorImage(data.image));
    row.querySelector('small').textContent = data.required;
    // Attributes are static page configuration, never user input.
    if (data.buttonAttributes) row.lastElementChild.replaceWith(parse('<button'+data.buttonAttributes+'>Добавить</button>'));
    const supported = ['processor-row','motherboard-row','power-supply-row','case-row','gpu-row'].includes(data.id);
    const toggle = catalogUI.component('quickPickerButton');
    toggle.classList.add('build-board-toggle');toggle.title='Быстрый подбор';
    toggle.setAttribute('aria-label', `Быстрый подбор: ${data.title}`);
    toggle.dataset.telemetryId='suggestion.toggle';
    toggle.disabled = !supported;
    row.lastElementChild.disabled = !supported;
    row.append(toggle);
    return row;
  });
  catalogUI.configuratorCategories = categories;
  document.querySelectorAll('[data-configurator-component]').forEach(host => host.replaceWith(catalogUI.component(host.dataset.configuratorComponent)));
  document.querySelectorAll('[data-configurator-category]').forEach(host => {
    const key = host.dataset.configuratorCategory;
    const row = catalogUI.component('emptyCategory', categories[key]);
    if (!row.id) row.id = key;
    host.replaceWith(row);
  });
})();
