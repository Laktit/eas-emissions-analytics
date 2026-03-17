import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'real-time-monitor', pathMatch: 'full' },

  // Operations
  { path: 'real-time-monitor', loadComponent: () => import('./features/operations/real-time-monitor/real-time-monitor.component').then(m => m.RealTimeMonitorComponent) },
  { path: 'asset-inventory',   loadComponent: () => import('./features/operations/asset-inventory/asset-inventory.component').then(m => m.AssetInventoryComponent) },
  { path: 'iot-sensor-feed',   loadComponent: () => import('./features/operations/iot-feed/iot-feed.component').then(m => m.IotFeedComponent) },
  { path: 'hotspot-analysis',  loadComponent: () => import('./features/operations/hotspot/hotspot.component').then(m => m.HotspotComponent) },

  // Analytics
  { path: 'forecasting',       loadComponent: () => import('./features/analytics/forecasting/forecasting.component').then(m => m.ForecastingComponent) },
  { path: 'whatif',            loadComponent: () => import('./features/analytics/whatif/whatif.component').then(m => m.WhatifComponent) },
  { path: 'benchmarking',      loadComponent: () => import('./features/analytics/benchmarking/benchmarking.component').then(m => m.BenchmarkingComponent) },
  { path: 'sankey',            loadComponent: () => import('./features/analytics/sankey/sankey.component').then(m => m.SankeyComponent) },

  // Compliance
  { path: 'ogmp',              loadComponent: () => import('./features/compliance/ogmp/ogmp.component').then(m => m.OgmpComponent) },
  { path: 'sec-csrd',          loadComponent: () => import('./features/compliance/sec-csrd/sec-csrd.component').then(m => m.SecCsrdComponent) },
  { path: 'iso',               loadComponent: () => import('./features/compliance/iso/iso.component').then(m => m.IsoComponent) },
  { path: 'report-builder',    loadComponent: () => import('./features/compliance/report-builder/report-builder.component').then(m => m.ReportBuilderComponent) },

  // Platform
  { path: 'ai-assistant',      loadComponent: () => import('./features/platform/ai-assistant/ai-assistant.component').then(m => m.AiAssistantComponent) },
  { path: 'knowledge-hub',     loadComponent: () => import('./features/platform/knowledge-hub/knowledge-hub.component').then(m => m.KnowledgeHubComponent) },
  { path: 'integrations',      loadComponent: () => import('./features/platform/integrations/integrations.component').then(m => m.IntegrationsComponent) },
  { path: 'settings',          loadComponent: () => import('./features/platform/settings/settings.component').then(m => m.SettingsComponent) },

  // Monitoring overview pages (top nav)
  { path: 'monitoring',        loadComponent: () => import('./features/operations/real-time-monitor/real-time-monitor.component').then(m => m.RealTimeMonitorComponent) },
  { path: 'alerts',            loadComponent: () => import('./features/operations/hotspot/hotspot.component').then(m => m.HotspotComponent) },

  { path: '**', redirectTo: 'real-time-monitor' }
];
