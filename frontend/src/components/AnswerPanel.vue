<script setup>
defineProps({
  result: { type: Object, default: null },
});
</script>

<template>
  <section v-if="result" class="card">
    <h2>AI 解答</h2>
    <p class="meta">记录 #{{ result.id }} · 来源：{{ result.source }}</p>

    <div class="answer-block">
      <h3>摘要</h3>
      <p>{{ result.answer.summary }}</p>
    </div>

    <div class="answer-block">
      <h3>知识点</h3>
      <ul class="tag-list">
        <li v-for="kp in result.answer.knowledgePoints" :key="kp">{{ kp }}</li>
      </ul>
    </div>

    <div class="answer-block">
      <h3>解题步骤</h3>
      <ol>
        <li v-for="(step, i) in result.answer.steps" :key="i">{{ step }}</li>
      </ol>
    </div>

    <div class="answer-block">
      <h3>例题</h3>
      <div class="example-box">
        <p><strong>问：</strong>{{ result.answer.example.question }}</p>
        <p><strong>答：</strong>{{ result.answer.example.answer }}</p>
      </div>
    </div>

    <div class="answer-block reminder">
      <strong>提醒：</strong>{{ result.answer.reminder }}
    </div>

    <p v-if="result.answer.disclaimer" class="disclaimer">
      ⚠️ {{ result.answer.disclaimer }}
    </p>
  </section>
</template>
