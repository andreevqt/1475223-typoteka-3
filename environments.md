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
```

## СУБД
Для каждой переменной окружения NODE_ENV своя переменная с учетными данными для подключения 
к БД, например для `NODE_ENV=production`:
```sh
# хост БД
DB_HOST_PRODUCTION
# имя БД
DB_NAME_PRODUCTION
# пользователь
DB_USER_PRODUCTION
# пароль
DB_PASSWORD_PRODUCTION
```
