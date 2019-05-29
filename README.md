# Пример личного кабинета с двухфакторной аутентификацией
Личный кабинет с готовым модулями для встраивания и демонстрации:
- Подключения к аккаунту второго фактора – аппаратного аутентификатора Рутокен U2F или OTP;
- Входа в учетную запись с подтверждением вторым фактором.

Учетные записи в демонстрационном личном кабинете могут быть защищены двумя моделями аутентификаторов производства компании «Актив»:
- [**Рутокен U2F**](https://www.rutoken.ru/products/all/rutoken-u2f/ "**Рутокен U2F**") - работает по открытому стандарту универсальной двухфакторной аутентификации, разработанному FIDO Alliance

- Генератором одноразовых паролей [**Рутокен OTP**](https://www.rutoken.ru/products/all/rutoken-otp/ "**Рутокен OTP**") — при аутентификации устройство создает и печатает одноразовый пароль в экранную форму при нажатии кнопки на устройстве.

## Системные требования

- Node js (версия v11.5.0 или новее)
- Nginx (конфиг реверс прокси на localhost: 3000 с доступом по https)
- Https сертификат (Валидный сертификат Let's encrypt);
- Reverse proxy
- PostgreSQL (на сервере нужна PostgreSQL версии не ниже 11, учетная запись должна быть наделена правами создания БД. Пример connectionString: - postgresql://user:user@test.auth.ru:54321. Доступ к сервису PostgreSQL осуществляться по паролю, поэтому в файле /var/lib/postgresql/data/pg_hba.conf -должен быть установлен метод аутентификации md5)

## Настройка БД

```
1. sudo apt-get install postgresql postgresql-contrib (установка PostgreSQL)
2. sudo -i -u postgres                                (Логин под пользователем postgres)
3. createuser --interactive                           (Создание новой роли)
Вывод:
Enter name of role to add: user_name_for_db
Shall the new role be a superuser? (y/n) y
4. createdb user_name_for_db                          (Создание пользовательской БД)
5. exit                                               (Лог-аут)
6. sudo adduser user_name_for_db                      (Создание пользователя Linux)
7. sudo -i -u user_name_for_db                        (Логин под пользователем user_name_for_db)
8. psql                                               (Запуск консоли PostgreSQL от имени пользовалтеля user_name_for_db)
9. \passsword user_name_for_db                        (Задание пароля пользователю user_name_for_db в PostgreSQL)
10.\q                                                 (Выход из консоли PostgreSQL)
11.exit                                               (Лог-аут)
12.Отредактировать строчку в конфигурационном файле:
 /etc/postgresql/ver_psql/main/pg_hba.conf
 с:
    local   all             all             peer          
 на:
    local   all             all             md5
13. sudo /etc/init.d/postgresql restart               (Рестарт PostgreSQL, или в более ранних версиях: sudo service postgresql restart)
```

## Сборка примера личного кабинета
```
1. npm install
2. Измените connectionString к базе в файле database.json
3. npm run create:db (Создание базы)
4. npm run migrate:db (Создание таблиц в базе)
5. npm run build:client:prod
6. npm run build:server:https
7. sudo npm start
8. https://localhost
9. Для доступа к сервису с других компьютеров заменить шаг 7 на:
   sudo USE_HTTPS=1 APP_ID=https://your.domain.ru node dist/app.bundle.js
   Имя домена должно быть валидным, оканчиваться на .ru/.com
   
   Заменить имя хоста на удаленной машине:
   sudo hostnamectl set-hostname your.domain.ru
   
   Прописать в /etc/hosts на удаленной машине:
   127.0.0.1       your.domain.ru
   
   Для доступа к удаленному сервису либо прописать в hosts на локальной машине:
   ip.of.remote.server	your.domain.ru
   Либо изменить настройки DNS внутренней сети.
   
```

## Инструкции по использованию и настройке устройств
Рутокен U2F: https://www.rutoken.ru/download/manual/Rutoken_U2F_How_To_Use.pdf
Рутокен OTP: https://www.rutoken.ru/download/manual/Rutoken_OTP_How_To_Use.pdf

## Лицензия
Исходный код распространяется под лицензией Simplified BSD. См. файл LICENSE в корневой директории проекта.