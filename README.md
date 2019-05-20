# Пример личного кабинета с двухфакторной аутентификацией
Личный кабинет с готовым модулями для встраивания и демонстрации:
- Подключения к аккаунту второго фактора – аппаратного аутентификатора Рутокен U2F или OTP;
- Входа в учетную запись с подтверждением вторым фактором.

Учетные записи в демонстрационном личном кабинете могут быть защищены двумя моделями аутентификаторов производства компании «Актив»:
- [**Рутокен U2F**](https://www.rutoken.ru/products/all/rutoken-u2f/ "**Рутокен U2F**") - работает по открытому стандарту универсальной двухфакторной аутентификации, разработанному FIDO Alliance

- Генератором одноразовых паролей [**Рутокен OTP**](https://www.rutoken.ru/products/all/rutoken-otp/ "**Рутокен OTP**") — при аутентификации устройство создает и печатает одноразовый пароль в экранную форму при нажатии кнопки на устройстве.

## Сборка примера личного кабинета
```
1. npm install
2. Измените connectionString к базе в файле database.json
3. npm run create:db (Создание базы)
4. npm run migrate:db (Создание таблиц в базе)
5. npm run build:client:prod
6. npm run build:server:prod
7. node dist/app.bundle.js
```

## Инструкции по использованию и настройке устройств
Рутокен U2F: https://www.rutoken.ru/download/manual/Rutoken_U2F_How_To_Use.pdf
Рутокен OTP: https://www.rutoken.ru/download/manual/Rutoken_OTP_How_To_Use.pdf

## Лицензия
Исходный код распространяется под лицензией Simplified BSD. См. файл LICENSE в корневой директории проекта.