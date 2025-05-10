"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface Category {
  id: number
  name: string
}

interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: number
  stock: number
  category_id: number
  image_url: string
}

export default function EditProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const isNewProduct = params.id === "new"
  const [loading, setLoading] = useState(!isNewProduct)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [product, setProduct] = useState<Product>({
    id: 0,
    name: "",
    slug: "",
    description: "",
    price: 0,
    stock: 0,
    category_id: 0,
    image_url: "",
  })

  useEffect(() => {
    // Fetch categories
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories")
        const data = await response.json()

        if (response.ok) {
          setCategories(data.categories)
        } else {
          console.error("Failed to fetch categories:", data.message)
        }
      } catch (error) {
        console.error("Error fetching categories:", error)
      }
    }

    // Fetch product if editing
    const fetchProduct = async () => {
      if (isNewProduct) return

      try {
        const response = await fetch(`/api/products/${params.id}`)
        const data = await response.json()

        if (response.ok) {
          setProduct(data)
        } else {
          console.error("Failed to fetch product:", data.message)
        }
      } catch (error) {
        console.error("Error fetching product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
    fetchProduct()
  }, [params.id, isNewProduct])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: value })
  }

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProduct({ ...product, [name]: Number.parseFloat(value) || 0 })
  }

  const handleCategoryChange = (value: string) => {
    setProduct({ ...product, category_id: Number.parseInt(value) })
  }

  const generateSlug = () => {
    const slug = product.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
    setProduct({ ...product, slug })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = isNewProduct ? "/api/products" : `/api/products/${params.id}`

      const method = isNewProduct ? "POST" : "PUT"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      })

      const data = await response.json()

      if (response.ok) {
        router.push("/dashboard/products")
      } else {
        console.error("Failed to save product:", data.message)
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error("Error saving product:", error)
      alert("An error occurred while saving the product")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isNewProduct ? "Add New Product" : "Edit Product"}</CardTitle>
          <CardDescription>
            {isNewProduct ? "Create a new product in your inventory" : "Update the details of an existing product"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" name="name" value={product.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="slug">Slug</Label>
                  <Button type="button" variant="ghost" size="sm" onClick={generateSlug} className="text-xs">
                    Generate from name
                  </Button>
                </div>
                <Input id="slug" name="slug" value={product.slug} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={product.description || ""}
                onChange={handleInputChange}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={product.price}
                  onChange={handleNumberChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  value={product.stock}
                  onChange={handleNumberChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={product.category_id ? product.category_id.toString() : ""}
                  onValueChange={handleCategoryChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                name="image_url"
                value={product.image_url || ""}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" asChild>
              <Link href="/dashboard/products">Cancel</Link>
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : isNewProduct ? (
                "Create Product"
              ) : (
                "Update Product"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

