"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface ContentImprovementContext {
  userData: any | null
  updateUserData: (data: any) => void
}

const ContentImprovementContext = createContext<ContentImprovementContext | undefined>(undefined)

export function ContentImprovementProvider({ 
  children, 
  initialUserData = null 
}: { 
  children: ReactNode
  initialUserData?: any
}) {
  const [userData, setUserData] = useState<any | null>(initialUserData)

  const updateUserData = (data: any) => {
    setUserData(data)
  }

  return (
    <ContentImprovementContext.Provider value={{ userData, updateUserData }}>
      {children}
    </ContentImprovementContext.Provider>
  )
}

export function useContentImprovement() {
  const context = useContext(ContentImprovementContext)
  
  if (context === undefined) {
    throw new Error("useContentImprovement must be used within a ContentImprovementProvider")
  }
  
  return context
} 