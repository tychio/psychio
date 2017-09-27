<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Dashboard :items="pictures"></Dashboard>
    <ul class="transparent">
      <li v-for="pic in pictures">
        <img :src="'./static/pictures/' + pic + '.gif'">
      </li>
    </ul>
  </div>
</template>

<script>
import Dashboard from './components/dashboard'

export default {
  name: 'app',
  data: function () {
    return {
      pictures: [
        'act015beg',
        'act019bounce',
        'act020bow',
        'act022box',
        'act024brush',
        'act025buckle',
        'act028pay',
        'act030camp',
        'act031carry',
        'act032carve',
        'act033catch',
        'act035chase',
        'act036cheer',
        'act037chew',
        'act038clap',
        'act041slam',
        'act043comb',
        'act045conduct',
        'act047cough',
        'act050crawl'
      ]
    }
  },
  components: {
    Dashboard
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.transparent {
  position: absolute;
  top: -99999px;
  left: -99999px;
  opacity: 0;
}
</style>
