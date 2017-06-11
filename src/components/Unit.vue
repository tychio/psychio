<template>
<div v-if="item.type === 'img-audio'">
  <div class="showcase" v-if="active">
    <img :src="item.url" alt="Please upload image">
  </div>
  <md-card>
    <md-card-header>
      <md-card-header-text>
        <div class="md-title" v-text="item.name"></div>
        <div class="md-subtitle">({{item.period/1000}} s)</div>
        <Recorder 
          :active="active" 
          :item="item"
        ></Recorder>
      </md-card-header-text>
      

      <md-card-media md-big>
        <img :src="item.url" :alt="item.name">
      </md-card-media>
    </md-card-header>

    <md-card-expand>
      <md-card-actions>
        <md-button class="md-warn" @click.native="remove">Remove</md-button>
        <md-button class="md-icon-button" md-expand-trigger>
          <md-icon>keyboard_arrow_down</md-icon>
        </md-button>
      </md-card-actions>
      <md-card-content>
          <md-input-container>
            <label>Name</label>
            <md-input type="text" v-model="item.name"></md-input>
          </md-input-container>

          <md-input-container>
            <label>Upload Photo</label>
            <md-file @change.native="uploaded" accept="image/*"></md-file>
          </md-input-container>

          <md-input-container>
            <label>Duration (millisecond)</label>
            <md-input type="number" v-model="item.period"></md-input>
          </md-input-container>
      </md-card-content>
    </md-card-expand>
  </md-card>
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
    },
    remove: function () {
      this.$emit('remove')
    }
  },
  components: {
    Recorder
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
