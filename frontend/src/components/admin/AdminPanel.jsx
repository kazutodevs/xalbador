import { useEffect, useState } from 'react'
import { PlusCircle, Layers, Upload, X } from 'lucide-react'
import api from '@services/api'
import Card from '@components/common/Card'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const [categories, setCategories] = useState([])
  const [categoryForm, setCategoryForm] = useState({ name: '', slug: '', sort_order: 0 })
  const [productForm, setProductForm] = useState({
    name_en: '',
    name_id: '',
    description_en: '',
    description_id: '',
    price: 0,
    category_id: '',
    is_active: true,
    image_url: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await api.get('/products/categories')
      setCategories(response.data)
      if (response.data.length > 0 && !productForm.category_id) {
        setProductForm((prev) => ({ ...prev, category_id: response.data[0].id }))
      }
    } catch (error) {
      toast.error('Failed to load categories')
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => setImagePreview(e.target?.result)
      reader.readAsDataURL(file)
    }
  }

  const uploadImage = async () => {
    if (!imageFile) return null

    try {
      const formData = new FormData()
      formData.append('image', imageFile)

      const response = await api.post('/products/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success && response.data.url) {
        return response.data.url
      } else {
        throw new Error(response.data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Image upload error:', error)
      toast.error(`Failed to upload image: ${error.response?.data?.error || error.message}`)
      return null
    }
  }

  const handleProductSubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      let imageUrl = productForm.image_url

      if (imageFile) {
        setUploading(true)
        imageUrl = await uploadImage()
        setUploading(false)
        if (!imageUrl) {
          toast.error('Image upload failed')
          return
        }
      }

      await api.post('/products', { ...productForm, image_url: imageUrl })
      toast.success('Product created')
      setProductForm({
        name_en: '',
        name_id: '',
        description_en: '',
        description_id: '',
        price: 0,
        category_id: categories[0]?.id || '',
        is_active: true,
        image_url: '',
      })
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create product')
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySubmit = async (event) => {
    event.preventDefault()
    try {
      setLoading(true)
      await api.post('/products/categories', categoryForm)
      toast.success('Category created')
      setCategoryForm({ name: '', slug: '', sort_order: 0 })
      fetchCategories()
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <PlusCircle className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold">Admin Product Management</h3>
        </div>

        <form onSubmit={handleProductSubmit} className="grid gap-4">
          {/* Image Upload */}
          <div className="border-2 border-dashed border-primary-300 dark:border-primary-700 rounded-2xl p-6 text-center hover:border-primary-500 transition">
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="Preview" className="w-40 h-40 object-cover rounded-xl" />
                <button
                  type="button"
                  onClick={() => {
                    setImageFile(null)
                    setImagePreview(null)
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-primary-400 mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Click to upload product image
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product name (EN)"
              value={productForm.name_en}
              onChange={(e) => setProductForm({ ...productForm, name_en: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
            <input
              type="text"
              placeholder="Product name (ID)"
              value={productForm.name_id}
              onChange={(e) => setProductForm({ ...productForm, name_id: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
          </div>

          <textarea
            placeholder="Description (EN)"
            value={productForm.description_en}
            onChange={(e) => setProductForm({ ...productForm, description_en: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 min-h-[120px]"
          />
          <textarea
            placeholder="Description (ID)"
            value={productForm.description_id}
            onChange={(e) => setProductForm({ ...productForm, description_id: e.target.value })}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 min-h-[120px]"
          />

          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Price"
              value={productForm.price}
              onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
            <select
              value={productForm.category_id}
              onChange={(e) => setProductForm({ ...productForm, category_id: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
              <input
                type="checkbox"
                checked={productForm.is_active}
                onChange={(e) => setProductForm({ ...productForm, is_active: e.target.checked })}
                className="h-4 w-4 rounded border-slate-300 text-primary-600"
              />
              Active
            </label>
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold shadow-lg shadow-primary-500/20 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? 'Uploading image...' : loading ? 'Creating product...' : 'Create product'}
          </button>
        </form>
      </Card>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-6">
          <Layers className="w-6 h-6 text-primary-600" />
          <h3 className="text-xl font-semibold">Admin Category Management</h3>
        </div>

        <form onSubmit={handleCategorySubmit} className="grid gap-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Category name"
              value={categoryForm.name}
              onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
            <input
              type="text"
              placeholder="Category slug"
              value={categoryForm.slug}
              onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              required
            />
            <input
              type="number"
              placeholder="Sort order"
              value={categoryForm.sort_order}
              onChange={(e) => setCategoryForm({ ...categoryForm, sort_order: Number(e.target.value) })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-primary-600 px-5 py-3 text-white font-semibold shadow-lg shadow-primary-500/20 transition hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Create category
          </button>
        </form>
      </Card>
    </div>
  )
}
