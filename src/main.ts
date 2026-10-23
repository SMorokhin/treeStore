import { createApp } from 'vue'
import { ClientSideRowModelModule, ModuleRegistry } from 'ag-grid-community';
import { RowGroupingModule, RowNumbersModule, TreeDataModule } from 'ag-grid-enterprise';
import App from './App.vue'
import './styles/main.scss'

ModuleRegistry.registerModules([
    RowGroupingModule,
    TreeDataModule,
    RowNumbersModule,
    ClientSideRowModelModule,
]);

createApp(App).mount('#app')
