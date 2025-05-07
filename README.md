# Sistema de Gestión de Recaudadores

Este proyecto es una aplicación web que permite **pre-registrar, identificar y consultar usuarios recaudadores** (naturales y jurídicos), integrando formularios dinámicos, validaciones, autocompletado de localidades y gestión centralizada desde una tabla administrativa.

---

## 🧩 Tecnologías utilizadas

- **Frontend:** React (Next.js), Tailwind CSS, Heroicons, SweetAlert2  
- **Backend:** Django 5.1 + Django REST Framework  
- **Base de datos:** PostgreSQL (via Supabase)  
- **APIs auxiliares:** REST Countries & CountriesNow (para autocompletado de países, estados y ciudades)

---

## ⚙️ Requisitos previos

- Node.js >= 18.x  
- Python >= 3.11  
- PostgreSQL  
- Yarn o npm  
- Entorno virtual para Python (`venv`, `virtualenv` o `pipenv`)  
- `python-decouple` para manejar variables de entorno

---

## 🗂️ Estructura del proyecto
/frontend # Aplicación React con páginas de registro y tabla
/backend # Proyecto Django con APIs RESTful

## 🚀 Cómo levantar el proyecto localmente

### 🔧 Backend (Django)

- python -m venv venv

- source venv\Scripts\activate

- pip install -r requirements.txt

Crear un archivo .env en la raíz de /backend con las variables:

Aplicar migraciones

- python manage.py migrate

Ejecutar el back

- python manage.py runserver

🌐 Frontend (React / Next.js)

Entrar al directorio del frontend:

- cd frontend

- npm install

- npm run dev

