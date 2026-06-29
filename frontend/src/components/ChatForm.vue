<script setup>
defineProps({
  subjects: { type: Array, required: true },
  loading: { type: Boolean, default: false },
  error: { type: String, default: '' },
});

const emit = defineEmits(['submit']);

const grades = ['高一', '高二', '高三'];

const form = defineModel('form', {
  type: Object,
  required: true,
});

function onSubmit() {
  emit('submit');
}
</script>

<template>
  <section class="card">
    <h2>提问</h2>
    <form @submit.prevent="onSubmit">
      <div class="field">
        <label for="subject">学科</label>
        <select id="subject" v-model="form.subject" required>
          <option v-if="!subjects.length" value="" disabled>加载中…</option>
          <option v-for="s in subjects" :key="s.code" :value="s.code">
            {{ s.name }}
          </option>
        </select>
      </div>
      <div class="field">
        <label for="grade">年级</label>
        <select id="grade" v-model="form.grade" required>
          <option v-for="g in grades" :key="g" :value="g">{{ g }}</option>
        </select>
      </div>
      <div class="field">
        <label for="question">学习问题</label>
        <textarea
          id="question"
          v-model="form.question"
          rows="4"
          placeholder="例如：二次函数怎么求最值？"
          required
        />
      </div>
      <button type="submit" :disabled="loading">
        {{ loading ? 'AI 正在思考…' : '提交问题' }}
      </button>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </section>
</template>
