== Настройка в локальном окружении

```
1. npm install
2. Измените connectionString к базе в файле database.json
3. npm run create:db ( Создание базы )
4. npm run migrate:db ( Миграция базы )
5. npm run build:client:prod
6. npm run build:server:prod
7. node dist/app.bundle.js
```