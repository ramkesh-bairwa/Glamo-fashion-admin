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
import { ArrowLeft, Link, Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "recharts"

interface Category {
  name: string
  slug: string
  description: string
}

export default function EditCategoryPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await fetch(`/api/categories/${id}`)
        const data = await res.json()
     
        if (res.ok) {
          setCategory(data)
        } else {
          toast({ title: "Error", className: "bg-red-500 text-white text-center font-semibold",duration: 2000, description: data.message || "Failed to load category." })
        }
      } catch (error) {
        toast({ title: "Error", className: "bg-red-500 text-white text-center font-semibold",duration: 2000, description: "Something went wrong while fetching category." })
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchCategory()
  }, [id])

  const handleUpdate = async () => {
    if (!category) return
    const res = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(category),
    })

    const data = await res.json()
    if (res.ok) {
      toast({ title: "Category updated",className: "bg-green-500 text-white text-center font-semibold",duration: 2000, description: "Successfully updated category." })
      router.push("/dashboard/brands/"+id)
    } else {
      toast({ title: "Update failed",className: "bg-red-500 text-white text-center font-semibold",duration: 2000, description: data.message || "Something went wrong." })
    }
  }

  if (loading) return <p className="text-center mt-10">Loading...</p>
  if (!category) return <p className="text-center mt-10 text-red-500">Category not found</p>

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
        <CardDescription>
          Edit given files to update brand
        </CardDescription>
      </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label >Title</Label>
                  <Input
                    id="name"
                    name="name"
                    value={category.name}
                    onChange={(e) => setCategory({ ...category, name: e.target.value })}
                  />
                  
              </div>
              <div className="space-y-2">
                  <Label >Slug</Label>
                  <Input
                    id="slug"
                    name="slug"
                    value={category.slug}
                    onChange={(e) => setCategory({ ...category, slug: e.target.value })}
              />
              </div>
            
            </div>
          
          <div className="space-y-2">
            <Label >Description</Label>
            <Textarea
              id="description"
              name="description"
              value={category.description}
              onChange={(e) => setCategory({ ...category, description: e.target.value })}
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          
          <Button onClick={handleUpdate} type="submit" >
          Update 
          </Button>
        </CardFooter>
    
    </Card>
  </div>
    
  )
}
