import { ref, nextTick, onMounted, onUnmounted } from 'vue';

export function useEditMode() {
  const editMode = ref(false);
  const hasChanges = ref(false);
  const originalData = ref<any>(null);

  const focusFirstInput = async () => {
    await nextTick();
    
    const firstInput = document.querySelector('input:not([disabled]), select:not([disabled]), textarea:not([disabled])') as HTMLElement;
    
    if (firstInput) {
      firstInput.focus();
    }
  };

  const enableEditMode = (data: any) => {
    editMode.value = true;
    originalData.value = JSON.parse(JSON.stringify(data));
    hasChanges.value = false;
    
    focusFirstInput();
  };

  const disableEditMode = () => {
    editMode.value = false;
    hasChanges.value = false;
    originalData.value = null;
  };

  const cancelEdit = (restoreData: () => void) => {
    if (originalData.value) {
      restoreData();
    }
    disableEditMode();
  };

  const handleKeydown = (event: KeyboardEvent, cancelEditFn: () => void) => {
    if (event.key === 'Escape' && editMode.value && !hasChanges.value) {
      cancelEditFn();
    }
  };

  const keydownHandler = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && editMode.value && !hasChanges.value) {
      const cancelButton = document.querySelector('[data-cancel-edit]') as HTMLElement;
      if (cancelButton) {
        cancelButton.click();
      }
    }
  };

  onMounted(() => {
    document.addEventListener('keydown', keydownHandler);
  });

  onUnmounted(() => {
    document.removeEventListener('keydown', keydownHandler);
  });

  return {
    editMode,
    hasChanges,
    originalData,
    enableEditMode,
    disableEditMode,
    cancelEdit,
    focusFirstInput,
    handleKeydown
  };
}
