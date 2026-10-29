export default {
  "id": "dns-38267",
  "title": "Что такое VRM материнской платы",
  "date": "5 месяцев назад",
  "readingTime": "5 мин",
  "stats": {
    "votes": "73",
    "comments": "30",
    "views": "163.4k",
    "reactions": "4"
  },
  "blocks": [
    {
      "id": "motherboard-vrm-1gnv-0",
      "sourceNode": "1GNV-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Voltage Regulator Module (VRM) — важный компонент материнской платы, отвечающий за питание центрального процессора. Именно от VRM зависит постоянство подаваемой на ЦП мощности, а значит — и стабильность работы всего компьютера. Из чего состоит VRM, и как ее характеристики могут повлиять на производительность ПК — рассказываем в нашем материале."
        }
      ],
      "variant": "lead"
    },
    {
      "id": "motherboard-vrm-1gnx-0",
      "sourceNode": "1GNX-0",
      "type": "heading",
      "level": 2,
      "text": "Что такое VRM и для чего он нужен"
    },
    {
      "id": "motherboard-vrm-1gny-0",
      "sourceNode": "1GNY-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Центральный процессор, оперативная память, чипсет материнской платы: все эти компоненты ПК относятся к сложным электронным чипам. Они состоят из миллиардов микроскопических транзисторов, которые функционируют при напряжении порядка 1 В."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gnz-0",
      "sourceNode": "1GNZ-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Современные производительные ЦП потребляют сотни ватт мощности. Передавать их напрямую от блока питания при таком низком напряжении невозможно — для этого понадобилась бы огромная сила тока и очень толстые провода. Поэтому компьютерные БП генерируют основное напряжение в 12 В: такое значение идеально для передачи приличной мощности при сохранении умеренной силы тока. С помощью кабелей оно подается на материнскую плату, а дальше в дело вступает наш герой — VRM."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1go0-0",
      "sourceNode": "1GO0-0",
      "type": "image",
      "caption": "Зона VRM на плате выделена желтым\nАвтор изображения: MIGALEV.VG\nИсточник изображения: club.dns-shop.ru",
      "image": {
        "src": "../../assets/articles/optimized/37f00f52d397.webp",
        "width": 760,
        "height": 428
      }
    },
    {
      "id": "motherboard-vrm-1go9-0",
      "sourceNode": "1GO9-0",
      "type": "paragraph",
      "content": [
        {
          "text": "VRM, или подсистема питания материнской платы — это преобразователь, понижающий напряжение от блока питания ПК до нужного электронным чипам значения. Он генерирует несколько разных напряжений, которые необходимы для:"
        }
      ]
    },
    {
      "id": "motherboard-vrm-1goa-0",
      "sourceNode": "1GOA-0",
      "type": "list",
      "items": [
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Вычислительных ядер процессора"
              }
            ]
          }
        ],
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Контроллеров шин процессора"
              }
            ]
          }
        ],
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Встроенной в процессор графики"
              }
            ]
          }
        ],
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Оперативной памяти"
              }
            ]
          }
        ],
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Чипсета материнской платы"
              }
            ]
          }
        ]
      ]
    },
    {
      "id": "motherboard-vrm-1goq-0",
      "sourceNode": "1GOQ-0",
      "type": "heading",
      "level": 2,
      "text": "Компоненты VRM"
    },
    {
      "id": "motherboard-vrm-1gor-0",
      "sourceNode": "1GOR-0",
      "type": "paragraph",
      "content": [
        {
          "text": "VRM относится к импульсным преобразователям постоянного напряжения. Поэтому в подсистеме питания материнской платы нет трансформаторов тока, их заменяют следующие компоненты:"
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gos-0",
      "sourceNode": "1GOS-0",
      "type": "image",
      "caption": "Автор изображения: MET741\nИсточник изображения: club.dns-shop.ru",
      "image": {
        "src": "../../assets/articles/optimized/3c716d346cc1.webp",
        "width": 760,
        "height": 475
      }
    },
    {
      "id": "motherboard-vrm-1gp0-0",
      "sourceNode": "1GP0-0",
      "type": "list",
      "items": [
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Транзисторы MOSFET"
              }
            ]
          }
        ]
      ]
    },
    {
      "id": "motherboard-vrm-1gp4-0",
      "sourceNode": "1GP4-0",
      "type": "paragraph",
      "content": [
        {
          "text": "MOSFET, или МОП — метал-оксидные полупроводниковые транзисторы. Открывают и закрывают путь току от блока питания сотни тысяч раз в секунду, таким образом генерируя его короткие импульсы."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gp5-0",
      "sourceNode": "1GP5-0",
      "type": "list",
      "items": [
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Драйверы"
              }
            ]
          }
        ]
      ]
    },
    {
      "id": "motherboard-vrm-1gp9-0",
      "sourceNode": "1GP9-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Драйверы выполняют команды по открытию и закрытию транзисторов с помощью отправки электрических сигналов управления на их ключи. На современных материнских платах чаще всего используются сборки DrMOS, в едином корпусе которых объединен и драйвер, и транзисторы."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gpa-0",
      "sourceNode": "1GPA-0",
      "type": "image",
      "caption": "Автор изображения: MET741\nИсточник изображения: club.dns-shop.ru",
      "image": {
        "src": "../../assets/articles/optimized/adb957addd3f.webp",
        "width": 760,
        "height": 475
      }
    },
    {
      "id": "motherboard-vrm-1gpi-0",
      "sourceNode": "1GPI-0",
      "type": "list",
      "items": [
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Дроссели"
              }
            ]
          }
        ]
      ]
    },
    {
      "id": "motherboard-vrm-1gpm-0",
      "sourceNode": "1GPM-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Дроссели — это катушки индуктивности, играющие роль проточного резервуара для энергии. В моменты открытия транзисторов они накапливают сгенерированные импульсы в своем магнитном поле, чтобы при их закрытии продолжать передавать собранный ток в электрическую цепь."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gpn-0",
      "sourceNode": "1GPN-0",
      "type": "list",
      "items": [
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Конденсаторы"
              }
            ]
          }
        ]
      ]
    },
    {
      "id": "motherboard-vrm-1gpr-0",
      "sourceNode": "1GPR-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Если дроссели подобны проточным резервуарам, то конденсаторы — это накопительные емкости, установленные параллельно нагрузке. Они сглаживают пульсации напряжения, а в моменты высоких пиков потребления — отдают накопленный ток в цепь, помогая сохранить его стабильность."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gps-0",
      "sourceNode": "1GPS-0",
      "type": "list",
      "items": [
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "ШИМ-контроллер"
              }
            ]
          }
        ]
      ]
    },
    {
      "id": "motherboard-vrm-1gpw-0",
      "sourceNode": "1GPW-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Связки из вышеописанных элементов образуют фазы питания VRM. На любой материнской плате их присутствует несколько."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gpx-0",
      "sourceNode": "1GPX-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Импульсы напряжения распределяются по фазам со сдвигом по времени — так, чтобы на общем выходе оно было максимально ровным. Управляет этой кухней микросхема ШИМ-контроллера. Она отслеживает запрашиваемые процессором напряжение/ток, и, в соответствии с этими данными, корректирует работу фаз с помощью отправки команд на их драйверы."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gpy-0",
      "sourceNode": "1GPY-0",
      "type": "image",
      "caption": "Автор изображения: MIGALEV.VG\nИсточник изображения: club.dns-shop.ru",
      "image": {
        "src": "../../assets/articles/optimized/3226dde12661.webp",
        "width": 760,
        "height": 428
      }
    },
    {
      "id": "motherboard-vrm-1gq6-0",
      "sourceNode": "1GQ6-0",
      "type": "quote",
      "content": [
        {
          "tag": "em",
          "children": [
            {
              "tag": "strong",
              "children": [
                {
                  "text": "Подробнее о том, как именно работает VRM, мы рассказывали в отдельном материале."
                }
              ]
            }
          ]
        }
      ],
      "variant": "notice"
    },
    {
      "id": "motherboard-vrm-1gqc-0",
      "sourceNode": "1GQC-0",
      "type": "heading",
      "level": 2,
      "text": "На что влияют характеристики VRM"
    },
    {
      "id": "motherboard-vrm-1gqd-0",
      "sourceNode": "1GQD-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Все VRM состоят из схожих компонентов, но их параметры на бюджетных и топовых платах заметно отличаются. Ключевыми характеристиками подсистемы питания являются:"
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gqe-0",
      "sourceNode": "1GQE-0",
      "type": "list",
      "items": [
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Количество фаз: "
              }
            ]
          },
          {
            "text": "от трех до 32;"
          }
        ],
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Ток, на который рассчитана каждая фаза: "
              }
            ]
          },
          {
            "text": "от 25 до 110 А;"
          }
        ],
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Топология фаз:"
              }
            ]
          },
          {
            "text": " классические, сдвоенные, усиленные;"
          }
        ],
        [
          {
            "tag": "strong",
            "children": [
              {
                "text": "Конфигурация фаз: "
              }
            ]
          },
          {
            "text": "сколько из них используется для ядер процессора, а сколько — для других нужд."
          }
        ]
      ]
    },
    {
      "id": "motherboard-vrm-1gqv-0",
      "sourceNode": "1GQV-0",
      "type": "paragraph",
      "content": [
        {
          "text": "С таким количеством и разбросом параметров число возможных конфигураций подсистемы питания просто огромно. Но по итогу все ее характеристики сводятся к одной: мощности, которую VRM может обеспечить для процессора при долгосрочной нагрузке. При ее недостатке ЦП начнет сбрасывать частоты, вместе с ними теряя часть своей производительности — от единиц до нескольких десятков процентов."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gqw-0",
      "sourceNode": "1GQW-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Крайне важно, чтобы возможностей VRM хватало. Для этого выдаваемая ею пиковая мощность должна быть больше, чем максимальное тепловыделение выбранного процессора."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gqx-0",
      "sourceNode": "1GQX-0",
      "type": "heading",
      "level": 2,
      "text": "Почему нельзя допускать перегрева VRM"
    },
    {
      "id": "motherboard-vrm-1gqy-0",
      "sourceNode": "1GQY-0",
      "type": "paragraph",
      "content": [
        {
          "text": "При преобразовании напряжения на VRM теряется часть исходной мощности, поступающей от блока питания. На недорогих платах с бюджетными компонентами такая потеря может достигать 20–25%, в то время как на топовых моделях она обычно находится в районе 5–10%."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gqz-0",
      "sourceNode": "1GQZ-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Основная потеря мощности происходит на транзисторах MOSFET, которые на многих платах находятся внутри сборок DrMOS. Еще часть «съедает» прохождение тока сквозь дроссели. Потерянная мощность рассеивается в виде тепла, поэтому компоненты VRM при активной работе довольно сильно нагреваются."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gr0-0",
      "sourceNode": "1GR0-0",
      "type": "image",
      "caption": "Нагрев области VRM с задней стороны платы «глазами» тепловизора\nАвтор изображения: ISAAC CLARKE\nИсточник изображения: club.dns-shop.ru",
      "image": {
        "src": "../../assets/articles/optimized/6009439fdfd7.webp",
        "width": 464,
        "height": 600
      }
    },
    {
      "id": "motherboard-vrm-1gr9-0",
      "sourceNode": "1GR9-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Например, при полной нагрузке процессора Core i5-14600KF, потери на подсистеме питания у платы GIGABYTE B760M DS3H будут составлять около 25–30 Вт — а ведь это мощность небольшого паяльника."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gra-0",
      "sourceNode": "1GRA-0",
      "type": "product",
      "productId": "dns-38267-product-1gra-0"
    },
    {
      "id": "motherboard-vrm-1grj-0",
      "sourceNode": "1GRJ-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Поэтому при использовании процессора с тепловыделением более 80 Вт подсистеме питания необходим как минимум дополнительный обдув, а для ЦП с TDP от 110 Вт и выше — обязательно наличие на ней радиаторов."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1grk-0",
      "sourceNode": "1GRK-0",
      "type": "product",
      "productId": "dns-38267-product-1grk-0"
    },
    {
      "id": "motherboard-vrm-1grt-0",
      "sourceNode": "1GRT-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Вдобавок желательно обеспечить температуру VRM под нагрузкой в пределах 80°C: это позволит ей стабильно работать на протяжении всего срока службы платы. В большинстве случаев для удержания таких температур максимальная мощность подсистемы питания должна превышать тепловыделение процессора примерно вдвое."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gru-0",
      "sourceNode": "1GRU-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Если не соблюдать эти условия, то VRM перегреется и уйдет в троттлинг, кратно снижая выдаваемую мощность. Эффект последует такой же, как и при обычной нехватке мощности подсистемы питания — ЦП системы будет вынужден снизить свою производительность."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1grv-0",
      "sourceNode": "1GRV-0",
      "type": "heading",
      "level": 2,
      "text": "Итоги"
    },
    {
      "id": "motherboard-vrm-1grw-0",
      "sourceNode": "1GRW-0",
      "type": "paragraph",
      "content": [
        {
          "text": "VRM материнской платы решает главную задачу по обеспечению бесперебойной работы центрального процессора ПК. Если не придавать значения его характеристикам, то в лучшем случае можно получить снижение производительности. А в худшем — постоянный перегрев, который в итоге может привести к поломке."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1grx-0",
      "sourceNode": "1GRX-0",
      "type": "image",
      "caption": "Автор изображения: BRIAN_I6\nИсточник изображения: club.dns-shop.ru",
      "image": {
        "src": "../../assets/articles/optimized/e915ed1783a0.webp",
        "width": 760,
        "height": 428
      }
    },
    {
      "id": "motherboard-vrm-1gs5-0",
      "sourceNode": "1GS5-0",
      "type": "paragraph",
      "content": [
        {
          "text": "Поэтому при выборе материнской платы нужно обязательно соотнести характеристики ее подсистемы питания и тепловыделение выбранного процессора. Если возможности VRM достаточны, то компьютер будет работать без перебоев и снижения производительности в течение многих лет эксплуатации."
        }
      ]
    },
    {
      "id": "motherboard-vrm-1gs6-0",
      "sourceNode": "1GS6-0",
      "type": "paragraph",
      "content": [
        {
          "tag": "em",
          "children": [
            {
              "text": "Материал обновлен пользователем Alex_Esh"
            }
          ]
        }
      ],
      "variant": "caption"
    }
  ],
  "heroCaption": "Автор изображения: GEMINI\nИсточник изображения: gemini.google.com",
  "sourceUrl": "https://club.dns-shop.ru/blog/t-102-materinskie-platyi/38267-chto-takoe-vrm-materinskoi-platyi/",
  "category": {
    "title": "Материнские платы",
    "href": "https://club.dns-shop.ru/blog/t-102-materinskie-platyi/"
  },
  "publication": {
    "title": "Блоги",
    "href": "https://club.dns-shop.ru/blog/",
    "section": "blogs"
  },
  "author": {
    "name": "geramorales",
    "avatar": {
      "src": "../../assets/articles/optimized/72c897d99839.jpg",
      "width": 132,
      "height": 132
    }
  },
  "hero": {
    "src": "../../assets/articles/optimized/fe20eeb4b399-e8f59e299779.avif",
    "width": 760,
    "height": 427,
    "preview": "../../assets/articles/optimized/f8ab8c11fb8d-preview.webp"
  },
  "heroAlt": "Что такое VRM материнской платы",
  "products": {
    "dns-38267-product-1gra-0": {
      "id": "dns-38267-product-1gra-0",
      "name": "Материнская плата GIGABYTE B760M DS3H DDR4",
      "image": {
        "src": "../../assets/articles/optimized/f4fa074dd903-beaf905b102a.webp",
        "width": 130,
        "height": 130
      },
      "sourceNode": "1GRA-0",
      "priceText": "9499 ₽"
    },
    "dns-38267-product-1grk-0": {
      "id": "dns-38267-product-1grk-0",
      "name": "Процессор Intel Core i5-14600KF OEM",
      "image": {
        "src": "../../assets/articles/optimized/a889c09ac70d-5db4b4deda3c.webp",
        "width": 130,
        "height": 130
      },
      "sourceNode": "1GRK-0",
      "priceText": "27899 ₽"
    }
  },
  "showMentionedProducts": true,
  "mentionedLayout": "grid",
  "commentGroups": null
};
