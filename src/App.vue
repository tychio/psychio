<template>
  <div id="app">
    <h1 class="logo">
      <img src="./assets/logo.png">
      <span>sychio</span>
    </h1>
    <Dashboard :design="designs" :demo="demo"></Dashboard>
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
      <li v-for="item in designs['iq-tester']">
        <img :src="'./static/iq-tester/' + item.Q + '.jpg'">
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
        "015", "016", "027", "040", "044", "105", "109", "128", "155", "215", "222"
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
      },
      "iq-tester": [
        { "Q": "A2", "A": 5 },
        { "Q": "A3", "A": 1 },
        { "Q": "A4", "A": 2 },
        { "Q": "A5", "A": 6 }
      ],
      "flanker": [
        { "count": 21, "type": "con", "direction": "right" },
        { "count": 21, "type": "con", "direction": "left" },
        { "count": 21, "type": "incon", "direction": "right" },
        { "count": 21, "type": "incon", "direction": "left" },
        { "count": 21, "type": "neu", "direction": "right" },
        { "count": 21, "type": "neu", "direction": "left" }
      ],
      "simon": [
        { "count": 21, "type": "red", "direction": "right" },
        { "count": 21, "type": "red", "direction": "left" },
        { "count": 21, "type": "red", "direction": "center" },
        { "count": 21, "type": "blue", "direction": "right" },
        { "count": 21, "type": "blue", "direction": "left" },
        { "count": 21, "type": "blue", "direction": "center" }
      ]
    }`
    const demo = `{
      "picture-naming": [ "001", "002", "003" ],
      "lexical-decision": {
        "chinese": {
          "words": [ "001", "002" ],
          "nonwords": [ "001", "002" ]
        },
        "uyghur": {  
          "words": [ "001", "002" ],
          "nonwords": [ "001", "002" ]
        }
      },
      "iq-tester": [
        { "Q": "A2", "A": 5 },
        { "Q": "A3", "A": 1 },
        { "Q": "A4", "A": 2 }
      ],
      "flanker": [
        { "count": 4, "type": "con", "direction": "right" },
        { "count": 4, "type": "con", "direction": "left" },
        { "count": 4, "type": "incon", "direction": "right" },
        { "count": 4, "type": "incon", "direction": "left" },
        { "count": 4, "type": "neu", "direction": "right" },
        { "count": 4, "type": "neu", "direction": "left" }
      ],
      "simon": [
        { "count": 4, "type": "red", "direction": "right" },
        { "count": 4, "type": "red", "direction": "left" },
        { "count": 4, "type": "red", "direction": "center" },
        { "count": 4, "type": "blue", "direction": "right" },
        { "count": 4, "type": "blue", "direction": "left" },
        { "count": 4, "type": "blue", "direction": "center" }
      ]
    }`
    return {
      designs: JSON.parse(json),
      demo: JSON.parse(demo)
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
