<template>
  <v-container fluid style="height:100%; background:linear-gradient(rgb(255, 255, 255), rgb(245, 249, 250));">
    <v-row align="center" justify="center" style="height:100%;">
      <v-col cols="12" sm="8" md="6" lg="4" xl="3">
        <v-card class="px-6 py-8" outlined style="border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05) !important;">
          <v-form ref="form" @submit.prevent="login">
            <v-row align="center" justify="center" class="my-4">
              <v-col cols="auto" class="text-center">
                <v-img src="@/assets/geni-in-logo.svg" width="170" contain class="mx-auto mb-2"></v-img>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col class="text-center pt-0 pb-1">
                <h2 style="color:var(--color-text-primary); font-size:20px; font-weight:700;">
                  {{ $t('login.title') }}
                </h2>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-col class="text-center pt-0 pb-4">
                <p style="color:var(--color-text-tertiary); font-size:14px; margin-bottom:0;">
                  {{ $t('login.subtitle') }}
                </p>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col class="py-2">
                <v-text-field
                  v-model="patient_id"
                  :autofocus="true"
                  dense
                  outlined
                  :placeholder="$t('login.barcodePlaceholder')"
                  :rules="[required]"
                  prepend-inner-icon="mdi-barcode"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center">
              <v-col class="py-2">
                <v-text-field
                  v-model="patient_name"
                  @keydown.enter="login"
                  dense
                  outlined
                  :placeholder="$t('login.namePlaceholder')"
                  :rules="[required]"
                  prepend-inner-icon="mdi-account-outline"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center" class="mt-2">
              <v-col class="pt-2">
                <v-btn
                  @click="login"
                  dark
                  block
                  color="primary"
                  large
                  :elevation="0"
                  style="font-size:15px; font-weight:600;"
                >
                  {{ $t('login.loginBtn') }}
                </v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import http from '@/mixin/http'
import validation from '@/mixin/validation'

export default {
  name: 'login-vue',
  mixins: [validation, http],
  data: () => ({
    patient_id: null,
    patient_name: null,
  }),
  created: function() {
    if (this.$session.exists()) {
      this.$session.destroy();
    }
  },
  methods: {
    login: async function() {
      const valid = this.$refs.form.validate();
      if (!valid) return;

      let data = {
        patient_id: this.patient_id,
        patient_name: this.patient_name
      };
      let res = await this.post(this.$lookupUrl + '/server/login.php', data);
      if (res) {
        if (res.data.ret == '0000') {
          // 로그인 성공
          this.$session.set('jwt', res.data.jwt);
          const query = {
            patient_id: encodeURI(this.patient_id),
            patient_name: encodeURI(this.patient_name),
          };
          this.$router.replace({ name: "Progress", query });
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
