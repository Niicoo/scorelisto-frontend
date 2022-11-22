SOURCES
=======
* https://publicdomainvectors.org/  
* https://opensheetmusicdisplay.org/
* https://termsandconditionstemplate.com/  


PRODUCTION
==========

* mettre le flag a true dans authentication.service.ts (https only)
* mettre production a true dans /environments/environments.ts
* mettre with credential a true dans les requetes ?


INSTALLATION
============

# NodeJS 10.x (Using Ubuntu)
curl -sL https://deb.nodesource.com/setup_10.x | sudo -E bash -  
sudo apt-get install -y nodejs  
sudo apt-get install -y build-essential

# Angular (https://angular.io/guide/quickstart)
npm install -g @angular/cli  

USEFUL INFOS
============

# Creating the project
ng new scorelistoweb
cd scorelistoweb

# ng bootstrap
npm install @ng-bootstrap/ng-bootstrap --save  
# ngx bootstrap (https://valor-software.com/ngx-bootstrap/#/documentation#installation-instructions)
npm install ngx-bootstrap --save  
# ngx cookies
npm install ngx-cookie-service --save
# file saver
npm install file-saver --save
npm install @types/file-saver --save
# ngx highcharts (https://medium.com/@balramchavan/using-highcharts-with-angular-5-6c6564a55cf0)
npm install highcharts --save
npm install @types/highcharts --save
# Waveform
npm install wavesurfer.js --save
# OpenSheetMusicDisplay (https://github.com/opensheetmusicdisplay/opensheetmusicdisplay)
npm install opensheetmusicdisplay --save
copy file into src/app directory


# In node_modules/highcharts/highcharts.d.ts , modify this line:
`export function each(arr: Array<any>, fn: () => void, ctx?: any): void;`  
into 
`export function each(arr: Array<any>, fn: (chart?:any) => void, ctx?: any): void;`  


# Move to app directory
cd app


# Creating the different components
ng generate component About  
ng generate component Contact  
ng generate component Home  
ng generate component Login  
ng generate component PageNotFound  
ng generate component SetNewPassword  
ng generate component Account   
ng generate component AccountValidation  

ng generate module SharedModule  
ng generate component Recorder  
ng generate component FileInput  
ng generate component ProgressionBar  
ng generate component ScorePrinter  

ng generate module converter --routing=true  
ng generate component Converter --module=converter
ng generate interface converter/converter-common
ng generate component converter/Parameters --module=converter
ng generate component converter/Project --module=converter
ng generate component converter/project/Create --module=converter
ng generate component converter/project/AdvancedConverter --module=converter
ng generate component converter/project/advanced-converter/Step1 --module=converter
ng generate component converter/project/advanced-converter/Step2 --module=converter
ng generate component converter/project/advanced-converter/Step3 --module=converter


# Creating the service
ng generate interface backend-services/global-backend 
ng generate service backend-services/authentication   
ng generate service backend-services/project-manager  
ng generate service backend-services/parameters-manager  
ng generate service backend-services/task-manager 
ng generate service backend-services/account-manager 

# Copy old files to the new repository
cd scorelistoweb
export OLD_APP_DIR=/path/to/the/old/appdir  
rm -rf ./src/favicon.ico
cp $OLD_APP_DIR/README.md ./README.md
cp $OLD_APP_DIR/src/index.html ./src/index.html
cp $OLD_APP_DIR/src/styles.css ./src/styles.css
rm -rf ./src/assets
cp -R $OLD_APP_DIR/src/assets/ ./src/assets
rm -rf .git
cp -R $OLD_APP_DIR/.git/ .git
rm -rf ./src/app
cp -R $OLD_APP_DIR/src/app/ ./src/app

.htaccess
=========
```
RewriteEngine On
RewriteCond %{HTTPS} off [OR]
Rewritecond %{HTTP_HOST} !^www\.scorelisto\.com
RewriteRule (.*) https://www.scorelisto.com/$1 [R=301,L]

RewriteCond %{REQUEST_FILENAME} -f
RewriteRule .? - [L]

RewriteRule ^/css(/|$) - [L,NC]
RewriteRule ^/img(/|$) - [L,NC]
RewriteRule ^/js(/|$) - [L,NC]

# Rewrite all other queries to the front controller.
RewriteRule ^ index.html [L]
```  





# Scorelistoweb

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).



TO DO LIST
==========

- "retry" dans les services en cas de mauvaise connexion de l'user  
- revoir le systeme de client id and client secret, pas normal de stocker une client secret commme ça 
- pour l'instant, pas de expiration date pour le refresh token
- telecharger directement les font awesome
- dans le backend.service gerer personaliser les erreurs pour chaque request
- dans le backend.service gerer le telechargement de fichier + le type d'observable en sorties
- Mettre a jour les projets et parametres si ça fait longtemps que pas de reponse utilisateur pour pas risquer de conflit si il a ouvert dans d'autres navigateurs
- Verifier que le username/email ne soit pas deja pris (in the formcontrol)
- faire les validation pour toutes les forms
- generer les messages d'erreur a l'utilisateur en mode notif
- Faire un check sur la reactivité du programme en mesurant ses performances, par exemple quand on click sur converter alors qu'on est pas connecté ==> très lent a rediriger vers login
- reload page on stepconversion2 fail
- enlever le pointeur qui bouge sur les graphiques... ca ralenti
- super important que les project ne s'actualisent pas trop => impact tous le reste : reactualisation des figures etc...
- faire tous les boutons avec meme css , parce que la yen a des sombres et des clairs
- limiter nombre de request par ip pour le contact form
- lorsque je clique sur Forgot Password alors que j'ai le focus sur le username qui est invalide, le clique je marche pas parce que l'apparition de la notification fait descendre le bouton
- faire un component Partition generic
- dropdown du menu sur le coté

IDEAS
=====
- creer une vue dans le backend pour recuperer les validateur pour chaque parametres et les synchroniser avec angular comme ça plus besoin de les fixer a 2 endroits différents
- pour l'instant je recharge tous les projects a chaque petite modification, ca limite les sources d'erreur mais plus de requetes a faire

