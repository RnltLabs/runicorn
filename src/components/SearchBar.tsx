import { useState, FormEvent } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  onSearch: (query: string) => void
}

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("")

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <div className="border-b bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <form onSubmit={handleSubmit} className="flex gap-2 max-w-xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search location..."
              className="pl-10 h-11 text-base"
            />
          </div>
          <Button type="submit" size="lg" className="px-6">
            Search
          </Button>
        </form>
      </div>
    </div>
  )
}
