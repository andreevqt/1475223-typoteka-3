# Переменные среды

## Общее  
```sh
# окружение - production, test или development
NODE_ENV  
```

## Приложение
```sh
# url сервера приложения 
APP_URL
# порт сервера приложения
APP_PORT
```

## API сервер
```sh
# порт api сервера
SERVER_PORT
# Включает логирование sql запросов
SEQUELIZE_LOGGING 
# Время жизни jwt токена, по-умолчанию 15 мин
JWT_EXPIRES_IN
# Состояение api сервера true/false если false то все routes возвращают 503 ошибку
API_ENABLED
```

## СУБД
```sh
# хост БД
DB_HOST=localhost
# имя БД
DB_NAME
# пользователь
DB_USER
# пароль
DB_PASSWORD
```
