<template>
<div class="timeline-block">
  <div v-if="item.type === 'img-audio'">
    <img :src="item.url" height="100">
    <input type="file" accept="image/*" @change="uploaded">
    <div class="showcase" v-if="active">
      <img :src="item.url" alt="Please upload image">
    </div>
    <Recorder 
      :active="active" 
      :item="item"
    ></Recorder>
  </div>
  <div>
    <input type="number" v-model="item.period">
  </div>
</div>
</template>

<script>
import Recorder from './recorder'

export default {
  name: 'Unit',
  props: ['item', 'active'],
  methods: {
    uploaded: function (file) {
      const reader = new FileReader()

      reader.onload = ent => {
        this.item.url = ent.target.result
      }
      reader.readAsDataURL(file.target.files[0])
    }
  },
  components: {
    Recorder
  }
}
</script>

<style>
.showcase {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.showcase img {
  width: 100%;
  height: 100%;
}

.timeline-block {
  display: block;
  box-sizing: border-box;
  border: 1px solid #333;
}

.timeline-block img {
  display: block;
  margin: 0 auto;
}
</style>
