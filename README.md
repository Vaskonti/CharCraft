# CharCraft
![Char Craft](https://raw.githubusercontent.com/Vaskonti/CharCraft/refs/heads/master/public/assets/images/logo.png)

## Contents
- [English](#english)
    - [Setup](#setup)
        - [Docker](#docker)
        - [Windows](#windows)
    - [Backend Structure](#backend-structure)
    - [Database](#database)
    - [Tests](#tests)
- [Bulgarian](#български)
    - [Настройка](#настройка)
        - [Docker](#docker-1)
        - [Windows](#windows-1)
    - [Структура на проекта](#структура-на-проекта)
    - [База данни](#база-данни)
    - [Тестове](#тестове)

## English
### Setup
- Copy the example environment file to create your own `.env` file: `cp .env.example .env`
#### Docker
1. Ensure you have Docker installed. If not, download and install it from [Docker](https://www.docker.com/products/docker-desktop).
2. Clone the repository: `git clone https://github.com/yourusername/CharCraft.git`
3. Navigate to the project directory: `cd CharCraft`
4. Build the Docker containers: `docker-compose build`
5. Start the Docker containers: `docker-compose up`
6. Open your browser and go to `http://localhost/CharCraft`.

#### Windows
1. Download and install XAMPP from [Apache Friends](https://www.apachefriends.org/index.html).
2. Clone the repository: `git clone https://github.com/yourusername/CharCraft.git`
3. Navigate to the project directory: `cd CharCraft`
4. Open the `scripts/setup_xampp.ps1` file and fill in the necessary data for proper execution.
5. Run the following command to ensure you have permission to execute **powershell** scripts: `Set-ExecutionPolicy AllSigned`
6. Execute `.\scripts\setup_xampp.ps1`
7. Start Apache and MySQL from the XAMPP control panel.
8. Open your browser and go to `http://localhost/CharCraft/hero.html`.

### Project Structure
- `Auth/`: Authentication facade.
- `Constants/`: Static constants used by the project.
- `Controller/`: Controllers containing the business logic of the project.
- `Database/`: Database management facade and connections. Singleton.
- `documentation/`: Directory containing documentation files (images, documents).
- `infrastructure/`: Contains files that help set up Docker containers for the project.
- `logs/`: Contains system logs.
- `migrations/`: System migration files.
- `misc/`: Contains facade for creating logs.
- `Models/`: Contains system models.
- `Requests/`: Files for system requests.
- `Routes/`: Contains the system router.
- `scripts/`: Contains all scripts.
- `Storage/`: File handling facade.
- `config/`: Configuration files.
- `public/`: Publicly accessible files, including the entry point `index.php`.
- `tests/`: Automated tests.
- `vendor/`: Composer dependencies.

### Database
- The project uses MySQL as the database.
- Database configuration can be found in the `.env` file.
- Run migrations to set up the database schema: `php artisan migrate`.
- Seed the database with initial data: `php artisan db:seed`.
- Database backups are stored in the `storage/backups/` directory.

### Tests
- The project includes automated tests for the Drawing board
- For more information, refer to the [tests/README.md](tests/README.md).

## Български
### Настройка
- Копирайте примерния файл за среда, за да създадете свой собствен `.env` файл: `cp .env.example .env`

#### Docker
1. Уверете се, че имате инсталиран Docker. Ако не, изтеглете и инсталирайте от [Docker](https://www.docker.com/products/docker-desktop).
2. Клонирайте репозитория: `git clone https://github.com/yourusername/CharCraft.git`
3. Отидете в директорията на проекта: `cd CharCraft`
4. Създайте Docker контейнерите: `docker-compose build`
5. Стартирайте Docker контейнерите: `docker-compose up`
6. Отворете браузъра си и отидете на `http://localhost/CharCraft`

#### Windows
1. Изтеглете и инсталирайте XAMPP от [Apache Friends](https://www.apachefriends.org/index.html).
2. Клонирайте репозитория: `git clone https://github.com/yourusername/CharCraft.git`
3. Отидете в директорията на проекта: `cd CharCraft`
4. Отворете файла `scripts/setup_xampp.ps1` и попълнете нужните му данни за коректно изпълнение
5. Изпълнете следната команда, за да се уверите, че имате право да изпълнявате **powershell** скриптове `Set-ExecutionPolicy AllSigned`
6. Изпълнете `.\scripts\setup_xampp.ps1`
7. Стартирайте Apache и MySQL от контролния панел на XAMPP.
8. Отворете браузъра си и отидете на `http://localhost/CharCraft/hero.html`.

### Структура на проекта
- `Auth/`: Фасада за автентикация
- `Constants/`: Статични константи, които проекта ползва
- `Controller/`: Контролери, съдържащи бизнес логиката на проекта
- `Database/`: Фасада за управление на базата данни и връзките към нея. Синглетон
- `documentation/`: Директория, съдържаща документационни файлове (снимки, документи)
- `infrastructure/`: Съдържа файлове, които спомагат вдигането на докер контейнери за проекта
- `logs/`: Съдържа логове за системата.
- `migrations/`: Миграционни файлове на системата.
- `misc/`: Съдържа фасада за създаване на логове.
- `Models/`: Съдържа моделите на системата.
- `Requests/`: Файлове за заявките в системата
- `Routes/`: Съдържа маршрутизатора на системата.
- `scripts/`: Съдържа всички скриптове.
- `Storage/`: Фасада за работа с файлове.
- `config/`: Конфигурационни файлове.
- `public/`: Публично достъпни файлове, включително входната точка `index.php`.
- `tests/`: Автоматизирани тестове.
- `vendor/`: Composer зависимости.

### База данни
- Проектът използва MySQL като база данни.
- Конфигурацията на базата данни може да бъде намерена в `.env` файла.

### Тестове
- Проектът включва автоматизирани тестове за Дъската за рисуване
- За повече информация, вижте [tests/README.md](tests/README.md).
