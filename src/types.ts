
export interface Defect {
    id: string | number
    routeId?: string | number // Foreign key to Route
    location: string
    coordinates: string
    type: string
    confidence: number
    status: string
    image: string
    timestamp: string
    severity: 'high' | 'medium' | 'low'
    description?: string

    // New fields for Detail View
    area?: string // e.g. "15.2 cm²"
    width?: string // e.g. "4.8 mm"
    material?: string // e.g. "混凝土"
    growthRate?: string // e.g. "+21.6%"
    historyImage?: string
    historyDate?: string
    aiAnalysis?: {
        confidence: number
        model: string
        risk: string // e.g. "快速恶化"
        recommendation: string
    }
}

export interface Route {
    id: string | number
    name: string
    defectCount: number
    riskLevel: 'high' | 'medium' | 'low' | 'good'
    status: string
}

export interface Stats {
    distance: number
    defects: number
    newDefects: number
    critical: number
}

export interface Alert {
    id: string | number
    time: string
    title: string
    desc: string
    type: string
    severity: 'high' | 'medium' | 'low'
}

export interface StoreData {
    stats: Record<string, Stats>
    defects: Defect[]
    routes: Route[]
    alerts: Alert[]
}
