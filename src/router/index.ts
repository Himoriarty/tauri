import { createRouter, createWebHistory } from 'vue-router'
// We will modify these imports as we create the views
import Dashboard from '../views/Dashboard.vue'
import MapView from '../views/MapView.vue'
import DamageComparison from '../views/DamageComparison.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'dashboard',
            component: Dashboard
        },
        {
            path: '/map-view',
            name: 'map-view',
            component: MapView
        },
        {
            path: '/damage-comparison/:id?',
            name: 'damage-comparison',
            component: DamageComparison,
            props: true
        },
        {
            path: '/report-management',
            name: 'report-management',
            component: () => import('../views/ReportManagement.vue')
        },
        {
            path: '/new-inspection',
            name: 'new-inspection',
            component: () => import('../views/NewInspection.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('../views/Settings.vue')
        }
    ]
})

export default router
