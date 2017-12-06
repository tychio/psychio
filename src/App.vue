<template>
  <div id="app">
    <h1 class="logo">
      <img src="./assets/logo.png">
      <span>sychio</span>
    </h1>
    <Dashboard :design="designs"></Dashboard>
    <ul class="transparent">
      <li v-for="name in designs['picture-naming']">
        <img :src="'./static/picture-naming/' + name + '.gif'">
      </li>
      <li v-for="(kinds, lang) in designs['lexical-decision']">
        <template v-for="(items, kind) in kinds">
          <img v-for="name in items"
            :src="'./static/lexical-decision/' + lang + '-' + kind + '/' + name + '.png'">
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
        "011", "012", "013", "014", "015", "016"
      ],
      "lexical-decision": {
        "chinese": {
          "words": [
            "001", "002", "003", "004", "005"
          ],
          "nonwords": [
            "001", "002", "003", "004", "005"
          ]
        },
        "uyghur": {  
          "words": [
            "001", "002", "003", "004", "005"
          ],
          "nonwords": [
            "001", "002", "003", "004", "005"
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

h1.logo img {
  width: 40px;
  height: 40px;
}

h1.logo span {
  position: relative;
  top: 11px;
  left: -11px;
  font-size: 37px;
  line-height: 30px;
}
</style>
