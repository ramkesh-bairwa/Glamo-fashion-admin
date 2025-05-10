"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ArrowLeft, Link } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "recharts"

interface Brand {
  name: string
  slug: string
  description: string
  icon: string | null
  domain: string
  brand_url: string
}

export default function EditBrandPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [brand, setBrand] = useState<Brand | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)

  useEffect(() => {
    const fetchBrand = async () => {
      try {
        const res = await fetch(`/api/brands/${id}`)
        const data = await res.json()
        if (res.ok) {
          setBrand(data)
          if (data.icon) {
            setPreviewURL("/uploads/brand-icons/"+data.icon)
          }
        } else {
          toast({
            title: "Error",
            className: "bg-red-500 text-white text-center font-semibold",
            duration: 2000,
            description: data.message || "Failed to load brand.",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          className: "bg-red-500 text-white text-center font-semibold",
          duration: 2000,
          description: "Something went wrong while fetching brand.",
        })
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchBrand()
  }, [id])

  const handleUpdate = async () => {
    if (!brand) return
    const formData = new FormData()
    formData.append("name", brand.name)
    formData.append("slug", brand.slug)
    formData.append("description", brand.description)
    formData.append("domain", brand.domain)
    formData.append("brand_url", brand.brand_url)
    if (selectedFile) {
      formData.append("file", selectedFile)
    }

    const res = await fetch(`/api/brands/${id}`, {
      method: "PUT",
      body: formData,
    })

    const data = await res.json()
    if (res.ok) {
      toast({
        title: "Brand updated",
        className: "bg-green-500 text-white text-center font-semibold",
        duration: 2000,
        description: "Successfully updated brand.",
      })
      router.push("/dashboard/brands/" + id)
    } else {
      toast({
        title: "Update failed",
        className: "bg-red-500 text-white text-center font-semibold",
        duration: 2000,
        description: data.message || "Something went wrong.",
      })
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (!brand) return <p className="text-center mt-10 text-red-500">Brand not found</p>

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brand
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Brand</CardTitle>
          <CardDescription>Edit given files to update brand</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Title */}
            <div className="space-y-4">
              <Label htmlFor="name">Title</Label>
              <Input
                id="name"
                name="name"
                value={brand.name}
                onChange={(e) => setBrand({ ...brand, name: e.target.value })}
                placeholder="Enter brand title"
                className="bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Brand Slug */}
            <div className="space-y-4">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                value={brand.slug}
                onChange={(e) => setBrand({ ...brand, slug: e.target.value })}
                placeholder="Enter category slug"
                className="bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Domain and Brand URL in a single row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Domain Input */}
            <div className="space-y-4">
              <Label htmlFor="domain">Domain</Label>
              <Input
                id="domain"
                name="domain"
                value={brand.domain}
                onChange={(e) => setBrand({ ...brand, domain: e.target.value })}
                placeholder="Enter domain"
                className="bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Brand URL Input */}
            <div className="space-y-4">
              <Label htmlFor="brand_url">Brand URL</Label>
              <Input
                id="brand_url"
                name="brand_url"
                value={brand.brand_url}
                onChange={(e) => setBrand({ ...brand, brand_url: e.target.value })}
                placeholder="Enter brand URL"
                className="bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* File upload section */}
          <div className="space-y-4">
            <Label htmlFor="fileUpload">Upload Image</Label>
            <div className="ok_upload">
              <label className="upload-area" htmlFor="fileUpload">
                <svg
                  className="upload-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#3b82f6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16l5-5m0 0l5 5m-5-5v12M5 20h14a2 2 0 002-2v-2a2 2 0 00-2-2h-3M9 20H5a2 2 0 01-2-2v-2a2 2 0 012-2h3"
                  />
                </svg>
                <div className="upload-title">Drag & drop files here</div>
                <div className="upload-desc">
                  or <span>browse</span> to upload
                </div>

                <input
                  type="file"
                  id="fileUpload"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      setSelectedFile(file)

                      if (file.type.startsWith("image/")) {
                        const reader = new FileReader()
                        reader.onloadend = () => setPreviewURL(reader.result as string)
                        reader.readAsDataURL(file)
                      } else {
                        setPreviewURL(null)
                      }
                    }
                  }}
                />
              </label>
              {previewURL && (
                <div className="relative rounded-md shadow-inner text-center h-40 flex flex-col items-center justify-center border border-dashed rounded-md bg-white shadow-inner mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null)
                      setPreviewURL(null)
                    }}
                    className="absolute right-2 top-2 bg-white rounded-full p-1 shadow-md hover:bg-red-100"
                    aria-label="Remove file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-red-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img
                    src={previewURL}
                    alt="Preview"
                    className="h-full object-contain rounded-md"
                  />
                  <p className="text-xs text-gray-600 mt-1 truncate w-40">{selectedFile?.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-4">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={brand.description}
              onChange={(e) => setBrand({ ...brand, description: e.target.value })}
              rows={4}
              className="bg-white border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button onClick={handleUpdate} type="submit" className="bg-blue-500 hover:bg-blue-600">
            Update
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
