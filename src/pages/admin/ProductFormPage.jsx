"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { fetchAdminProduct, createProduct, updateProduct, fetchCategories } from "../../services/api"
import { SpinnerIcon, ChevronLeftIcon, UploadIcon } from "../../components/Icons"

const initialFormState = {
  name: "",
  description: "",
  price: "",
  stock: "",
  category: "",
  status: "Active",
}

function ProductFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEditing = Boolean(id)
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState(initialFormState)
  const [categories, setCategories] = useState([])
  const [image, setImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [existingImage, setExistingImage] = useState(null)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(isEditing)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data.data))
      .catch((err) => console.error("Failed to load categories:", err))

    if (isEditing) {
      fetchAdminProduct(id)
        .then((data) => {
          const product = data.data
          setFormData({
            name: product.name,
            description: product.description,
            price: product.price.toString(),
            stock: product.stock.toString(),
            category: product.category,
            status: product.status,
          })
          if (product.imageUrl) {
            setExistingImage(product.imageUrl.startsWith("/") ? product.imageUrl : `/uploads/${product.imageUrl}`)
          }
        })
        .catch((err) => {
          setSubmitError(err.message)
        })
        .finally(() => setPageLoading(false))
    }
  }, [id, isEditing])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Product name is required"
    } else if (formData.name.length > 200) {
      newErrors.name = "Name must be less than 200 characters"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    } else if (formData.description.length > 2000) {
      newErrors.description = "Description must be less than 2000 characters"
    }

    if (!formData.price) {
      newErrors.price = "Price is required"
    } else if (Number.isNaN(Number(formData.price)) || Number(formData.price) < 0) {
      newErrors.price = "Price must be a positive number"
    }

    if (!formData.stock) {
      newErrors.stock = "Stock is required"
    } else if (!/^\d+$/.test(formData.stock) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative integer"
    }

    if (!formData.category.trim()) {
      newErrors.category = "Category is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }))
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    if (!["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
      setErrors((prev) => ({ ...prev, image: "Only .jpg and .png files are allowed" }))
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be less than 2MB" }))
      return
    }

    setImage(file)
    setImagePreview(URL.createObjectURL(file))
    setErrors((prev) => ({ ...prev, image: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setSubmitError(null)

    try {
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        stock: Number.parseInt(formData.stock, 10),
      }

      if (image) {
        productData.image = image
      }

      if (isEditing) {
        await updateProduct(id, productData)
      } else {
        await createProduct(productData)
      }

      navigate("/admin/products")
    } catch (err) {
      setSubmitError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (pageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <SpinnerIcon className="w-8 h-8 text-primary-600" />
      </div>
    )
  }

  return (
    <div>
      <Link to="/admin/products" className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6">
        <ChevronLeftIcon className="w-5 h-5 mr-1" />
        Back to Products
      </Link>

      <div className="card p-6 max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">{isEditing ? "Edit Product" : "Add New Product"}</h1>

        <form onSubmit={handleSubmit}>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{submitError}</div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="label">
                Product Name *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`input ${errors.name ? "border-red-500" : ""}`}
                placeholder="Enter product name"
              />
              {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label htmlFor="description" className="label">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className={`input resize-none ${errors.description ? "border-red-500" : ""}`}
                placeholder="Enter product description"
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className="label">
                  Price ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  className={`input ${errors.price ? "border-red-500" : ""}`}
                  placeholder="0.00"
                />
                {errors.price && <p className="text-red-600 text-sm mt-1">{errors.price}</p>}
              </div>
              <div>
                <label htmlFor="stock" className="label">
                  Stock *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  min="0"
                  className={`input ${errors.stock ? "border-red-500" : ""}`}
                  placeholder="0"
                />
                {errors.stock && <p className="text-red-600 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="label">
                  Category *
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  list="categories"
                  className={`input ${errors.category ? "border-red-500" : ""}`}
                  placeholder="Enter or select category"
                />
                <datalist id="categories">
                  {categories.map((cat) => (
                    <option key={cat} value={cat} />
                  ))}
                </datalist>
                {errors.category && <p className="text-red-600 text-sm mt-1">{errors.category}</p>}
              </div>
              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select id="status" name="status" value={formData.status} onChange={handleChange} className="select">
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Product Image</label>
              <div className="flex items-start gap-4">
                {(imagePreview || existingImage) && (
                  <div className="w-24 h-24 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={imagePreview || existingImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/jpeg,image/jpg,image/png"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-outline w-full"
                  >
                    <UploadIcon className="w-5 h-5" />
                    {imagePreview || existingImage ? "Change Image" : "Upload Image"}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">JPG or PNG, max 2MB</p>
                  {errors.image && <p className="text-red-600 text-sm mt-1">{errors.image}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? (
                <>
                  <SpinnerIcon className="w-5 h-5" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : isEditing ? (
                "Update Product"
              ) : (
                "Create Product"
              )}
            </button>
            <Link to="/admin/products" className="btn btn-secondary">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormPage
