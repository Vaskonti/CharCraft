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

Run in the main dir of the project:
npm install

Then to run the tests:
npm test



If the packages do not install with "npm install" command, you can install them one by one:
npm install --save-dev jest
npm install --save-dev jest-environment-jsdom
npm install --save-dev @babel/core @babel/preset-env babel-jest
npm install --save-dev jest-canvas-mock

