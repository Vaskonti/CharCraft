### CharCraft



## Unit testing with jest

# Windows:
If you have npm installed already, you can skip these steps:

Install chocolatey on powershell by administrator:
powershell -c "irm https://community.chocolatey.org/install.ps1|iex"

Install node.js version 22:
choco install nodejs-lts --version="22.11.0"

You may need to reset the enviorment before verifying.
Verify instalation:
node -v     # Should print "v22.12.0".
npm -v      # Should print "10.9.0".


Install Jest with:
npm install --save-dev jest