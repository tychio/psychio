<template>
  <div v-show="status" :class="['stage', 'stage-' + status]">
    <div class="stage-pic" :style="{
      'background-image': 'url(./static/pictures/' + item.src + '.gif)'
    }"></div>
    <i class="icon icon-cross"></i>
  </div>
</template>

<script>
export default {
  name: 'PictureNaming',
  props: ['item'],
  data: function () {
    return {
      status: null
    }
  },
  watch: {
    status: function () {
    }
  },
  mounted: function () {
    const steps = [1000, 500, 4000]
    this.status = 'start'
    setTimeout(() => {
      this.status = 'ready'
    }, steps[0])
    setTimeout(() => {
      this.status = 'playing'
    }, steps[0] + steps[1])
    setTimeout(() => {
      this.status = 'end'
    }, steps[0] + steps[1] + steps[2])
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
}

.stage-pic {
  display: none;
  height: 100%;
  width: 100%;
  background-repeat: no-repeat;
  background-position: center center;
  background-size: contain;
}

.stage i.icon {
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -100px;
  width: 200px;
  height: 200px;
  line-height: 200px;
  font-style: normal;
  font-size: 100px;
}

.stage-start i.icon.icon-cross {
  display: block;
}

.stage-start i.icon.icon-cross:before {
  content: '+';
}

.stage-playing .stage-pic {
  display: block;
}

.stage-end {
  display: none;
}
</style>
