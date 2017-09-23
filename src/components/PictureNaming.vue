<template>
    <img :src="item.url" :alt="item.name">
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
.md-card {
  max-width: 640px;
  margin: 20px auto;
}

.md-card .md-card-header .md-card-media {
  width: 320px;
  flex: 0 0 320px;
  height: auto;
}

.showcase {
  position: fixed;
  z-index: 9999;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.showcase img {
  width: 100%;
  height: 100%;
}
</style>
