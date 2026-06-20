<script setup lang="ts">
import { ref } from 'vue';
import { clearProgressWithBackup, exportSave, importSaveFile, recoverBackup, saveSafetyStatus } from '../stores/gameState';

const importInput = ref<HTMLInputElement | null>(null);

function chooseImportFile() {
  importInput.value?.click();
}

async function handleImport(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) await importSaveFile(file);
  input.value = '';
}

function confirmClearProgress() {
  const ok = window.confirm('清空后会删除图鉴、萌灵、等级和装备。系统会先保存一份清空前备份。确定要清空吗？');
  if (ok) clearProgressWithBackup();
}
</script>

<template>
  <div class="save-tools" aria-label="存档管理">
    <span class="save-tools-title">存档管理</span>
    <button class="save-tool-button" type="button" @click="exportSave">导出</button>
    <button class="save-tool-button" type="button" @click="chooseImportFile">导入</button>
    <button class="save-tool-button" type="button" @click="recoverBackup('latest')" :disabled="!saveSafetyStatus.hasBackup && !saveSafetyStatus.hasPreResetBackup">恢复</button>
    <button class="save-tool-button danger" type="button" @click="confirmClearProgress">清空</button>
    <input ref="importInput" class="hidden-file-input" type="file" accept="application/json,.json" @change="handleImport" />
  </div>
</template>