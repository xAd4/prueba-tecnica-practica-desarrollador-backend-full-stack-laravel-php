import { useAppDispatch, useAppSelector } from '../../app/store/hooks'
import { libraryApi } from '../../shared/api/libraryApi'
import { getErrorMessage, getErrorStatus, getValidationErrors } from '../../shared/api/apiErrors'
import type { ApiItemResponse, ApiMessageResponse, SaveResult } from '../../shared/types/api.types'
import { showErrorAlert, showSuccessToast } from '../../shared/utils/alerts'
import {
  clearCategories,
  onAddNewCategory,
  onDeleteCategory,
  onFinishSavingCategory,
  onLoadAllResponseOfCategoriesSinceBackend,
  onLoadCategories,
  onSetActiveCategory,
  onStartLoadingCategories,
  onStartSavingCategory,
  onUpdateCategory,
} from '../slices/categorySlice'
import type { CategoriesResponse, Category, CategoryPayload } from '../types/category.types'

/**
 * Every call to the /categories API lives here. Each action updates the
 * global Redux state (categorySlice) with the backend response.
 */
export const useCategoriesStore = () => {
  const dispatch = useAppDispatch()
  const { categories, allResponse, activeCategory, isLoadingCategories, isSavingCategory } =
    useAppSelector((state) => state.categories)

  const startLoadingCategories = async (): Promise<void> => {
    try {
      dispatch(onStartLoadingCategories())
      const { data } = await libraryApi.get<CategoriesResponse>('/categories')
      dispatch(clearCategories())
      dispatch(onLoadCategories([...data.data]))
      dispatch(onLoadAllResponseOfCategoriesSinceBackend([data]))
    } catch (error) {
      showErrorAlert(getErrorMessage(error, 'NO BACKEND: Error al cargar las categorías'))
      dispatch(onLoadCategories([]))
    }
  }

  const startSavingCategory = async (payload: CategoryPayload): Promise<SaveResult> => {
    try {
      dispatch(onStartSavingCategory())

      if (activeCategory) {
        const { data } = await libraryApi.put<ApiItemResponse<Category>>(
          `/categories/${activeCategory.id}`,
          payload,
        )
        dispatch(onUpdateCategory(data.data))
        showSuccessToast(data.message ?? 'Categoría actualizada')
      } else {
        const { data } = await libraryApi.post<ApiItemResponse<Category>>('/categories', payload)
        dispatch(onAddNewCategory(data.data))
        showSuccessToast(data.message ?? 'Categoría creada')
      }

      return { ok: true }
    } catch (error) {
      dispatch(onFinishSavingCategory())

      const validationErrors = getValidationErrors(error)
      if (validationErrors) {
        return { ok: false, errors: validationErrors }
      }

      showErrorAlert(getErrorMessage(error, 'NO BACKEND: Error al guardar la categoría'))
      return { ok: false, errors: {} }
    }
  }

  const startDeletingCategory = async (category: Category): Promise<boolean> => {
    try {
      const { data } = await libraryApi.delete<ApiMessageResponse>(`/categories/${category.id}`)
      dispatch(onDeleteCategory(category.id))
      showSuccessToast(data.message ?? 'Categoría eliminada')
      return true
    } catch (error) {
      if (getErrorStatus(error) === 404) {
        dispatch(onDeleteCategory(category.id))
      }
      // 409: the category still has books associated.
      showErrorAlert(
        getErrorMessage(error, 'NO BACKEND: Error al eliminar la categoría'),
        getErrorStatus(error) === 409 ? 'No se puede eliminar' : 'Error',
      )
      return false
    }
  }

  const setActiveCategory = (category: Category | null) => dispatch(onSetActiveCategory(category))

  return {
    // Properties
    categories,
    allResponse,
    activeCategory,
    isLoadingCategories,
    isSavingCategory,

    // Methods
    startLoadingCategories,
    startSavingCategory,
    startDeletingCategory,
    setActiveCategory,
  }
}
