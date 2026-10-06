<template>
  <v-app>
    <v-app-bar app dense color="primary" dark :elevation="0">
      <v-row align="center" no-gutters>
        <v-col cols="auto" class="d-flex align-center cursor-pointer" @click="$router.push('/')">
          <v-img src="@/assets/symbol-logo.svg" width="28" height="28" contain class="mr-2"></v-img>
          <span style="font-weight:700; font-size:16px; color:#ffffff; letter-spacing: -0.3px;">지니인사이트</span>
        </v-col>
        <v-spacer></v-spacer>
        <v-col v-if="$session.has('jwt')" cols="auto">
          <v-btn @click="logout" small outlined color="white" :elevation="0">{{ $t('app.logout') }}</v-btn>
        </v-col>
      </v-row>
    </v-app-bar>
    <v-main>
      <router-view :key="$router.fullPath"></router-view>
      <v-overlay :absolute="false" :z-index="500" :opacity="0.2" :value="$store.getters.load">
        <v-progress-circular
          color="primary"
          indeterminate
          size="64"
          width="6">
        </v-progress-circular>
      </v-overlay>
    </v-main>
  </v-app>
</template>

<script>
import axios from 'axios'
axios.defaults.headers.get['Pragma'] = 'no-cache';
axios.defaults.headers.get['Cache-Control'] = 'no-cache, no-store';

export default {
  name: 'App',
  data: () => ({
    interval: null,
    click_event: new Date().getTime(),
  }),
  created: async function() {
    window.addEventListener('click', function() {
      this.click_event = new Date().getTime();
    }.bind(this));

    this.interval = setInterval(async () => {
      if (this.$session.has('jwt')) {
        if (new Date().getTime() > this.click_event + 3600000) { // 60분간 클릭 이벤트 미발생 시 자동 로그아웃
          this.$session.destroy();
          this.$router.replace({ name: "Login" });
          alert(this.$t('app.autoLogout'));
          return;
        }
        let res = await axios({
          method: 'get',
          url: this.$lookupUrl + '/server/common/reissuance_token.php',
          headers: {
            jwt: this.$session.get('jwt')
          }
        }).catch(err => {
          alert(err.message);
          this.$session.destroy();
          this.$router.replace({ name: "Login" });
          return;
        });
        if (res && res.status == 200) {
          if (res.data.ret == '0000') {
            this.$session.set('jwt', res.data.jwt);
          } else {
            this.$session.destroy();
            this.$router.replace({ name: "Login" });
            alert(this.$t('app.autoLogout'));
            return;
          }
        } else {
          this.$session.destroy();
          this.$router.replace({ name: "Login" });
        }
      }
    }, 1000 * 60 * 20); // 20분마다 토큰 갱신
  },
  beforeDestroy: function() {
    window.removeEventListener('click', function() {
      this.click_event = null;
    });
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  methods: {
    logout: function() {
      let con = confirm(this.$t('app.logoutConfirm'));
      if (!con) return;
      this.$session.destroy();
      this.$router.replace({ name: "Login" });
    }
  },
};
</script>

<style lang="scss">
@media (pointer: coarse) {
  #app {
    height: calc(var(--vh, 1vh) * 100);
    overflow: scroll;
    .v-application--wrap {
      min-height: calc(var(--vh, 1vh) * 100) !important;
    }
  }
}
</style>