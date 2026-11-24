1. Descripción del Proyecto

Debes desarrollar una pequeña aplicación funcional para gestionar una biblioteca de libros. La solución debe permitir realizar las operaciones esenciales de gestión (CRUD) y filtrado de contenido mediante el framework Laravel y PHP.   

Funcionalidades requeridas:

Listar los libros disponibles en el sistema.
Crear un nuevo libro relacionándolo a una categoría.
Editar la información de un libro existente.
Eliminar libros registrados.
Filtrar la lista de libros según su categoría.
2. Requisitos de Modelo y Base de Datos

Crea la base de datos con dos tablas principales y sus respectivas relaciones Eloquent:   

Tabla: books (Libros)   

id: BigInt / Auto-incremental (PK)
title: String / Requerido
author: String / Requerido
description: Text / Opcional
published_year: Year/Int / Requerido
category_id: BigInt / FK (categories)
Tabla: categories (Categorías)   

id: BigInt / Auto-incremental (PK)
name: String / Requerido y Único
3. Rutas y Controladores

Implementa los siguientes endpoints:   

GET /books -> Listar todos los libros almacenados.
POST /books -> Crear un nuevo libro en el sistema.
PUT /books/{id} -> Actualizar/Editar la información de un libro.
DELETE /books/{id} -> Eliminar un libro específico.
GET /books?category={category_id} -> Filtrar la lista de libros por categoría especificada.
4. Validaciones

title: Obligatorio, mínimo 3 caracteres.
author: Obligatorio.
published_year: Obligatorio, año válido.
category_id: Obligatorio, debe existir en categories.
Categorías: El nombre debe ser único al registrar una nueva categoría.
5. Lógica de Negocio

Verificar la existencia del libro antes de proceder con su eliminación.
Verificar que una categoría no tenga libros asociados antes de permitir su eliminación.
Criterios de Evaluación: Arquitectura de código (MVC), uso de Migraciones y Seeders, Form Requests para validación, manejo adecuado de ORM Eloquent y tratamiento de respuestas/errores HTTP.   