"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function CreateLeaguePage() {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false)

  return (
    <div>
      {/* Tournament Selection card stays exactly the same */}
      {/* Advanced Settings Toggle */}
      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
          className="flex items-center gap-2 px-6 py-3 bg-muted/50 hover:bg-muted rounded-lg transition-colors"
        >
          <span className="font-medium">Advanced Settings</span>
          <ChevronDown className={`h-4 w-4 transition-transform ${showAdvancedSettings ? "rotate-180" : ""}`} />
        </button>
      </div>

      {showAdvancedSettings && (
        <>
          {/* Budget Controls card stays exactly the same */}
          {/* Auction Settings card stays exactly the same */}
          {/* League Rules card stays exactly the same */}
          {/* Invite Members card stays exactly the same */}
        </>
      )}
    </div>
  )
}
