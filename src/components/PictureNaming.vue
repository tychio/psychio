<template>
  <div class="stage" :style="{
    'background-image': 'url(./static/pictures/' + item.src + '.gif)'
  }"></div>
</template>

<script>
export default {
  name: 'PictureNaming',
  props: ['item'],
  mounted: function () {
    setTimeout(() => {
      this.$emit('end')
    }, 2000)
  }
}
</script>

<style scoped>
.stage {
  position: absolute;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}
</style>
