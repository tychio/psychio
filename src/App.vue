<template>
  <div id="app">
    <img src="./assets/logo.png">
    <Dashboard :design="designs"></Dashboard>
    <ul class="transparent">
      <li v-for="design in designs">
        <img v-for="name in design" :src="'./static/pictures/' + name + '.gif'">
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
      designs: {
        'picture-naming': [
          '001', '002', '003', '004', '005', '006', '007', '008', '009', '010',
          '011', '012', '013', '014', '015', '016', '017', '018', '019', '020',
          '021', '022', '023', '024', '025', '026', '027', '028', '029', '030',
          '031', '032', '033', '034', '035', '036', '037', '038', '039', '040',
          '041', '042', '043', '044', '045', '046', '047', '048', '049', '050',
          '051', '052', '053', '054', '055', '056', '057', '058', '059', '060',
          '061'
        ],
        'lexical-decision': [
          '101', '102', '103', '104', '105', '106', '107', '108', '109', '110',
          '111', '112', '113', '114', '115', '116', '117', '118', '119', '120',
          '121', '122', '123', '124', '125', '126', '127', '128', '129', '130',
          '131', '132', '133', '134', '135', '136', '137', '138', '139', '140',
          '141', '142', '143', '144', '145', '146', '147', '148', '149', '150',
          '151', '152', '153', '154', '155', '156', '157', '158', '159', '160',
          '161'
        ]
      }
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
