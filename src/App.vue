<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Dashboard></Dashboard>
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
        'act020bow',
        'act045conduct'
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
