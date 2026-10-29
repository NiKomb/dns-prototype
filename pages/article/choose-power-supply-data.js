export default {
  "id": "dns-14934",
  "title": "Как выбрать блок питания для компьютера",
  "date": "1 год назад",
  "readingTime": "10 мин",
  "stats": {
    "votes": "53",
    "comments": "79",
    "views": "394.3k",
    "reactions": "2"
  },
  "blocks": [
    {
      "id": "choose-power-supply-1hh6-0",
      "sourceNode": "1HH6-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Блок питания, он же БП или PSU (Power Supply Unit), отвечает за преобразование переменного напряжения из розетки 220 вольт в постоянные пониженные напряжения для питания комплектующих компьютера. Выбирают блоки питания по следующим ключевым характеристикам: мощность, форм-фактор, набор разъемов для подключения, сертификация 80 Plus, система охлаждения и возможность отсоединения кабелей (модульная конструкция)."
        }
      ],
      "variant": "lead"
    },
    {
      "id": "choose-power-supply-1hh7-0",
      "sourceNode": "1HH7-0",
      "type": "heading",
      "level": 2,
      "text": "Общая мощность и выходные напряжения"
    },
    {
      "id": "choose-power-supply-1hh8-0",
      "sourceNode": "1HH8-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Электрическая мощность определяет количество энергии, которая расходуется во время работы любого электроприбора. Мощность блока питания как минимум должна соответствовать суммарной потребляемой мощности всех комплектующих."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hh9-0",
      "sourceNode": "1HH9-0",
      "type": "product",
      "productId": "dns-14934-product-1hh9-0"
    },
    {
      "id": "choose-power-supply-1hhi-0",
      "sourceNode": "1HHI-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Общая мощности состоит из суммы мощностей по трем линиям выходного напряжения:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1hhj-0",
      "sourceNode": "1HHJ-0",
      "type": "list",
      "items": [
        [
          {
            "text": "12 В;"
          }
        ],
        [
          {
            "text": "5 В;"
          }
        ],
        [
          {
            "text": "3,3 В."
          }
        ]
      ]
    },
    {
      "id": "choose-power-supply-1hht-0",
      "sourceNode": "1HHT-0",
      "type": "quote",
      "content": [
        {
          "text": "Именно она указана в названии/модели блока питания."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hhx-0",
      "sourceNode": "1HHX-0",
      "type": "image",
      "caption": "БП Deepcool PX1000G общей мощностью 1000 Вт (или 1 кВт)",
      "image": {
        "src": "../../assets/articles/optimized/1d79dcf1ac95.webp",
        "width": 760,
        "height": 503
      }
    },
    {
      "id": "choose-power-supply-1hi3-0",
      "sourceNode": "1HI3-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Так как основные потребители электрической энергии в ПК питаются от линии 12 вольт, выбирать БП только по общей мощности некорректно."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hi4-0",
      "sourceNode": "1HI4-0",
      "type": "heading",
      "level": 2,
      "text": "Мощность по линии 12 вольт"
    },
    {
      "id": "choose-power-supply-1hi5-0",
      "sourceNode": "1HI5-0",
      "type": "paragraph",
      "content": [
        {
          "text": "12 вольт — основная линия питания комплектующих. На ней висят главные потребители в ПК:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1hi6-0",
      "sourceNode": "1HI6-0",
      "type": "list",
      "items": [
        [
          {
            "text": "Процессор"
          }
        ],
        [
          {
            "text": "Видеокарта"
          }
        ]
      ]
    },
    {
      "id": "choose-power-supply-1hid-0",
      "sourceNode": "1HID-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Остальные комплектующие она так же питает, но их энергопотребление в сравнении с процессором и видеокартой ничтожно мало."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hie-0",
      "sourceNode": "1HIE-0",
      "type": "paragraph",
      "content": [
        {
          "text": "5 и 3,3 вольта являются вспомогательными линиями и питают слаботочные компоненты. Например, различные контроллеры на материнской плате, частично накопители и периферию через USB-разъемы. Суммарная потребляемая мощность по этим линиям едва ли превышает десяток-другой ватт, поэтому при выборе не играет значимой роли."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hif-0",
      "sourceNode": "1HIF-0",
      "type": "quote",
      "content": [
        {
          "tag": "strong",
          "children": [
            {
              "text": "Выбирать блок питания необходимо по мощности линии 12 вольт."
            }
          ]
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hik-0",
      "sourceNode": "1HIK-0",
      "type": "paragraph",
      "content": [
        {
          "text": "На этикетке блока питания и в характеристиках товарных карточек указаны параметры токов и напряжений, по которым можно оценить, какую нагрузку выдержит та или иная линия. В идеале, блок питания должен отдавать всю мощность по линии 12 В:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1hil-0",
      "sourceNode": "1HIL-0",
      "type": "image",
      "caption": "Пример хорошего БП, у которого мощность по линии 12 В почти равна общей выдаваемой мощности",
      "image": {
        "src": "../../assets/articles/optimized/b6f58f1f2160.webp",
        "width": 704,
        "height": 600
      }
    },
    {
      "id": "choose-power-supply-1hir-0",
      "sourceNode": "1HIR-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Бывают ситуации, когда мощность по линии 12 вольт ниже общей на 10-20% или более:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1his-0",
      "sourceNode": "1HIS-0",
      "type": "image",
      "caption": "БП с общей мощностью 600 Вт и только 552 Вт по линии +12 вольт",
      "image": {
        "src": "../../assets/articles/optimized/cef13a4cb8ae.webp",
        "width": 760,
        "height": 393
      }
    },
    {
      "id": "choose-power-supply-1hiy-0",
      "sourceNode": "1HIY-0",
      "type": "paragraph",
      "content": [
        {
          "text": "В этом случае, если суммарное потребление видеокарты и процессора хоть немного превышает 552 Вт, то блок питания такой компьютер уже не потянет, хоть и выдает 600 Вт в целом. Не говоря уже про то, чтобы иметь хоть небольшой запас."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hiz-0",
      "sourceNode": "1HIZ-0",
      "type": "quote",
      "content": [
        {
          "text": "На этикетках дополнительно указаны предельные токи для каждой линии. Измеряется в А, амперах. Чтобы посчитать ток, достаточно поделить мощность на напряжение. Чтобы посчитать мощность — умножьте напряжение на ток. Например, 46 А x 12 В = 552 Вт."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hj3-0",
      "sourceNode": "1HJ3-0",
      "type": "heading",
      "level": 2,
      "text": "Как подобрать блок питания по мощности?"
    },
    {
      "id": "choose-power-supply-1hj4-0",
      "sourceNode": "1HJ4-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Самый простой способ — воспользоваться рекомендациями производителей видеокарт."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hj5-0",
      "sourceNode": "1HJ5-0",
      "type": "quote",
      "content": [
        {
          "tag": "strong",
          "children": [
            {
              "text": " "
            }
          ]
        },
        {
          "tag": "strong",
          "children": [
            {
              "text": "Рекомендованная мощность блоков питания для видеокарт, энергопотребление и конфигурация разъемов"
            }
          ]
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hjc-0",
      "sourceNode": "1HJC-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Второй способ — просуммировать потребляемую мощность отдельно видеокарты и отдельно процессора. Затем накинуть сверху запас в 20-30%. Таким образом подбор будет несколько точнее. Методика сложна тем, что придется самостоятельно выяснять, какую мощность потребляют ваши комплектующие."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hjd-0",
      "sourceNode": "1HJD-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Третий способ — воспользоваться калькулятором мощности."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hje-0",
      "sourceNode": "1HJE-0",
      "type": "quote",
      "content": [
        {
          "text": "Онлайн-калькуляторы для определения мощности ПК — теория и практика"
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hji-0",
      "sourceNode": "1HJI-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Четвертый способ — спросить у специалистов."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hjj-0",
      "sourceNode": "1HJJ-0",
      "type": "quote",
      "content": [
        {
          "tag": "strong",
          "children": [
            {
              "text": "В нашем коммуникаторе опытные и разбирающиеся участники Клуба DNS подберут вам БП правильной мощности. Создайте тему и составьте список ваших комплектующих."
            }
          ]
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hjo-0",
      "sourceNode": "1HJO-0",
      "type": "heading",
      "level": 2,
      "text": "Форм-фактор"
    },
    {
      "id": "choose-power-supply-1hjp-0",
      "sourceNode": "1HJP-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Выбор форм-фактора блока питания определяется корпусом, в котором вы предполагаете разместить комплектующие. От форм-фактора зависят габариты БП по ширине, высоте и глубине. Большинство идет в форм-факторе ATX, для стандартных корпусов."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hjq-0",
      "sourceNode": "1HJQ-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/7c2806fe80eb.webp",
        "width": 760,
        "height": 286
      }
    },
    {
      "id": "choose-power-supply-1hjv-0",
      "sourceNode": "1HJV-0",
      "type": "paragraph",
      "content": [
        {
          "text": "В небольших системных блоков стандарта microATX, FlexATX, десктопов и других, устанавливаются блоки меньших размеров, такие как SFX, Flex-ATX и TFX."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hjw-0",
      "sourceNode": "1HJW-0",
      "type": "product",
      "productId": "dns-14934-product-1hjw-0"
    },
    {
      "id": "choose-power-supply-1hk5-0",
      "sourceNode": "1HK5-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Стандарт АТХ четко оговаривает два габаритных размера для БП — высота 86 мм и ширина 150 мм. В длину блоки могут быть различны."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hk6-0",
      "sourceNode": "1HK6-0",
      "type": "image",
      "caption": "Оба БП форм-фактора ATX, но длина значительно отличается.",
      "image": {
        "src": "../../assets/articles/optimized/96b3bfa639a1.webp",
        "width": 760,
        "height": 467
      }
    },
    {
      "id": "choose-power-supply-1hkc-0",
      "sourceNode": "1HKC-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Производители корпусов обычно пишут, какой максимальной длины БП можно установить в их корпус."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hkd-0",
      "sourceNode": "1HKD-0",
      "type": "heading",
      "level": 2,
      "text": "Разъемы"
    },
    {
      "id": "choose-power-supply-1hke-0",
      "sourceNode": "1HKE-0",
      "type": "heading",
      "level": 3,
      "text": "Основной разъем ATX 24-pin"
    },
    {
      "id": "choose-power-supply-1hkf-0",
      "sourceNode": "1HKF-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/216448b6dbff.webp",
        "width": 567,
        "height": 479
      }
    },
    {
      "id": "choose-power-supply-1hkk-0",
      "sourceNode": "1HKK-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Присутствует во всех блоках и подключается к материнской плате. Не участвует в питании центрального процессора — для CPU отдельный разъем."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hkl-0",
      "sourceNode": "1HKL-0",
      "type": "heading",
      "level": 3,
      "text": "Разъем питания процессора"
    },
    {
      "id": "choose-power-supply-1hkm-0",
      "sourceNode": "1HKM-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Бывает 4-контактным в устаревших или маломощных системах и 8-контактным, который часто разделяется на два разъема по 4."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hkn-0",
      "sourceNode": "1HKN-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/5e3295f908ca.webp",
        "width": 542,
        "height": 454
      }
    },
    {
      "id": "choose-power-supply-1hks-0",
      "sourceNode": "1HKS-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Разъемы 4-pin и 8-pin обратносовместимы. Т.е. можно вставить 4-pin в гнездо 8-pin и наоборот. Если это предусмотрено производителем материнской платы, то всё заведется и ничего не сломается."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hkt-0",
      "sourceNode": "1HKT-0",
      "type": "quote",
      "content": [
        {
          "text": "Главное, не перепутать с разъемом для видеокарты. На последнем написано PCIe, а для питания процессора используется разъем с аббревиатурой CPU."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hkx-0",
      "sourceNode": "1HKX-0",
      "type": "paragraph",
      "content": [
        {
          "text": "В некоторых высокопроизводительных системах HEDT с вычислительными 32- или 64-ядерными процессорами (например, AMD Ryzen Threadripper) может требоваться два разъема питания CPU."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hky-0",
      "sourceNode": "1HKY-0",
      "type": "image",
      "caption": "Топовая материнка ASUS Pro WS WRX80E-SAGE SE с двумя разъемами питания CPU",
      "image": {
        "src": "../../assets/articles/optimized/9b8e25df1312.webp",
        "width": 760,
        "height": 489
      }
    },
    {
      "id": "choose-power-supply-1hl4-0",
      "sourceNode": "1HL4-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Но подавляющее большинство обычных потребительских компьютеров, даже мощных игровых, обходится только одним."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hl5-0",
      "sourceNode": "1HL5-0",
      "type": "heading",
      "level": 3,
      "text": "Разъемы для питания видеокарты 16 pin (12V-2x6 или 12VHPWR)"
    },
    {
      "id": "choose-power-supply-1hl6-0",
      "sourceNode": "1HL6-0",
      "type": "paragraph",
      "content": [
        {
          "text": "С приходом стандарта ATX 3.0 введен одиночный разъем 12VHPWR, а затем более новый 12V-2x6, для питания видеокарты. Состоит из 12 основными питающими пинами и четырьмя контрольными."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hl7-0",
      "sourceNode": "1HL7-0",
      "type": "quote",
      "content": [
        {
          "text": "Обычно присутствует на видеокартах поколения RTX 4000 и старших моделях RTX 3000, у RTX 5000 и новее. Встречается так же в некоторых вариациях видеокарт AMD. Очень редко, но всё же, существуют видеокарты сразу с двумя разъемами 12VHPWR или 12V-2x6."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hlb-0",
      "sourceNode": "1HLB-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/fe989e3cf464.webp",
        "width": 477,
        "height": 380
      }
    },
    {
      "id": "choose-power-supply-1hlg-0",
      "sourceNode": "1HLG-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Маркировка на разъеме соответствует предельной мощности, которую он поддерживает по спецификациям: 150, 300, 450 и 600 Вт."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hlh-0",
      "sourceNode": "1HLH-0",
      "type": "product",
      "productId": "dns-14934-product-1hlh-0"
    },
    {
      "id": "choose-power-supply-1hlq-0",
      "sourceNode": "1HLQ-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Разъемы 12VHPWR и 12V-2x6 по формату и поддерживаемым мощностям идентичны и обратносовместимы. 12V-2x6 новее и отличается только повышенной надежностью соединения и более длинными пинами."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hlr-0",
      "sourceNode": "1HLR-0",
      "type": "heading",
      "level": 3,
      "text": "Разъем питания видеокарты PCIe 6-pin, 6+2 pin, 8-pin"
    },
    {
      "id": "choose-power-supply-1hls-0",
      "sourceNode": "1HLS-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Бывают двух типов: 6-контактный и 8-контактный (6+2 или 8). 8-контактный чаще всего представлен в виде разборного разъема 6+2-pin."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hlt-0",
      "sourceNode": "1HLT-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/4af2a37cb787.webp",
        "width": 410,
        "height": 376
      }
    },
    {
      "id": "choose-power-supply-1hly-0",
      "sourceNode": "1HLY-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Через 6-контактный разъем можно обеспечить мощность до 75 Вт, через 8-контактный — до 150 Вт. На видеокартах с высокой потребляемой мощностью теоретически может присутствовать до четырех разъемов 6+2-pin. Но чаще всего два или три в топовых моделях и по одному в моделях среднего и нижнего ценового диапазона."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hlz-0",
      "sourceNode": "1HLZ-0",
      "type": "quote",
      "content": [
        {
          "text": "Обычно, у БП количество разъемов для видеокарты соответствует мощности блока питания. Так, нет никакого смысла ставить четыре разъема в слабый блок питания на 500 Вт. Такую видеокарту он все равно не потянет. И наоборот: в моделях на полторы тысячи ватт или две тысячи количество разъемов может достигать восьми и больше для серьезных вычислительных машин или майнинговых ферм с двумя и более видеокартами."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hm3-0",
      "sourceNode": "1HM3-0",
      "type": "paragraph",
      "content": [
        {
          "tag": "strong",
          "children": [
            {
              "text": "Таблица с типичной конфигурацией разъемов питания видеокарт."
            }
          ]
        }
      ]
    },
    {
      "id": "choose-power-supply-1hm6-0",
      "sourceNode": "1HM6-0",
      "type": "heading",
      "level": 3,
      "text": "SATA"
    },
    {
      "id": "choose-power-supply-1hm7-0",
      "sourceNode": "1HM7-0",
      "type": "paragraph",
      "content": [
        {
          "text": "15-контактный разъем для питания HDD, SSD и некоторых других комплектующих. Например, для контроллеров-хабов RGB-вентиляторов, для звуковых карт и иных плат расширения."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hm8-0",
      "sourceNode": "1HM8-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/b1d99ff692dd.webp",
        "width": 498,
        "height": 415
      }
    },
    {
      "id": "choose-power-supply-1hmd-0",
      "sourceNode": "1HMD-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Включает в себя сразу все линии напряжения: 3,3, 5 и 12 вольт."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hme-0",
      "sourceNode": "1HME-0",
      "type": "heading",
      "level": 3,
      "text": "Molex"
    },
    {
      "id": "choose-power-supply-1hmf-0",
      "sourceNode": "1HMF-0",
      "type": "paragraph",
      "content": [
        {
          "text": "4-контактный разъем. Ранее применялся для питания HDD и приводов оптических дисков."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hmg-0",
      "sourceNode": "1HMG-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/5300dc1be626.webp",
        "width": 506,
        "height": 409
      }
    },
    {
      "id": "choose-power-supply-1hml-0",
      "sourceNode": "1HML-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Производители скорее «на всякий случай» добавляют на кабель с SATA один-два Molex на конце, потому что в современном компьютере практически не нужны."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hmm-0",
      "sourceNode": "1HMM-0",
      "type": "quote",
      "content": [
        {
          "text": "Если у вас старый ПК с множеством накопителей с питанием Molex и оптическими приводами, то современный БП без переходников не подойдет."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hmq-0",
      "sourceNode": "1HMQ-0",
      "type": "heading",
      "level": 2,
      "text": "Стандарт ATX"
    },
    {
      "id": "choose-power-supply-1hmr-0",
      "sourceNode": "1HMR-0",
      "type": "paragraph",
      "content": [
        {
          "text": "На момент написания гайда, все БП можно условно разделить на постепенно устаревающиеATX 2.х, и на современные ATX 3.0 и выше. ATX 3.0 вышли на рынок, привнеся новый разъем12VHPWR, а ATX 3.1 засветились с обновленным разъемом 12V-2x6 для видеокарт. Других существенных различий с точки зрения обычного пользователя нет."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hms-0",
      "sourceNode": "1HMS-0",
      "type": "quote",
      "content": [
        {
          "text": "Старые версии ATX уже давно не актуальны: постепенно все ATX 2.x будут выводиться из продажи."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hmw-0",
      "sourceNode": "1HMW-0",
      "type": "product",
      "productId": "dns-14934-product-1hmw-0"
    },
    {
      "id": "choose-power-supply-1hn5-0",
      "sourceNode": "1HN5-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Помните, что если вы планируете приобрести видеокарту NVIDIA, начиная с RTX 4000 и старше, и не хотите возиться с переходниками, вам нужен блок питания ATX 3.0 и новее."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hn6-0",
      "sourceNode": "1HN6-0",
      "type": "heading",
      "level": 2,
      "text": "Отстегивающиеся кабели"
    },
    {
      "id": "choose-power-supply-1hn7-0",
      "sourceNode": "1HN7-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Три варианта:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1hn8-0",
      "sourceNode": "1HN8-0",
      "type": "list",
      "items": [
        [
          {
            "text": "с отстегивающимися кабелями (модульная конструкция);"
          }
        ],
        [
          {
            "text": "частично модульная конструкция — основные кабели припаянные, остальные — отсоединяемые."
          }
        ],
        [
          {
            "text": "неотсоединяемые припаянные к плате;"
          }
        ]
      ]
    },
    {
      "id": "choose-power-supply-1hni-0",
      "sourceNode": "1HNI-0",
      "type": "gallery",
      "images": [
        {
          "src": "../../assets/articles/optimized/1810e8d0a6c3-616cce1d8b6b.avif",
          "width": 600,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/1d1ce54fc1c5-284c78421604.avif",
          "width": 600,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/96dc69467596-622267f6df32.avif",
          "width": 600,
          "height": 600
        }
      ]
    },
    {
      "id": "choose-power-supply-1hnt-0",
      "sourceNode": "1HNT-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Отстегивающиеся кабели удобны тем, что неиспользуемые можно убрать, чтобы они не захламляли внутреннее пространство корпуса и не мешали охлаждению. Полностью модульные БП удобны еще при снятии блока для чистки."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hnu-0",
      "sourceNode": "1HNU-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/e6da6425d4ee.webp",
        "width": 600,
        "height": 600
      }
    },
    {
      "id": "choose-power-supply-1hnz-0",
      "sourceNode": "1HNZ-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Из минусов модульной конструкции:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1ho0-0",
      "sourceNode": "1HO0-0",
      "type": "list",
      "items": [
        [
          {
            "text": "Такие БП дороже обычных;"
          }
        ],
        [
          {
            "text": "Разъемы занимают лишнее пространство. Пусть и немного, но в компактных корпусах это может быть критичный момент."
          }
        ]
      ]
    },
    {
      "id": "choose-power-supply-1ho7-0",
      "sourceNode": "1HO7-0",
      "type": "heading",
      "level": 2,
      "text": "Система охлаждения"
    },
    {
      "id": "choose-power-supply-1ho8-0",
      "sourceNode": "1HO8-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Бывает трех видов:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1ho9-0",
      "sourceNode": "1HO9-0",
      "type": "list",
      "items": [
        [
          {
            "text": "Активная. Во время работы блока вентилятор вращается постоянно."
          }
        ],
        [
          {
            "text": "Полупассивная. При низких нагрузках вентилятор не работает."
          }
        ],
        [
          {
            "text": "Пассивная. Вентилятора нет, как и шума."
          }
        ]
      ]
    },
    {
      "id": "choose-power-supply-1hoj-0",
      "sourceNode": "1HOJ-0",
      "type": "image",
      "caption": "Полностью пассивный БП без вентилятора",
      "image": {
        "src": "../../assets/articles/optimized/7d68107eb8d2.webp",
        "width": 600,
        "height": 600
      }
    },
    {
      "id": "choose-power-supply-1hop-0",
      "sourceNode": "1HOP-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Блоки питания с пассивным охлаждением редки и очень дороги."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hoq-0",
      "sourceNode": "1HOQ-0",
      "type": "gallery",
      "images": [
        {
          "src": "../../assets/articles/optimized/a22ef3dadf45-dba4737d2bef.avif",
          "width": 600,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/cfee5299e883-5d442aaf5909.avif",
          "width": 600,
          "height": 600
        }
      ]
    },
    {
      "id": "choose-power-supply-1hoy-0",
      "sourceNode": "1HOY-0",
      "type": "list",
      "items": [
        [
          {
            "text": "Плюсы пассивного и полупассивного охлаждения: низкий уровень шума (или его отсутствие) и меньше накапливает пыль."
          }
        ],
        [
          {
            "text": "Минус: сложнее подобрать корпус — с глухим отсеком для БП не подойдёт, высокая цена."
          }
        ]
      ]
    },
    {
      "id": "choose-power-supply-1hp5-0",
      "sourceNode": "1HP5-0",
      "type": "product",
      "productId": "dns-14934-product-1hp5-0"
    },
    {
      "id": "choose-power-supply-1hpe-0",
      "sourceNode": "1HPE-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Вентиляторы в основном встречаются типоразмера 120 или 140 мм. Маленькие, размером 90 мм и меньше, которые встраиваются в переднюю или заднюю стенку, встречаются в компактных моделях или в старых доисторических БП."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hpf-0",
      "sourceNode": "1HPF-0",
      "type": "gallery",
      "images": [
        {
          "src": "../../assets/articles/optimized/66785968b4b4-d54f5b2b5cc2.avif",
          "width": 600,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/3af7e4ef9814-c827d0796cfd.avif",
          "width": 600,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/3e05b1165336-74c6ce5eaad3.avif",
          "width": 600,
          "height": 600
        }
      ]
    },
    {
      "id": "choose-power-supply-1hpq-0",
      "sourceNode": "1HPQ-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Вопреки распространенному мифу, что маленькие вентиляторы всегда работают громче больших, на деле они могут не отличаться по уровню шума — все зависит от настройки, модели самого вентилятора и текущей нагрузки на БП."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hpr-0",
      "sourceNode": "1HPR-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Также в вентиляторы стали встраивать подсветку."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hps-0",
      "sourceNode": "1HPS-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/94afb95a1a25.webp",
        "width": 600,
        "height": 600
      }
    },
    {
      "id": "choose-power-supply-1hpx-0",
      "sourceNode": "1HPX-0",
      "type": "heading",
      "level": 2,
      "text": "Сертификат 80 Plus"
    },
    {
      "id": "choose-power-supply-1hpy-0",
      "sourceNode": "1HPY-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Существует шесть сертификатов 80 Plus — один белый и пять «металлических». Чем дальше в иерархии, тем эффективнее работает блок питания. Выше КПД, тише система охлаждения, ниже нагрев при прочих равных."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hpz-0",
      "sourceNode": "1HPZ-0",
      "type": "quote",
      "content": [
        {
          "tag": "strong",
          "children": [
            {
              "text": "Подробно про сертификацию 80 Plus и КПД можно почитать в отдельной статье: «Что такое 80 PLUS и КПД в блоках питания компьютера и зависит ли от этих параметров выходная мощность?»"
            }
          ]
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hq4-0",
      "sourceNode": "1HQ4-0",
      "type": "paragraph",
      "content": [
        {
          "text": "КПД не влияет выходную мощность. Только на энергопотребление из розетки и нагрев."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hq5-0",
      "sourceNode": "1HQ5-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Сертификация 80 Plus классифицируется по уровням: Bronze, Silver, Gold, Platinum, Titanium."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hq6-0",
      "sourceNode": "1HQ6-0",
      "type": "image",
      "caption": "Официальные логотипы организации СLEAResult\nАвтор изображения: СLEARESULT",
      "image": {
        "src": "../../assets/articles/optimized/f969266aba43.webp",
        "width": 497,
        "height": 140
      }
    },
    {
      "id": "choose-power-supply-1hqe-0",
      "sourceNode": "1HQE-0",
      "type": "paragraph",
      "content": [
        {
          "tag": "strong",
          "children": [
            {
              "text": "Таблица КПД относительно уровня нагрузки и типа сертификата:"
            }
          ]
        }
      ]
    },
    {
      "id": "choose-power-supply-1hqg-0",
      "sourceNode": "1HQG-0",
      "type": "table",
      "rows": [
        [
          "% нагрузки",
          "10 %",
          "20 %",
          "50 %",
          "100 %"
        ],
        [
          "80 PLUS",
          "-",
          "82 %",
          "85 %",
          "82 %"
        ],
        [
          "80 PLUS Bronze",
          "-",
          "85 %",
          "88 %",
          "85 %"
        ],
        [
          "80 PLUS Silver",
          "-",
          "87 %",
          "90 %",
          "87 %"
        ],
        [
          "80 PLUS Gold",
          "-",
          "90 %",
          "92 %",
          "89 %"
        ],
        [
          "80 PLUS Platinum",
          "-",
          "92 %",
          "94 %",
          "90 %"
        ],
        [
          "80 PLUS Titanium",
          "90 %",
          "94 %",
          "96 %",
          "91 %"
        ]
      ]
    },
    {
      "id": "choose-power-supply-1hsn-0",
      "sourceNode": "1HSN-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Косвенно влияет на качество и технологичность БП. Чем выше сертификат, тем сложнее и совершеннее схемотехника БП. Наличие и уровень сертификата влияет на ценовой диапазон."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hso-0",
      "sourceNode": "1HSO-0",
      "type": "quote",
      "content": [
        {
          "text": "Например, в блоках Titanium используются наиболее качественные комплектующие и лучшие инженерные решения в области преобразования напряжения. Стоить такой блок питания может как половина неплохого компьютера."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hss-0",
      "sourceNode": "1HSS-0",
      "type": "heading",
      "level": 2,
      "text": "Корректор мощности"
    },
    {
      "id": "choose-power-supply-1hst-0",
      "sourceNode": "1HST-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Мощность бывает активная и реактивная. Активная — полезная, передаваемая в нагрузку, а реактивная — бесполезная, которая впустую нагревает провода. Корректор мощности как раз помогает убрать реактивную нагрузку из электрической цепи."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hsu-0",
      "sourceNode": "1HSU-0",
      "type": "quote",
      "content": [
        {
          "text": "В Европе и многих других странах запрещено продавать БП без коррекции мощности, поэтому установка схем PFC — не инициатива производителей блоков. Как любая дополнительная схема, она потребляет энергию, уменьшает КПД, усложняет и удорожает конструкцию. Но требования, есть требования."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hsy-0",
      "sourceNode": "1HSY-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Активный корректор имеет приятный побочный эффект — умение работать на пониженном напряжении. Так, некоторые БП с активным PFC спокойно работают на напряжении 90-100 вольт из розетки."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hsz-0",
      "sourceNode": "1HSZ-0",
      "type": "image",
      "caption": "Этот БП работает от 100 вольт — ему не нужен ни стабилизатор, ни дополнительный преобразователь 220-110 В",
      "image": {
        "src": "../../assets/articles/optimized/304fe75342d2.webp",
        "width": 600,
        "height": 600
      }
    },
    {
      "id": "choose-power-supply-1ht5-0",
      "sourceNode": "1HT5-0",
      "type": "quote",
      "content": [
        {
          "text": "Блоки с APFC могут конфликтовать с UPS. Поэтому к подбору источника бесперебойного питания надо подходить с особой тщательностью."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1ht9-0",
      "sourceNode": "1HT9-0",
      "type": "heading",
      "level": 2,
      "text": "Что еще?"
    },
    {
      "id": "choose-power-supply-1hta-0",
      "sourceNode": "1HTA-0",
      "type": "heading",
      "level": 3,
      "text": "Длина кабелей"
    },
    {
      "id": "choose-power-supply-1htb-0",
      "sourceNode": "1HTB-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Подбор по длине индивидуален, так как это зависит от:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1htc-0",
      "sourceNode": "1HTC-0",
      "type": "list",
      "items": [
        [
          {
            "text": "размеров корпуса;"
          }
        ],
        [
          {
            "text": "расположения блока питания в нем — существует множество вариаций: сверху, снизу, сбоку, спереди);"
          }
        ],
        [
          {
            "text": "размеров видеокарты;"
          }
        ],
        [
          {
            "text": "способа прокладки проводов — например, можно просунуть кабели питания видеокарты как через заднюю стенку корпуса, так и через нижние отверстия."
          }
        ]
      ]
    },
    {
      "id": "choose-power-supply-1htp-0",
      "sourceNode": "1HTP-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Подавляющее большинство блоков питания идет с длиной:"
        }
      ]
    },
    {
      "id": "choose-power-supply-1htq-0",
      "sourceNode": "1HTQ-0",
      "type": "list",
      "items": [
        [
          {
            "text": "кабель CPU не менее 550 мм"
          }
        ],
        [
          {
            "text": "кабель PCIe не менее 450 мм"
          }
        ]
      ]
    },
    {
      "id": "choose-power-supply-1htx-0",
      "sourceNode": "1HTX-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Для успешной прокладки кабелей питания внутри корпусов Midi-Tower, длина кабеля CPU должна быть как раз в районе 550-600 мм, а для видеокарты 400-450 мм."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hty-0",
      "sourceNode": "1HTY-0",
      "type": "gallery",
      "images": [
        {
          "src": "../../assets/articles/optimized/895d74c4ad38-eddb353ff496.avif",
          "width": 450,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/1c55534cd6f6-297d1ff627f2.avif",
          "width": 450,
          "height": 600
        }
      ]
    },
    {
      "id": "choose-power-supply-1hu6-0",
      "sourceNode": "1HU6-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Параметры указаны в характеристиках к блоку питания. Поэтому, сначала лучше выбрать корпус, потом проверить, хватит ли длины нужного вам блока, чтобы все красиво проложить."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hu7-0",
      "sourceNode": "1HU7-0",
      "type": "quote",
      "content": [
        {
          "text": "Длина остальных кабелей по большей части не критична, но может повлиять на выбор при сборке в нестандартном корпусе."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hub-0",
      "sourceNode": "1HUB-0",
      "type": "heading",
      "level": 3,
      "text": "Оплетка кабеля и цветовые решения"
    },
    {
      "id": "choose-power-supply-1huc-0",
      "sourceNode": "1HUC-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Опция для сборок в корпусах с подсветкой и прозрачной крышкой. Для сборки в глухих закрытых ПК фасон кабеля роли не играет. Но, если хотите, чтобы получилось эстетично и красиво в вашем корпусе-аквариуме или на открытом риге, то выбирайте кабели в однотонной изоляции, в оплетке, либо в формате шлейфов."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hud-0",
      "sourceNode": "1HUD-0",
      "type": "gallery",
      "images": [
        {
          "src": "../../assets/articles/optimized/57950003b5d0-24af813b3218.avif",
          "width": 600,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/18b3bb9f3ac5-8c66f4fcdb66.avif",
          "width": 600,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/3e53c18ed93b-ccf82d63a35c.avif",
          "width": 600,
          "height": 600
        }
      ]
    },
    {
      "id": "choose-power-supply-1huo-0",
      "sourceNode": "1HUO-0",
      "type": "paragraph",
      "content": [
        {
          "tag": "em",
          "children": [
            {
              "text": "Цветная изоляция, в оплетке и однотонные белые шлейфы."
            }
          ]
        }
      ],
      "variant": "caption"
    },
    {
      "id": "choose-power-supply-1hur-0",
      "sourceNode": "1HUR-0",
      "type": "gallery",
      "images": [
        {
          "src": "../../assets/articles/optimized/dd60695caa84caac88c2-9576d7ef3250.avif",
          "width": 600,
          "height": 600
        },
        {
          "src": "../../assets/articles/optimized/d7d29f75d5f7-9b9ca6d530f2.avif",
          "width": 600,
          "height": 600
        }
      ]
    },
    {
      "id": "choose-power-supply-1huz-0",
      "sourceNode": "1HUZ-0",
      "type": "paragraph",
      "content": [
        {
          "tag": "em",
          "children": [
            {
              "text": "Черные сплошные шлейфы и раздельные проводки в мягкой однотонной изоляции."
            }
          ]
        }
      ],
      "variant": "caption"
    },
    {
      "id": "choose-power-supply-1hv2-0",
      "sourceNode": "1HV2-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Основной минус кабелей с оплеткой, что она закрепляется термоусадочной трубкой. Иногда, производители надевают на и без того слишком толстый провод плотную и крупную термоусадку. Из-за этого конец кабеля может оказаться чрезмерно жестким."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hv3-0",
      "sourceNode": "1HV3-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/c4f888a54b46.webp",
        "width": 500,
        "height": 414
      }
    },
    {
      "id": "choose-power-supply-1hv8-0",
      "sourceNode": "1HV8-0",
      "type": "paragraph",
      "content": [
        {
          "text": "При установке крупной видеокарты, ввиду ограниченного пространства между ней и стенкой корпуса, часто требуется согнуть кабель возле разъема, чтобы нормально его проложить. Из-за высокой жесткости, особенно у толстых кабелей 12V-2x6 или 12VHPWR, это может быть довольно непросто сделать."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hv9-0",
      "sourceNode": "1HV9-0",
      "type": "quote",
      "content": [
        {
          "text": "Как вариант, можно аккуратно прогреть место сгиба, например, феном."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hvd-0",
      "sourceNode": "1HVD-0",
      "type": "heading",
      "level": 3,
      "text": "Система защиты"
    },
    {
      "id": "choose-power-supply-1hve-0",
      "sourceNode": "1HVE-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Все адекватные блоки питания в той или иной степени оснащены стандартными средствами защиты «от дурака». Обычно дополнительно маркируются аббревиатурами: ОТР, OVP/UVP, OCP и другие."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hvf-0",
      "sourceNode": "1HVF-0",
      "type": "quote",
      "content": [
        {
          "text": "На работоспособность блоков в целом не влияют и для обычного обывателя не играют никакой роли: нет смысла искать именно такой блок, на котором перечислены все меры защиты. В любом случае, базовые требования заложены в стандарт ATX."
        }
      ],
      "variant": "notice"
    },
    {
      "id": "choose-power-supply-1hvj-0",
      "sourceNode": "1HVJ-0",
      "type": "heading",
      "level": 2,
      "text": "Варианты выбора"
    },
    {
      "id": "choose-power-supply-1hvk-0",
      "sourceNode": "1HVK-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Как упоминалось раньше, в первую очередь необходимо вычислить суммарную потребляемую мощность ваших комплектующих. Системник с топовой видеокартой и горячим процессорам может потребовать блок питания в 1000 Вт или даже больше."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hvl-0",
      "sourceNode": "1HVL-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/8db578442879.webp",
        "width": 600,
        "height": 600
      }
    },
    {
      "id": "choose-power-supply-1hvq-0",
      "sourceNode": "1HVQ-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Если у вас видеокарта Nvidia последних поколений, то вероятно, у неё современный разъем 12V-2x6 или 12VHPWR, а значит, лучше сразу приобрести блок питания с поддержкой стандартов ATX 3.x и соответствующими разъемами."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hvr-0",
      "sourceNode": "1HVR-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/fd7f852a7280.webp",
        "width": 760,
        "height": 417
      }
    },
    {
      "id": "choose-power-supply-1hvw-0",
      "sourceNode": "1HVW-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Блоки питания на 850 Вт сейчас — золотая середина. Потянут практически любую конфигурацию даже с высокопроизводительными игровыми видеокартами, заточенными под игры в 4К."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hvx-0",
      "sourceNode": "1HVX-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/c1a5f54e30d1.webp",
        "width": 722,
        "height": 600
      }
    },
    {
      "id": "choose-power-supply-1hw2-0",
      "sourceNode": "1HW2-0",
      "type": "paragraph",
      "content": [
        {
          "text": "«Металлические» сертификаты 80 Plus, начиная с бронзы, повысят вероятность того, что блок питания основан на современном шасси с продвинутой схемотехникой и высокой отдачей мощности по линии 12 вольт. Наиболее оптимальные по соотношению цена/качества БП с сертификатом 80 Plus Gold."
        }
      ]
    },
    {
      "id": "choose-power-supply-1hw3-0",
      "sourceNode": "1HW3-0",
      "type": "image",
      "image": {
        "src": "../../assets/articles/optimized/20b7eb2b49c5.webp",
        "width": 600,
        "height": 600
      }
    },
    {
      "id": "choose-power-supply-1hw8-0",
      "sourceNode": "1HW8-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Офисные и простые рабочие системники не потребляют много энергии, поэтому будет достаточно практически любого и недорогого блока питания до 400 Вт."
        }
      ]
    }
  ],
  "heroCaption": "Автор изображения: QU1SY\nИсточник изображения: club.dns-shop.ru",
  "sourceUrl": "https://club.dns-shop.ru/blog/t-104-bloki-pitaniya/14934-kak-vyibrat-blok-pitaniya-dlya-komputera/",
  "category": {
    "title": "Блоки питания",
    "href": "https://club.dns-shop.ru/blog/t-104-bloki-pitaniya/"
  },
  "publication": {
    "title": "Блоги",
    "href": "https://club.dns-shop.ru/blog/",
    "section": "blogs"
  },
  "author": {
    "name": "Zephon",
    "avatar": {
      "src": "../../assets/articles/optimized/6c79d2f0f6e2.jpg",
      "width": 132,
      "height": 132
    }
  },
  "hero": {
    "src": "../../assets/articles/optimized/fc76d4ce5057-16e66b7c85e3.avif",
    "width": 760,
    "height": 428,
    "preview": "../../assets/articles/optimized/fc884a80c5d9-preview.webp"
  },
  "heroAlt": "Как выбрать блок питания для компьютера",
  "products": {
    "dns-14934-product-1hh9-0": {
      "id": "dns-14934-product-1hh9-0",
      "name": "Блок питания Thermaltake TR2 S 750W [PS-TRS-0750NN2AWE-1] черный",
      "image": {
        "src": "../../assets/articles/optimized/45bce1f22bf2-280c610cae82.webp",
        "width": 130,
        "height": 130
      },
      "sourceNode": "1HH9-0"
    },
    "dns-14934-product-1hjw-0": {
      "id": "dns-14934-product-1hjw-0",
      "name": "Блок питания FSP DAGGER PRO ATX3.0(PCIe5.0) 850W [PPA8503916] черный",
      "image": {
        "src": "../../assets/articles/optimized/696d7eb9a6a0-97ca28483b0e.webp",
        "width": 130,
        "height": 130
      },
      "sourceNode": "1HJW-0"
    },
    "dns-14934-product-1hlh-0": {
      "id": "dns-14934-product-1hlh-0",
      "name": "Блок питания MONTECH TITAN GOLD 850 [TIS0124] черный",
      "image": {
        "src": "../../assets/articles/optimized/d1a8e518e637-beb2b9a0c3e5.webp",
        "width": 130,
        "height": 130
      },
      "sourceNode": "1HLH-0"
    },
    "dns-14934-product-1hmw-0": {
      "id": "dns-14934-product-1hmw-0",
      "name": "Блок питания DEEPCOOL PN850M [R-PN850M-FC0B-EU] черный",
      "image": {
        "src": "../../assets/articles/optimized/6598fd7c82a3-44400c5c7b75.webp",
        "width": 130,
        "height": 130
      },
      "sourceNode": "1HMW-0"
    },
    "dns-14934-product-1hp5-0": {
      "id": "dns-14934-product-1hp5-0",
      "name": "Блок питания Seasonic PRIME Fanless TX-700 [SSR-700TL] черный",
      "image": {
        "src": "../../assets/articles/optimized/b43caed3647c-59b7ffb433b5.webp",
        "width": 130,
        "height": 130
      },
      "sourceNode": "1HP5-0"
    }
  },
  "showMentionedProducts": true,
  "mentionedLayout": "list",
  "commentGroups": null
};
