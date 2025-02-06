# Run this before running the script: Set-ExecutionPolicy AllSigned
# Or run this one: Set-ExecutionPolicy RemoteSigned
# This script replaces the Apache configuration with a custom one and creates a backup of the old one.
# Please fill out the correct paths and configs before running the script.
# THIS SCRIPT IS WINDOWS OS EXCLUSIVE

# Define Paths
$xamppPath = "C:\xampp\apache\conf"
$projectRoot = "C:\xampp\htdocs\CharCraft"
$httpdConf = "$xamppPath\httpd.conf" # Current httpd.conf
$backupConf = "$xamppPath\httpd_backup.conf" # Backup of the original
$customConf = "$projectRoot\scripts\httpd.conf" # Custom httpd.conf in the project
$tempConf = "$xamppPath\httpd_temp.conf"


# Modify DocumentRoot and Directory settings in a temporary file
(Get-Content $httpdConf) | ForEach-Object { 
    $_ -replace 'DocumentRoot\s+".*"', "DocumentRoot `"$projectRoot\public`"" `
       -replace '<Directory\s+"C:.*">', "<Directory `"$projectRoot\public`">" `
       -replace '</Directory>', "</Directory>`r`nFallbackResource /index.php"
} | Set-Content $tempConf

# Backup original httpd.conf
Copy-Item -Path $httpdConf -Destination $backupConf -Force

# Replace the original httpd.conf with the modified one
Move-Item -Path $tempConf -Destination $httpdConf -Force

# Run SQL Migrations
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$database = "char_craft"
$mysqlUser = "root"
$mysqlPassword = ""
$sqlScriptPath = "$projectRoot\migrations\up\all.sql"

# Ensure the database exists
$createDbCommand = "CREATE DATABASE IF NOT EXISTS $database;"
$createDbCommand | & $mysqlPath -u $mysqlUser --password=$mysqlPassword

# Run SQL Migrations
Get-Content $sqlScriptPath | & $mysqlPath -u $mysqlUser --password=$mysqlPassword $database

Write-Host "Setup complete!"
