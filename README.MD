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


# Frontend:
- El estado global lo usarás así: Cuando mandes a llamar el useLLAMADAALAAPIstore, modificarás el estado global con redux: EJEMPLO:

const startLoadingFleters = async (filterDate?: string): Promise<void> => {
    try {
      dispatch(onStartLoading());
    
      // Construir la URL con o sin company_id
      const params = new URLSearchParams();

      if (selectedCompanyId) {
        params.append("company_id", selectedCompanyId.toString());
      }

      if (filterDate) {
        params.append("date", filterDate);
      }

      let url = `/fleters`;
      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const { data } = await logisticAppApi.get(url);
      dispatch(clearFleters());
      dispatch(onLoadFleter([...data.data]));
      dispatch(onLoadAllResponseOfFleterSinceBackend([data]));
    } catch (error: any) {
      if (error?.response?.status === 401) {
        // No mostrat Swal.fire
        dispatch(onLoadFleter([]));
        return;
      }
      const errorMessage =
        error?.response?.data?.message ||
        "NO BACKEND: Error al cargar los fleters";
      Swal.fire("Error", errorMessage, "error");
      dispatch(onLoadFleter([]));
    }
  };

  /* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Request {
  id: number;
  [key: string]: any;
}

export interface Fleter {
  /** «Cargonam» = bolsa «Choferes Cargonam»; «Registro interno» = chofer propio. */
  origin?: string | null;
  id: number;
  requests: Request[];
  [key: string]: any;
}

export interface FleterState {
  isLoadingFleter: boolean;
  fleters: Fleter[];
  allResponse: Fleter[];
  activeFleter: Fleter | null;
  actualPage: number;
  lastPage: number;
}

const initialState: FleterState = {
  isLoadingFleter: false,
  fleters: [],
  allResponse: [],
  activeFleter: null,
  actualPage: 1,
  lastPage: 1,
};

export const fleterSlice = createSlice({
  name: "fleter",
  initialState,
  reducers: {
    onStartLoading: (state) => {
      state.isLoadingFleter = true;
    },
    onSetActiveFleter: (state, { payload }: PayloadAction<Fleter>) => {
      state.activeFleter = payload;
    },
    onLoadFleter: (state, { payload = [] }: PayloadAction<Fleter[]>) => {
      state.isLoadingFleter = false;
      payload.forEach((fleter: Fleter) => {
        const exists = state.fleters.some(
          (dbFleter) => dbFleter.id === fleter.id
        );
        if (!exists) {
          state.fleters.push({
            ...fleter,
            requests: fleter.requests ?? [],
          });
        }
      });
    },
    onLoadAllResponseOfFleterSinceBackend: (state, { payload = [] }: PayloadAction<Fleter[]>) => {
      state.isLoadingFleter = false;
      state.allResponse = payload;
    },
    onAddNewFleter: (state, { payload }: PayloadAction<Fleter>) => {
      state.fleters.push({
        ...payload,
        requests: payload.requests ?? [],
      });
      state.activeFleter = null;
    },
    onUpdateFleter: (state, { payload }: PayloadAction<Fleter>) => {
      state.fleters = state.fleters.map((fleter) => {
        if (fleter.id === payload.id) {
          return payload;
        }
        return fleter;
      });
    },
    onDeleteFleter: (state, action: PayloadAction<number>) => {
      const idToDelete = action.payload;
      state.fleters = state.fleters.filter(
        (fleter) => fleter.id !== idToDelete
      );
      if (state.activeFleter?.id === idToDelete) {
        state.activeFleter = null;
      }
    },

    onReassignRequest: (
      state,
      {
        payload,
      }: PayloadAction<{
        request: Request;
        newFleterId: number;
      }>
    ) => {
      const { request, newFleterId } = payload;

      state.fleters.forEach((f) => {
        f.requests = (f.requests ?? []).filter((r) => r.id !== request.id);
      });

      const dest = state.fleters.find((f) => f.id === newFleterId);
      if (dest) {
        dest.requests = dest.requests ?? [];
        dest.requests.push(request);
      }
    },

    clearFleters: (state) => {
      state.fleters = [];
      state.allResponse = [];
      state.activeFleter = null;
      state.isLoadingFleter = false;
    },

    // RELACIONES
    onSetFleterRequests: (
      state,
      {
        payload,
      }: PayloadAction<{
        fleterId: number;
        requests: Request[];
      }>
    ) => {
      const fl = state.fleters.find((f) => f.id === payload.fleterId);
      if (!fl) return;
      fl.requests = payload.requests;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  onSetActiveFleter,
  onLoadFleter,
  onLoadAllResponseOfFleterSinceBackend,
  onAddNewFleter,
  onUpdateFleter,
  onDeleteFleter,
  clearFleters,
  onStartLoading,
  onReassignRequest,

  // Relaciones
  onSetFleterRequests,
} = fleterSlice.actions;
