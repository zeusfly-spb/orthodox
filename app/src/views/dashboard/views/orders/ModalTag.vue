<script setup></script>
<template>
  <div class="modal" id="tagsModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Добавить тег</h3>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
          ut labore et dolore magna aliqua.
        </p>
        <div class="modal-tags-container">
          <div class="tag-input-row">
            <input type="text" class="modal-tag-input" placeholder="Имя тега" />
            <button class="btn btn-primary add-tag-btn-modal">Добавить</button>
          </div>
          <div class="modal-tags-list">
            <div class="modal-tag-item">
              <span>Тет 1</span>
              <svg
                class="tag-close"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                />
              </svg>
            </div>
            <div class="modal-tag-item">
              <span>Тет 1</span>
              <svg
                class="tag-close"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                />
              </svg>
            </div>
            <div class="modal-tag-item">
              <span>Тет 1</span>
              <svg
                class="tag-close"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                />
              </svg>
            </div>
            <div class="modal-tag-item">
              <span>Тет 1</span>
              <svg
                class="tag-close"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(241, 241, 244, 1);
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(106, 110, 117, 1);
  white-space: nowrap;
  line-height: 1.5;
}
.tag-close {
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s;
}
.tag-close:hover {
  opacity: 1;
}
.tag-item:not(.active) .tag-close {
  display: none;
}
.add-tag-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(241, 241, 244, 1);
  border: none;
  color: rgba(106, 110, 117, 1);
  font-size: 12px;
  -webkit-border-radius: 44px;
  -moz-border-radius: 44px;
  border-radius: 44px;
  cursor: pointer;
  border: 1px dashed rgba(159, 166, 175, 1);
  padding: 6px 12px;
}
.add-tag-btn:hover {
  color: #3e8e41;
}
.add-tag-btn svg {
  flex-shrink: 0;
  fill: rgba(106, 110, 117, 1);
}
.modal-body {
  padding: 0 24px 24px 24px;
}
.modal-body p {
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
  margin-bottom: 20px;
}
.tag-input-row {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
.modal-tag-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 14px;
}
.modal-tag-input:focus {
  outline: 0;
  border-color: #94a3b8;
  box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
}
.add-tag-btn-modal {
  white-space: nowrap;
  padding: 0 16px;
}
.modal-tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.modal-tag-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: rgba(241, 241, 244, 1);
  padding: 6px 12px;
  border-radius: 16px;
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(106, 110, 117, 1);
}
.modal-tag-item svg {
  cursor: pointer;
  opacity: 0.7;
  fill: #000;
  transition: opacity 0.2s;
}
.modal-tag-item svg:hover {
  opacity: 1;
}
.tag-item svg {
  fill: rgba(106, 110, 117, 1);
}
.tag-item4 {
  display: flex;
  align-items: center;
  gap: 4px;
  background: 0 0;
  padding: 6px 12px;
  border-radius: 16px;
  border: 1px solid rgba(212, 214, 217, 1);
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  color: rgba(106, 110, 117, 1);
  white-space: nowrap;
}
.tag {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
  border-radius: 44px;
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 500;
}
.modal {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2000;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 510px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
.modal-header {
  padding: 10px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h3 {
  font-weight: 600;
  font-style: Semi Bold;
  font-size: 20px;
  line-height: 100%;
  color: rgba(53, 53, 53, 1);
  margin: 0;
}
.close-modal {
  background: 0 0;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #64748b;
  padding: 0;
  line-height: 1;
}
</style>
