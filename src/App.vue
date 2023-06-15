<template>
  <div @click="btnHide()" class="container">
    <Header />
    <div class="d-content">
      <Navbar />
      <Page />
    </div>
  </div>
</template>

<script>
//import Button from './components/base/DButton.vue';
import Header from './components/layout/TheHeader.vue';
import Navbar from './components/layout/TheNavbar.vue';
import Page from './views/employees/PageEmployy.vue';

export default {
  name: 'App',
  components: {
    Header, Navbar, Page
  },
  methods: {
    btnHide(){
      
    }
  }
}
</script>
<style>
@import url(./css/main.css);
</style>
