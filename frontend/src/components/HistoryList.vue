<script setup>
const SUBJECT_LABELS = { math: '数学', english: '英语', physics: '物理' };

defineProps({
  records: { type: Array, required: true },
  status: { type: String, default: 'loading' },
});

function formatTime(iso) {
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch {
    return iso;
  }
}

function subjectLabel(code) {
  return SUBJECT_LABELS[code] || code;
}
</script>

<template>
  <section class="card">
    <h2>最近问答历史</h2>
    <p class="hint">数据来自后端 MySQL，不使用 LocalStorage</p>
    <ul class="history-list">
      <li v-if="status === 'loading'" class="empty">加载中…</li>
      <li v-else-if="status === 'error'" class="empty">历史记录加载失败</li>
      <li v-else-if="!records.length" class="empty">暂无历史记录，提交第一个问题吧</li>
      <li v-for="r in records" v-else :key="r.id" class="history-item">
        <p class="question">{{ r.question }}</p>
        <p class="info">
          {{ subjectLabel(r.subject) }} · {{ r.grade }} · {{ r.source }}
          · {{ formatTime(r.createdAt) }}
        </p>
      </li>
    </ul>
  </section>
</template>
