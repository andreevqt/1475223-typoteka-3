# Папка для сценариев API-сервиса
## Начало работы
```sh
## Запускает миграции
npm run migrate
## Заполняет БД тестовыми данными
npm run filldb
## Запускает api server
npm run start
```
## Другие команды
```sh
## Откатывает миграции
npm run migrate::rollback
## То же самое, что и npm run migrate::rollback && npm run migrate
npm run migrate::refresh
```
