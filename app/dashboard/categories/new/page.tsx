"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

interface Brand {
  name: string
  domain: string
  brand_url: string
  slug: string
  icon:string
  description: string
}

interface ValidationErrors {
  name?: string
  domain: string
  brand_url: string
  icon:string
  slug?: string
}

export default function CreateBrandPage() {
  const { toast } = useToast()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [brand, setBrand] = useState<Brand>({
    name: "",
    domain:"",
    brand_url:"",
    slug: "",
    icon:"",
    description: "",
  })
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({})

  const validate = (): boolean => {
    const errors: ValidationErrors = {}

    if (brand.name.trim().length < 3) {
      errors.name = "Title must be at least 3 characters."
    }

    if (brand.slug.trim().length < 3) {
      errors.slug = "Slug must be at least 3 characters."
    } else if (!/^[a-z0-9-]+$/.test(brand.slug)) {
      errors.slug = "Slug can only contain lowercase letters, numbers, and hyphens."
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setBrand((prev) => ({ ...prev, [name]: value }))
    setValidationErrors((prev) => ({ ...prev, [name]: undefined })) // Clear error on change
  }

  const generateSlug = () => {
    const slug = brand.name
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")
    setBrand((prev) => ({ ...prev, slug }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    if (!validate()) return
  
    setSaving(true)
    try {
      const formData = new FormData()
      formData.append("name", brand.name)
      formData.append("slug", brand.slug)
      formData.append("domain", brand.domain)
      formData.append("brand_url", brand.brand_url)
      formData.append("description", brand.description)
      if (selectedFile) {
        formData.append("file", selectedFile)
      }
  
      const response = await fetch("/api/brands", {
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
      console.error("Error creating brand:", error)
      alert("An error occurred while creating the brand")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className="flex items-center mb-4">
        <Button variant="ghost" size="sm" asChild className="mr-2">
          <Link href="/dashboard/products">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brand list
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Brand</CardTitle>
          <CardDescription>
            Create a new brand by filling out the form below.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                  <Label htmlFor="name">Brand Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={brand.name}
                      onChange={handleInputChange}
                      onBlur={validate}
                      
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-500">{validationErrors.name}</p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="domain">Domain Name</Label>
                    <Input
                      id="domain"
                      name="domain"
                      value={brand.domain}
                      onChange={handleInputChange}
                      onBlur={validate}
                      
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-500">{validationErrors.name}</p>
                    )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand_url">Brand URL</Label>
                    <Input
                      id="brand_url"
                      name="brand_url"
                      value={brand.brand_url}
                      onChange={handleInputChange}
                      onBlur={validate}
                      
                    />
                    {validationErrors.name && (
                      <p className="text-sm text-red-500">{validationErrors.name}</p>
                    )}
                </div>
                <div className="space-y-2">
                    <Label htmlFor="stock">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={brand.slug}
                      onChange={handleInputChange}
                      onBlur={validate}
                  
                />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={generateSlug}
                    className="text-xs"
                  >
                    Generate from name
                  </Button>
                </div>
              
              </div>
              <div className="space-y-2">
              <div className="ok_upload">
                <label className="upload-area" htmlFor="fileUpload">
                  <svg className="upload-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M7 16l5-5m0 0l5 5m-5-5v12M5 20h14a2 2 0 002-2v-2a2 2 0 00-2-2h-3M9 20H5a2 2 0 01-2-2v-2a2 2 0 012-2h3" />
                  </svg>

                  <div className="upload-title">Drag & drop files here</div>
                  <div className="upload-desc">or <span>browse</span> to upload</div>

                  <input type="file"  id="fileUpload"
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
                        }} />
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
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={brand.description}
                onChange={handleInputChange}
                rows={4}
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
