import { reactive, computed } from 'vue'
import type { Defect, Route, Alert } from '../types'

// Default Initial Data (Mock)
// Default Initial Data (Mock)
// Note: Stats are now calculated dynamically by MockApi, removed from store state

const defaultDefects: Defect[] = [
    {
        id: 101,
        routeId: 1, // Added Foreign Key
        location: '66号公路, 45公里处',
        coordinates: '34.0522, -118.2437',
        type: '纵向裂缝',
        confidence: 98,
        status: '待审核',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBwAsvV0AYdiSHo_AEYHFQWYfp9ZGau6SrzS9gfCHKxy32fh2ZlPSlPy_7YyR6jAhf3eR8OkvoeAqeEkYj5U240MdV25dwPCCKMnFDMsKQfZ5Rz2H-4pm2zmBE-tcnnJjG3IpOLxy-cwXPgD5QPtg7147k8YQDwK_-57-RLTLFe3oAlsky_qGiPe-Yd3EAMfSsY5EOC0oRzY0paO1ZCkAHnoHR9vaTGfPz0u5kFPZpe8swxCOzrmrSQwUgY6GLaiK03pgdnHdw4zBGa',
        timestamp: '2023-11-20 14:00',
        severity: 'medium',
        description: '检测到路面纵向裂缝，可能是基层沉降导致。建议持续监测。',
        area: '15.2 cm²',
        width: '4.8 mm',
        material: '沥青混凝土',
        growthRate: '+12.5%',
        historyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQu3nHjquq8ZGt1b2Pc8kGswccIuV267Wi4Te1hRODJgXN7Ie3v7yCl11PCbe6EJwPjNeEukUwxLYixbb4QlKia7q7X-gn2YO8PhDLfHKY_CT7K4KD7kGx4DTUDrO-2RGxRCRNpsRzd_RpDW634d1qo47w_ttW6JpnGwMNp86ssrHw0VOwIbaio8cpo-dB9XsoB4qjU-aefA03nx1lEM8QiMpv0UTB_oYtc9WoU5iI9lYTbLsNxDtfYMKOefWthwz7kqMtder_SAWX',
        historyDate: '2023年11月12日',
        aiAnalysis: {
            confidence: 98,
            model: 'v3.4.2',
            risk: '中度风险',
            recommendation: '建议在3个月内进行填补修复。'
        }
    },
    {
        id: 102,
        routeId: 1,
        location: '桥梁 B-105',
        coordinates: '40.7128, -74.0060',
        type: '混凝土剥落',
        confidence: 92,
        status: '已派单',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzETvV2fQy6dbW6xd1XEq2xrGA5HZiNivYQcUjqBUkFKe6BcdjTBUFQFySGmgEJPpCFsr_Exx27W56tKNjZDu1qYSadfwNwhufILDaqaUkOiNm1ogTiZoC5c2m38dr1YO7gNEGNbylwldkGEMc_JpHebdpgfXE0zDtrERFRzb1Bi9D_nXehOCVZLXDmvTHmhl_sUPpcJFrvEgD43irMwDONGZcsXe12hCqh-qi_n0r5K65ZLEI-ynC9MfaOsJyYaa6I3J5WTqN6LR5',
        timestamp: '2023-11-19 09:30',
        severity: 'high',
        description: 'AI检测到混凝土剥落，有钢筋外露风险。需要立即进行结构完整性评估。',
        area: '28.5 cm²',
        width: 'N/A',
        material: '钢筋混凝土',
        growthRate: '+21.6%',
        historyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQu3nHjquq8ZGt1b2Pc8kGswccIuV267Wi4Te1hRODJgXN7Ie3v7yCl11PCbe6EJwPjNeEukUwxLYixbb4QlKia7q7X-gn2YO8PhDLfHKY_CT7K4KD7kGx4DTUDrO-2RGxRCRNpsRzd_RpDW634d1qo47w_ttW6JpnGwMNp86ssrHw0VOwIbaio8cpo-dB9XsoB4qjU-aefA03nx1lEM8QiMpv0UTB_oYtc9WoU5iI9lYTbLsNxDtfYMKOefWthwz7kqMtder_SAWX',
        historyDate: '2023年08月15日',
        aiAnalysis: {
            confidence: 92,
            model: 'v3.4.2',
            risk: '快速恶化',
            recommendation: '增长率超过15%阈值。建议加入优先维护队列。'
        }
    },
    {
        id: 4492,
        routeId: 1,
        location: '4号桥（南向）',
        coordinates: '34.0522, -118.2437',
        type: 'B柱剥落',
        confidence: 98,
        status: '待审核',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZqkeHG4m3ar61cPocGHxykUbTSOMQeLx9Ze758Z_ZECtnxkOvYlR9GjqAsyek6tlBJtDnrLD11em8b65rJFaIYi0G6H9KIRVMYd1rY29theSGsbyDcuOhoMOWaRdrZdrvlnQ8dP1wJh9q26cd51_tXFlbbhHp1UVNEUkkMltAEDXUSXFJhw6PlNdQIZHHgNeodHq_mnRgCXX4rH6RsoW0xy2f1oyjzxJUdWKBM-RlmLtnaV1zA1HtBOjhlrDtzaua-zACqqXeSgFk',
        timestamp: '2023-11-20 14:00',
        severity: 'high',
        description: 'AI检测到混凝土剥落，有钢筋外露风险。需要立即进行结构完整性评估。',
        area: '15.2 cm²',
        width: '4.8 mm',
        material: '混凝土',
        growthRate: '+21.6%',
        historyImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCQu3nHjquq8ZGt1b2Pc8kGswccIuV267Wi4Te1hRODJgXN7Ie3v7yCl11PCbe6EJwPjNeEukUwxLYixbb4QlKia7q7X-gn2YO8PhDLfHKY_CT7K4KD7kGx4DTUDrO-2RGxRCRNpsRzd_RpDW634d1qo47w_ttW6JpnGwMNp86ssrHw0VOwIbaio8cpo-dB9XsoB4qjU-aefA03nx1lEM8QiMpv0UTB_oYtc9WoU5iI9lYTbLsNxDtfYMKOefWthwz7kqMtder_SAWX',
        historyDate: '2023年11月12日',
        aiAnalysis: {
            confidence: 98.2,
            model: 'v3.4.2',
            risk: '快速恶化',
            recommendation: '增长率超过15%阈值。建议加入优先维护队列。'
        }
    }
]

const defaultRoutes: Route[] = [
    { id: 1, name: '布鲁克林大桥', defectCount: 12, riskLevel: 'high', status: '12 处严重病害' },
    { id: 2, name: 'I-95 高速第4标段', defectCount: 3, riskLevel: 'medium', status: '3 处中度病害' },
    { id: 3, name: '皇后区中城隧道', defectCount: 0, riskLevel: 'good', status: '状态良好' }
]

const defaultAlerts: Alert[] = [
    { id: 1, time: '12分钟前', title: '桥梁 B-402: 露筋严重', desc: '结构完整性警告。AI置信度 99%。第4段，2号柱', type: '露筋', severity: 'high' },
    { id: 2, time: '45分钟前', title: '66号公路: 重大坑洼', desc: '高速交通隐患。深度预估 > 10cm。', type: '坑洼', severity: 'high' }
]

// Note: Removed 'stats' from StoreData, it is now calculated view-side or by service
const state = reactive<{
    defects: Defect[]
    routes: Route[]
    alerts: Alert[]
    stats?: any // Keep optional for backward compat if data comes from file with stats
}>({
    defects: defaultDefects,
    routes: defaultRoutes,
    alerts: defaultAlerts
})

// Actions / Mutations
const loadData = (data: any) => {
    if (data.defects) state.defects = data.defects
    if (data.routes) state.routes = data.routes
    if (data.alerts) state.alerts = data.alerts
    // Ignore stats import, we calculate it
}

const resetData = () => {
    state.defects = defaultDefects
    state.routes = defaultRoutes
    state.alerts = defaultAlerts
}

const addDefect = (defect: Defect) => {
    state.defects.unshift(defect)
}

const incrementRouteDefectCount = (routeId: string | number) => {
    const route = state.routes.find(r => r.id == routeId)
    if (route) {
        route.defectCount++
        route.status = `${route.defectCount} 处病害` // Simple update logic
    }
}

// Getters (Computed)
const getAllDefects = computed(() => state.defects)
const getAllRoutes = computed(() => state.routes)
const getHighSeverityAlerts = computed(() => state.alerts.filter(a => a.severity === 'high'))
const getDefectById = (id: string | number) => computed(() => state.defects.find(d => d.id == id))

export default {
    state,
    loadData,
    resetData,
    addDefect,
    incrementRouteDefectCount,
    getAllDefects,
    getAllRoutes,
    getHighSeverityAlerts,
    getDefectById
}
