<script setup>
import { onMounted, reactive, ref } from 'vue';
import { fetchHistory, fetchSubjects, submitChat } from './api';
import AnswerPanel from './components/AnswerPanel.vue';
import ChatForm from './components/ChatForm.vue';
import HistoryList from './components/HistoryList.vue';

const FALLBACK_SUBJECTS = [
  { code: 'math', name: '数学', gradeRange: '高一-高三' },
  { code: 'english', name: '英语', gradeRange: '高一-高三' },
  { code: 'physics', name: '物理', gradeRange: '高一-高三' },
];

const subjects = ref([]);
const records = ref([]);
const historyStatus = ref('loading');
const chatResult = ref(null);
const submitting = ref(false);
const formError = ref('');

const form = reactive({
  subject: '',
  grade: '高一',
  question: '',
});

async function loadSubjects() {
  try {
    const data = await fetchSubjects();
    subjects.value = data.subjects;
    if (data.subjects.length && !form.subject) {
      form.subject = data.subjects[0].code;
    }
  } catch {
    subjects.value = FALLBACK_SUBJECTS;
    form.subject = 'math';
  }
}

async function loadHistory() {
  historyStatus.value = 'loading';
  try {
    const data = await fetchHistory(5);
    records.value = data.records;
    historyStatus.value = 'ready';
  } catch {
    records.value = [];
    historyStatus.value = 'error';
  }
}

async function handleSubmit() {
  formError.value = '';
  submitting.value = true;

  try {
    const result = await submitChat({
      subject: form.subject,
      grade: form.grade,
      question: form.question,
    });
    chatResult.value = result;
    await loadHistory();
  } catch (err) {
    formError.value = err.message || '提交失败，请稍后重试';
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  loadSubjects();
  loadHistory();
});
</script>

<template>
  <header class="header">
    <h1>高中学科知识 AI 助手</h1>
    <p class="subtitle">数学 · 英语 · 物理 · DeepSeek AI 答疑</p>
  </header>

  <main class="container">
    <ChatForm
      v-model:form="form"
      :subjects="subjects"
      :loading="submitting"
      :error="formError"
      @submit="handleSubmit"
    />
    <AnswerPanel :result="chatResult" />
    <HistoryList :records="records" :status="historyStatus" />
  </main>
</template>
