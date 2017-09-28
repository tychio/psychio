<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Dashboard :design="designs"></Dashboard>
    <ul class="transparent">
      <li v-for="name in designs['picture-naming']">
        <img :src="'./static/pictures/' + name + '.gif'">
      </li>
      <li v-for="lang in designs['lexical-decision']">
        <template v-for="kind in lang">
          <img v-for="name in kind" :src="'./static/pictures/' + name + '.gif'">
        </template>
      </li>
    </ul>
  </div>
</template>

<script>
import Dashboard from './components/dashboard'

export default {
  name: 'app',
  data: function () {
    const json = `{
      "picture-naming": [
        "001", "002", "003", "004", "005", "006", "007", "008", "009", "010",
        "061"
      ],
      "lexical-decision": {
        "chinese": {
          "words": [
            "101", "102", "103", "104", "105", "106", "107", "108", "109", "110"
          ],
          "nonwords": [
            "131", "132", "133", "134", "135", "136", "137", "138", "139", "140"
          ]
        },
        "uyghur": {  
          "words": [
            "161", "162", "163", "164", "165", "166", "167", "168", "169", "170"
          ],
          "nonwords": [
            "191", "192", "193", "194", "195", "196", "197", "198", "199", "200"
          ]
        }
      }
    }`
    const designs = JSON.parse(json)
    return {
      designs: designs
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
