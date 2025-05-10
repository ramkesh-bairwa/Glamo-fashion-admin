import React, { useState, useRef, useEffect } from "react"

interface Brand {
  id: number
  name: string
}

interface CustomDropdownProps {
  title:string | null
  brandList: Brand[]
  selectedBrandId: number | null
  onSelect: (id: number) => void
}

export default function CustomDropdown({
  title,
  brandList,
  selectedBrandId,
  onSelect,
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const selectedBrand = brandList.find((b) => b.id === selectedBrandId)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <label htmlFor="brand" className="dropdown-label">
       {title}
      </label>
      <div
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
        id="brand"
      >
        {selectedBrand ? selectedBrand.name : <span className="placeholder">Choose a brand</span>}
        <span className="arrow">&#9662;</span>
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          {brandList.length === 0 ? (
            <li className="dropdown-item disabled">No brands found</li>
          ) : (
            brandList.map((brand) => (
              <li
                key={brand.id}
                className={`dropdown-item ${brand.id === selectedBrandId ? "selected" : ""}`}
                onClick={() => {
                  onSelect(brand.id)
                  setIsOpen(false)
                }}
              >
                {brand.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}
