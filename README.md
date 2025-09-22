# 📒 Bienvenidos a la App de Notas  

Aplicación de gestión de notas con categorías y archivado, desarrollada con **Laravel** (backend) y **React** (frontend).  

---

## 🚀 Requisitos previos  

Antes de comenzar asegúrate de tener instalado:  

- [XAMPP](https://www.apachefriends.org/es/index.html) con **Apache** y **MySQL** en ejecución  
- [Composer](https://getcomposer.org/) para manejar dependencias de PHP  
- [Node.js](https://nodejs.org/) y **npm** para manejar dependencias del frontend  
- [Mysql] (https://www.mysql.com) para que se cree el schema
---

## ⚙️ Instalación y configuración  

1. Clonar este repositorio  
   git clone <(https://github.com/juanluengo88/App-Notas-php)>
   cd <App-Notas-php>

2. Crear archivo .env y pegar el env.example

3. Abrir una terminal y correr los siguiente comandos en orden
    -  composer install (instala las dependencias del proyecto)
    -  php artisan migrate (crea el schema de la base de datos)
    -  php artisan serve (levanta el servidor en la url http://localhost:8000)
  
# IMPORTANTE UNA VEZ CORRIENDO EL SERVIDOR NO CERRARLO

4. Abrir otra terminal y correr los siguientes comandos en orden
    -   cd frontend (moverse al directorio del frontend)
    -   npm install (instala las dependecias del frontend)
    -   npm run dev (corre el proyecto de vite en la url http://localhost:5173)

# UNA VEZ EJECUTADO TODO PODES ENTRAR A LA URL DEL FRONTEND Y DISFRUTAR 
