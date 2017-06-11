<template>
<div class="timeline">
  <Unit v-for="(item,index) in list" key="index"
    :item="item"
    :active="index === currentIndex"
    @remove="$emit('remove', index)"
  ></Unit>
  <md-button class="md-raised md-primary" @click.native="create()">Add</md-button>
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
        name: '',
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
