"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Trash2, Pencil } from "lucide-react"
import ConfirmDeleteDialog from "@/components/ConfirmDeleteDialog"

interface Brand {
  id: number
  name: string
  slug: string
  description: string
  created_at: string
  icon?: string // optional image URL
}


export default function BrandsPage() {
  const { toast } = useToast()
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [brandToDelete, setBrandToDelete] = useState<number | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const ITEMS_PER_PAGE = 10

  useEffect(() => {
    fetchBrands()
    console.log(brands)
  }, [searchTerm, currentPage])

  const fetchBrands = async () => {
  try {
    setLoading(true)
    const response = await fetch(`/api/brands?search=${searchTerm}&page=${currentPage}&limit=${ITEMS_PER_PAGE}`)
    const data = await response.json()

    if (response.ok) {
      setBrands(data.brands)
      setTotalPages(Math.ceil(data.total / ITEMS_PER_PAGE)) // Assuming API returns a `total`
    } else {
      console.error("Failed to fetch brands:", data.message)
    }
  } catch (error) {
    console.error("Error fetching brands:", error)
  } finally {
    setLoading(false)
  }
}

  const handleDeleteBrand = async () => {
    if (!brandToDelete) return

    try {
      const response = await fetch(`/api/brands/${brandToDelete}`, {
        method: "DELETE",
      })

      if (response.ok) {
        // Remove the deleted brand from the state
        setBrands(brands.filter((brand) => brand.id !== brandToDelete))
        setIsDeleteDialogOpen(false)
        setBrandToDelete(null)
        toast({
          title: "Brand Deleted",
          description: "The brand deleted successfully.",
          duration: 2000,
          className: "bg-red-500 text-white text-center font-semibold",
        })
      } else {
        const data = await response.json()
        console.error("Failed to delete brand:", data.message)
      }
    } catch (error) {
      console.error("Error deleting brand:", error)
    }
  }

  const confirmDelete = (id: number) => {
    setBrandToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2 w-full max-w-sm">
          <Input
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="max-w-sm"
          />
          <Button variant="outline" size="icon">
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Button asChild>
          <Link href="/dashboard/brands/new">
            <Plus className="mr-2 h-4 w-4" />
              Add New Brand
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Brands</CardTitle>
          <CardDescription>Manage your brands.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Loading brands...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Icon</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Brand URL</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.isArray(brands) && brands.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No Brand found
                    </TableCell>
                  </TableRow>
                ) : (
                  brands?.map((brand) => (
                    <TableRow key={brand.id}>
                
                <TableCell className="font-medium">{brand.name}</TableCell>
                <TableCell>
                {brands.icon ? (
                    <img
                      src={`/uploads/brand-icons/${brand.icon}`} // 👈 base path added
                      alt={brand.name}
                      className="w-12 h-12 rounded-xl border border-gray-300 shadow-sm transition-transform duration-200 hover:scale-105"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-xs text-gray-500">
                      N/A
                    </div>
                  )}

                </TableCell>
                <TableCell>{brand.domain}</TableCell>
                <TableCell>{brand.brand_url}</TableCell>
                <TableCell>{new Date(brand.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                              <Link href={`/dashboard/brands/${brand.id}`}>
                                <Pencil className="mr-2 h-4 w-4" /> Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => confirmDelete(brand.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
              </TableRow>

                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-center items-center gap-2 mt-4">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span className="text-sm font-medium">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>

      <ConfirmDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteBrand}
        />
    </div>
  )
}

