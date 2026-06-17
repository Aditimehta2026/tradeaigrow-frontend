import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/component/app.layout';
import { Dashboard } from './app/pages/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { Crud } from '@/pages/crud/crud';

export const appRoutes: Routes = [
    {path:"",component:Landing ,data:{title:"landingPage",desc:"this page all bout user landing page" }},
    {
        path: 'app',
        component: AppLayout,
        children: [
            { path: '', redirectTo:'dashboard', pathMatch:"full" },
            {path:'dashboard',component:Dashboard},
            {path:'crud',component:Crud},
            { path: 'page', loadChildren: () => import('./app/pages/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    // { path: 'landing', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') },
    { path: '**', redirectTo: '/notfound' }
];
