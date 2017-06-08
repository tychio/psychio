<template>
<div class="timeline">
  <Unit v-for="(item,index) in list" key="index"
    :item="item"
    :active="index === currentIndex"
  ></Unit>
  <button class="btn" @click="create()">Create</button>
</div>
</template>

<script>
import Unit from './unit'

export default {
  name: 'timeline',
  props: ['list', 'currentIndex'],
  methods: {
    create: function () {
      this.$emit('append', {
        type: 'img-audio',
        url: '',
        audio: '',
        period: 0
      })
    }
  },
  components: {
    Unit
  }
}
</script>
