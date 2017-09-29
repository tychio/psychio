<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Dashboard :design="designs"></Dashboard>
    <ul class="transparent">
      <li v-for="name in designs['picture-naming']">
        <img :src="'./static/picture-naming/' + name">
      </li>
      <li v-for="(kinds, lang) in designs['lexical-decision']">
        <template v-for="(items, kind) in kinds">
          <img v-for="name in items"
            :src="'./static/' + lang + '-' + kind + '/' + name">
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
        "011"
      ],
      "lexical-decision": {
        "chinese": {
          "words": [
            "001", "002", "003", "004", "005", "006", "007", "008", "009", "010",
            "011"
          ],
          "nonwords": [
            "001", "002", "003", "004", "005", "006", "007", "008", "009", "010",
            "011"
          ]
        },
        "uyghur": {  
          "words": [
            "001", "002", "003", "004", "005", "006", "007", "008", "009", "010",
            "011"
          ],
          "nonwords": [
            "001", "002", "003", "004", "005", "006", "007", "008", "009", "010",
            "011"
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
