import store from '../store'
import type { Stats, Defect } from '../types'

export const MockApi = {
    // Simulate getting aggregated stats from backend
    getDashboardStats(): Record<string, Stats> {
        const defects = store.getAllDefects.value
        // const routes = store.getAllRoutes.value // Use if needed for total distance calculation

        // Dynamic Calculation Logic
        const totalDefects = defects.length
        const criticalDefects = defects.filter(d => d.severity === 'high').length
        // Mocking new defects for demo, in real app check timestamp
        const newDefects = defects.filter(d => d.status === '待审核').length

        // Mock distance calculation (sum of route lengths - assuming we had length in route)
        // For now, hardcode distance or sum mock values
        const totalDistance = 1240

        return {
            '24h': { distance: 45, defects: Math.floor(totalDefects * 0.1), newDefects: Math.floor(newDefects * 0.5), critical: Math.floor(criticalDefects * 0.2) },
            '7d': { distance: 380, defects: Math.floor(totalDefects * 0.5), newDefects: Math.floor(newDefects * 0.8), critical: Math.floor(criticalDefects * 0.6) },
            '30d': {
                distance: totalDistance,
                defects: totalDefects,
                newDefects: newDefects,
                critical: criticalDefects
            }
        }
    },

    getRoutes() {
        return store.getAllRoutes.value
    },

    getDefectsByRoute(routeId: string | number) {
        return store.getAllDefects.value.filter(d => d.routeId == routeId)
    },

    saveInspection(data: Partial<Defect>) {
        // Simulate Backend ID Generation
        const newId = Math.floor(Math.random() * 100000) + 1000

        const newDefect: Defect = {
            id: newId,
            routeId: data.routeId || 1, // Default to route 1 if not specified
            location: data.location || 'Unknown Location',
            coordinates: data.coordinates || '0, 0',
            type: data.type || 'Unknown Issue',
            confidence: data.confidence || 0,
            status: '待审核',
            image: data.image || '',
            timestamp: new Date().toLocaleString(),
            severity: data.severity || 'low',
            description: data.description || 'Newly reported inspection item.',
            ...data
        }

        // 1. Add to "Database" (Store)
        store.addDefect(newDefect)

        // 2. Update Parent "Table" (Route)
        store.incrementRouteDefectCount(newDefect.routeId!)

        return newDefect
    }
}
