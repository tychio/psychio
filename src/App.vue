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
            "001", "002", "003", "004", "005", "006", "007", "008", "009", "010",
            "011", "012", "013", "014", "015", "016", "017", "018", "019", "020",
            "021", "022", "023", "024", "025", "026", "027", "028", "029", "030",
            "031", "032", "033", "034", "035", "036", "037", "038", "039", "040",
            "041", "042", "043", "044", "045", "046", "047", "048"
          ],
          "nonwords": [
            "005-7", "006-5", "012-6", "030-5", "020-7", "021-7", "019-6", "018-6",
            "045-5", "093-5", "089-5", "085-7", "074-7", "083-7", "104-5", "106-5",
            "077-6", "120-5", "160-5", "139-6", "123-6", "151-6", "159-6", "157-6",
            "172-6", "162-6", "181-5", "164-7", "173-7", "189-5", "142-7", "212-5",
            "204-5", "217-6", "220-6", "236-6", "209-7", "225-7", "243-5", "234-7",
            "228-6", "240-7", "263-7", "281-7", "313-5", "324-7", "577-6", "521-6"
          ]
        },
        "uyghur": {  
          "words": [
            "001", "002", "003", "004", "007", "008", "009", "010",
            "011", "012", "013", "014", "015", "016", "017", "018", "019", "020",
            "021", "022", "023", "024", "025", "026", "027", "028", "029", "030",
            "031", "032", "033", "034", "035", "036", "037", "038", "039", "040",
            "041", "042", "043", "044", "045", "046", "047", "048", "049", "050"
          ],
          "nonwords": [
            "001", "002", "003", "004", "005", "006", "007", "008", "009", "010",
            "011", "012", "013", "014", "015", "016", "017", "018", "019", "020",
            "021", "022", "023", "024", "025", "026", "027", "028", "029", "030",
            "031", "032", "033", "034", "035", "036", "038", "039", "040",
            "041", "042", "043", "044", "045", "052", "053", "054", "055"
          ]
        }
      },
      "iq-tester": [
        { "Q": "A01", "A": 4 }, { "Q": "A02", "A": 5 }, { "Q": "A03", "A": 1 }, { "Q": "A04", "A": 2 }, { "Q": "A05", "A": 6 }, { "Q": "A06", "A": 3 }, { "Q": "A07", "A": 6 }, { "Q": "A08", "A": 2 }, { "Q": "A09", "A": 1 }, { "Q": "A10", "A": 3 }, { "Q": "A11", "A": 5 }, { "Q": "A12", "A": 4 },
        { "Q": "B01", "A": 2 }, { "Q": "B02", "A": 6 }, { "Q": "B03", "A": 1 }, { "Q": "B04", "A": 2 }, { "Q": "B05", "A": 1 }, { "Q": "B06", "A": 3 }, { "Q": "B07", "A": 5 }, { "Q": "B08", "A": 6 }, { "Q": "B09", "A": 4 }, { "Q": "B10", "A": 3 }, { "Q": "B11", "A": 4 }, { "Q": "B12", "A": 5 },
        { "Q": "C01", "A": 8 }, { "Q": "C02", "A": 2 }, { "Q": "C03", "A": 3 }, { "Q": "C04", "A": 8 }, { "Q": "C05", "A": 7 }, { "Q": "C06", "A": 4 }, { "Q": "C07", "A": 5 }, { "Q": "C08", "A": 1 }, { "Q": "C09", "A": 7 }, { "Q": "C10", "A": 6 }, { "Q": "C11", "A": 1 }, { "Q": "C12", "A": 2 },
        { "Q": "D01", "A": 3 }, { "Q": "D02", "A": 4 }, { "Q": "D03", "A": 3 }, { "Q": "D04", "A": 7 }, { "Q": "D05", "A": 8 }, { "Q": "D06", "A": 6 }, { "Q": "D07", "A": 5 }, { "Q": "D08", "A": 4 }, { "Q": "D09", "A": 1 }, { "Q": "D10", "A": 2 }, { "Q": "D11", "A": 5 }, { "Q": "D12", "A": 6 },
        { "Q": "E01", "A": 7 }, { "Q": "E02", "A": 6 }, { "Q": "E03", "A": 8 }, { "Q": "E04", "A": 2 }, { "Q": "E05", "A": 1 }, { "Q": "E06", "A": 5 }, { "Q": "E07", "A": 2 }, { "Q": "E08", "A": 4 }, { "Q": "E09", "A": 1 }, { "Q": "E10", "A": 6 }, { "Q": "E11", "A": 3 }, { "Q": "E12", "A": 5 }
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
      "picture-naming": [ "001", "002", "003", "004" ],
      "lexical-decision": {
        "chinese": {
          "words": [ "049", "050", "051", "052" ],
          "nonwords": [ "527-6", "552-7", "558-5", "597-5" ]
        },
        "uyghur": {  
          "words": [ "051", "052", "053", "054" ],
          "nonwords": [ "046", "047", "048", "049" ]
        }
      },
      "iq-tester": [
        { "Q": "A01", "A": 3 },
        { "Q": "A02", "A": 4 },
        { "Q": "A03", "A": 5 },
        { "Q": "A04", "A": 1 }
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
