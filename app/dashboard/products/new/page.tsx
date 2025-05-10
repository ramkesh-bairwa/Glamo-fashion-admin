"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import CustomDropdown from "@/components/ui/select"

interface Brand {
  id: number
  name: string
}

interface Product {
  brand_id: number | null
  product_url: string
}

export default function CreateProduct() {
  const { toast } = useToast()
  const router = useRouter()

  const [saving, setSaving] = useState(false)
  const [brandList, setBrandList] = useState<Brand[]>([])
  const [product, setProduct] = useState<Product>({
    brand_id: null,
    product_url: "",
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProduct((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const formData = new FormData()
      formData.append("brand_id", String(product.brand_id))
      formData.append("product_url", product.product_url)
      const response = await fetch("/api/products", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "New Brand Added",
          description: "The brand was added successfully.",
          duration: 2000,
          className: "bg-green-500 text-white text-center font-semibold",
        })
        router.push("/dashboard/brands")
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error("Error creating product:", error)
      alert("An error occurred while creating the product.")
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands?search=&page=1&limit=500")
      const data = await res.json()
      setBrandList(data.brands || [])
    } catch (error) {
      console.error("Error fetching brands:", error)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Product</CardTitle>
          <CardDescription>Fill out the form to create a new product.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <CustomDropdown
                  title="Select Brand"
                  brandList={brandList}
                  selectedBrandId={product.brand_id}
                  onSelect={(id) => setProduct({ ...product, brand_id: id })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="product_url">Product URL</Label>
                <Input
                  id="product_url"
                  name="product_url"
                  value={product.product_url}
                  onChange={handleInputChange}
                />
              </div>
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
              ) : (
                "Create"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
