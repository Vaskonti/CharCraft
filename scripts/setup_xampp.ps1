# Run this before running the script: Set-ExecutionPolicy AllSigned
# Or run this one: Set-ExecutionPolicy RemoteSigned
# This script copies the desired Apache configuration and creates a backup for the old one, so a person can easily switch between the two
# Please fill out the correct paths and configs before you run the script
# THIS SCRIPT IS WINDOWS OS EXCLUSIVE
# Define Paths
$xamppPath = "C:\xampp\apache\conf"
$projectRoot = "C:\xampp\htdocs\CharCraft"
$httpdConf = "$xamppPath\httpd.conf" # Current httpd.conf
$backupConf = "$xamppPath\httpd_backup.conf" # Where to put the backup
$customConf = "$projectRoot/scripts/httpd.conf" # Custom httpd.conf in the project
$documentRoot = "DocumentRoot '$projectRoot/public/'" # project CharCraft's path to public folder
$directory = "<Directory '$projectRoot/public/'>" # An additional setting for 

# Replace DocumentRoot
(Get-Content $customConf) -replace 'DocumentRoot\s+".*"', $documentRoot | Set-Content $customConf
(Get-Content $customConf) -replace '<Directory\s+"C:.*>', $directory | Set-Content $customConf

# Backup original httpd.conf
Copy-Item -Path $httpdConf -Destination $backupConf -Force

# Append custom configurations
Get-Content $customConf | Add-Content -Path $httpdConf

# Run SQL Migrations
$mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
$database = "char_craft"
$mysqlUser = "root"
$mysqlPassword = ""
$sqlScriptPath = "$projectRoot\migrations\up\all.sql"

Get-Content $sqlScriptPath | & $mysqlPath -u $mysqlUser -p$mysqlPassword $database

Write-Host "Setup complete!"