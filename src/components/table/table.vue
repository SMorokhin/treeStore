<template>
  <div class="tree-table-wrapper">
    <div class="tree-table-inserter">
      <div>
        <label for="newId">Id</label>
        <input name="newId" v-model="newId" />
      </div>

      <div>
        <label for="newParent">Parent</label>
        <input name="newParent" v-model="newParent" />
      </div>

      <div>
        <label for="newLabel">Label</label>
        <input name="newLabel" v-model="newLabel" />
      </div>


      <button @click="add">Добавить элемент</button>
    </div>

    <ag-grid-vue class="tree-table"
      treeData
      :columnDefs
      :rowData
      :gridOptions />

    <ui-spin v-if="loading"
      class="tree-table-loading"
      overlapping
      size="lg" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, shallowRef } from 'vue';
import { AgGridVue } from 'ag-grid-vue3';

import { UiSpin } from '~/ui';
import useFetch from '~/data/use_fetch';
import { RawTreeItem, TreeStore } from '~/data/tree_store';

defineOptions({
  name: 'tree-table',
});

let treeData: TreeStore | null = null;
const { loading, state, get } = useFetch<RawTreeItem>('api/mock', {});

const newId = ref(null);
const newParent = ref(null);
const newLabel = ref(null);

const rowData = shallowRef<RawTreeItem[] | null>(null);

onBeforeMount(() => {
  get()
    .then(() => {
      treeData = new TreeStore(state.value);
      rowData.value = treeData.getAll();
      return;
    });
});

const columnDefs = ref([
  { field: "label", headerName: 'Наименование' },
])

const gridOptions = ref({
  loading: false,
  rowNumbers: {},
  defaultColDef: {
    flex: 1,
  },
  rowData: rowData.value,
  treeData: true,
  autoGroupColumnDef: {
    headerName: 'Категория',
    cellRendererParams: {
      suppressCount: true,
    }
  },
  getDataPath: (data: RawTreeItem): string[] => {
    const parentPath = treeData?.getAllParents(String(data.id));
    const path = parentPath ? parentPath.map((el) => {
      const label = el.children?.length ? 'Группа' : 'Элемент';
      return `${label} (${el.id})`;
    }).reverse() : [];

    return path;
  },
})

function add() {
  if (newId.value && newLabel.value && treeData) {
    const isExist = treeData.getItem(String(newId.value));
    const method = isExist ? treeData.updateItem.bind(treeData) : treeData.addItem.bind(treeData);

    method({
      id: newId.value,
      parent: newParent.value,
      label: newLabel.value,
    });

    rowData.value = treeData.getAll();

    newId.value = null;
    newParent.value = null;
    newLabel.value = null;
  }
}
</script>

<style lang="scss">
.tree-table-wrapper {
  position: relative;
  height: 500px;
}

.tree-table {
  width: 100%;
  height: 100%;
}

.tree-table-inserter {
  display: flex;
  column-gap: 16px;
  padding-bottom: 16px;
}
</style>