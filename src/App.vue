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
        "011", "012", "013", "014", "015", "016", "017", "018", "019", "020",
        "021", "022", "023", "024", "025", "026", "027", "028", "029", "030",
        "031", "032", "033", "034", "035", "036", "037", "038", "039", "040",
        "041", "042", "043", "044", "045", "046", "047", "048", "049", "050",
        "051", "052", "053", "054", "055", "056", "057", "058", "059", "060",
        "061"
      ],
      "lexical-decision": {
        "chinese": {
          "words": [
            "101", "102", "103", "104", "105", "106", "107", "108", "109", "110",
            "111", "112", "113", "114", "115", "116", "117", "118", "119", "120",
            "121", "122", "123", "124", "125", "126", "127", "128", "129", "130"
          ],
          "nonwords": [
            "131", "132", "133", "134", "135", "136", "137", "138", "139", "140",
            "141", "142", "143", "144", "145", "146", "147", "148", "149", "150",
            "151", "152", "153", "154", "155", "156", "157", "158", "159", "160"
          ]
        },
        "uyghur": {  
          "words": [
            "161", "162", "163", "164", "165", "166", "167", "168", "169", "170",
            "171", "172", "173", "174", "175", "176", "177", "178", "179", "180",
            "181", "182", "183", "184", "185", "186", "187", "188", "189", "190"
          ],
          "nonwords": [
            "191", "192", "193", "194", "195", "196", "197", "198", "199", "200",
            "201", "202", "203", "204", "205", "206", "207", "208", "209", "210",
            "211", "212", "213", "214", "215", "216", "217", "218", "219", "220"
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
