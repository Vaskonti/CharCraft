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

# # Run SQL Migrations
# $mysqlPath = "C:\xampp\mysql\bin\mysql.exe"
# $database = "your_database"
# $mysqlUser = "root"
# $mysqlPassword = "YourPassword"
# $sqlScriptPath = "C:\xampp\htdocs\CharCraft\migrations\up\all.sql"

# Get-Content $sqlScriptPath | & $mysqlPath -u $mysqlUser -p$mysqlPassword $database

Write-Host "Setup complete!"