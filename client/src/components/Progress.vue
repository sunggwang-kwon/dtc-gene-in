<template>
  <v-container v-if="!is_open && !is_error" fill-height>
    <div style="width:50px; height:50px; position:absolute; top:50%; left:50%; transform: translate(-50%, -50%);">
      <div class="spinner" />
    </div>
  </v-container>
  <v-container v-else-if="is_error" fill-height>
    <div style="width:280px; position:absolute; top:50%; left:50%; transform: translate(-50%, -50%); text-align:center;">
      <v-icon size="48" color="error" class="mb-2">mdi-alert-circle-outline</v-icon>
      <div style="color:var(--color-text-secondary); font-size:15px;">{{ $t('progress.error') }}</div>
    </div>
  </v-container>
  <v-container v-else fluid style="height:100%; background:linear-gradient(rgb(255, 255, 255), rgb(245, 249, 250));">
    <v-row align="center" justify="center" style="height:100%;">
      <v-col cols="12" sm="8" md="6" lg="5" xl="4">
        <v-card class="px-6 py-8" outlined style="border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05) !important;">
          <v-form ref="form">
            <v-row align="center" justify="center" class="mb-2">
              <v-col class="text-center">
                <h2 style="color:var(--color-text-primary); font-size:20px; font-weight:700;">
                  {{ $t('progress.title') }}
                </h2>
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>

            <!-- 접수일자 선택 -->
            <v-row align="center" class="py-1">
              <v-col cols="5">
                <div style="color:var(--color-text-secondary); font-weight:500;">{{ $t('progress.requestDate') }}</div>
              </v-col>
              <v-col cols="7">
                <v-select
                  v-model="request_date"
                  @change="result_preview"
                  dense
                  outlined
                  hide-details
                  :items="request_date_list"
                  :no-data-text="$t('progress.noData')"
                ></v-select>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>

            <!-- 바코드 ID -->
            <v-row align="center" class="py-1">
              <v-col cols="5">
                <div style="color:var(--color-text-secondary); font-weight:500;">{{ $t('progress.barcodeId') }}</div>
              </v-col>
              <v-col cols="7">
                <div style="font-weight:600; color:var(--color-text-primary);">{{ patient_id }}</div>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>

            <!-- 검사자 성명 -->
            <v-row align="center" class="py-1">
              <v-col cols="5">
                <div style="color:var(--color-text-secondary); font-weight:500;">{{ $t('progress.name') }}</div>
              </v-col>
              <v-col cols="7">
                <div style="font-weight:600; color:var(--color-text-primary);">{{ patient_name }}</div>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>

            <!-- 진행상황 -->
            <v-row align="center" class="py-1">
              <v-col cols="5">
                <div style="color:var(--color-text-secondary); font-weight:500;">{{ $t('progress.progress') }}</div>
              </v-col>
              <v-col cols="7">
                <v-chip small color="primary" text-color="white" style="font-weight:600;">
                  {{ progress || '-' }}
                </v-chip>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>

            <!-- 검사 예상일자 -->
            <v-row align="center" class="py-1">
              <v-col cols="5">
                <div style="color:var(--color-text-secondary); font-weight:500;">{{ $t('progress.forecastDate') }}</div>
              </v-col>
              <v-col cols="7">
                <div style="color:var(--color-text-primary);">{{ dateformat(forecast_date) || '-' }}</div>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>

            <!-- 검사 완료일자 -->
            <v-row align="center" class="py-1">
              <v-col cols="5">
                <div style="color:var(--color-text-secondary); font-weight:500;">{{ $t('progress.actualDate') }}</div>
              </v-col>
              <v-col cols="7">
                <div style="color:var(--color-text-primary); font-weight:600;">{{ dateformat(finsh_date) || '-' }}</div>
              </v-col>
            </v-row>
            <v-divider class="my-2"></v-divider>

            <!-- 결과 등록일자 -->
            <v-row align="center" class="py-1">
              <v-col cols="5">
                <div style="color:var(--color-text-secondary); font-weight:500;">{{ $t('progress.reportDate') }}</div>
              </v-col>
              <v-col cols="7">
                <div style="color:var(--color-text-primary);">{{ dateformat(create_date) || '-' }}</div>
              </v-col>
            </v-row>
            <v-divider class="my-3"></v-divider>

            <!-- 결과지 열람 버튼 -->
            <v-row align="center" class="mt-2">
              <v-col>
                <v-btn
                  @click="print_result"
                  :color="!!finsh_date ? 'primary' : 'grey'"
                  :ripple="!!finsh_date"
                  dark
                  block
                  large
                  :elevation="0"
                  style="font-size:15px; font-weight:600;"
                >
                  <v-icon left>mdi-file-document-outline</v-icon>
                  {{ $t('progress.viewReport') }}
                </v-btn>
              </v-col>
            </v-row>

            <!-- 안내 문구 -->
            <div v-if="request_date_list && request_date_list.length > 0" class="mt-4 text-center" style="color:var(--color-text-tertiary); font-size:12px;">
              <div>{{ $t('progress.inquiry') }}</div>
            </div>
            <div v-else class="mt-4 text-center" style="color:var(--color-primary); font-size:13px; font-weight:500;">
              {{ $t('progress.noResult') }}
            </div>
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
  name: 'progress-vue',
  mixins: [validation, http],
  data: () => ({
    is_open: false,
    is_error: false,

    patient_id: null,
    patient_name: null,
    request_date: null,

    forecast_date: null,
    progress: null,
    finsh_date: null,
    create_date: null,
    now_request_date: null,

    template_version: '2', // default 2
    request_date_list: [],
  }),
  created: async function() {
    if (!this.$session.has('jwt') || !this.$route.query.patient_id || !this.$route.query.patient_name) {
      alert(this.$t('progress.invalidAccess'));
      this.$session.destroy();
      this.$router.replace({ name: "Login" }).catch(() => {});
      return;
    }
    this.patient_id = decodeURI(this.$route.query.patient_id);
    this.patient_name = decodeURI(this.$route.query.patient_name);
    this.get_request_date_combo().then(res => {
      this.is_open = res;
    });
  },
  methods: {
    dateformat: function(str) {
      if (!str) return '';
      // 타임존 왜곡 방지를 위해 YYYY-MM-DD 직접 파싱 우선 시도
      let match = String(str).match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      let year, month, day;
      if (match) {
        year = match[1];
        month = parseInt(match[2], 10);
        day = match[3].length === 1 ? '0' + match[3] : match[3];
      } else {
        let date = new Date(str);
        if (isNaN(date.getTime())) return str;
        year = date.getFullYear();
        month = date.getMonth() + 1;
        day = date.getDate() < 10 ? '0' + date.getDate() : String(date.getDate());
      }
      const isEng = this.$i18n.locale === 'eng';
      if (isEng) {
        const monthName = this.$t('common.monthNames.' + month) || month;
        return monthName + ' ' + parseInt(day, 10) + ', ' + year;
      }
      return year + this.$t('common.year') + ' ' + month + this.$t('common.month') + ' ' + day + this.$t('common.day');
    },
    print_result: async function() {
      if (this.request_date_list.length <= 0) return;
      if (!this.finsh_date) {
        alert(this.$t('progress.resultNotReady'));
        return;
      }
      await this.get_result_template();
      let data = {
        headers: {
          jwt: this.$session.get("jwt")
        },
        param: [{
          patient_id: this.patient_id,
          request_date: this.request_date,
        }],
        template_version: this.template_version,
        expire: new Date().getTime() + 1800000 // expire time : now() + 30min
      };
      // UTF-8 멀티바이트 안전한 Base64 인코딩
      let jsonStr = JSON.stringify(data);
      let query_string = "?data=" + btoa(unescape(encodeURIComponent(jsonStr)));
      const isDev = process.env.NODE_ENV === 'development';
      const baseUrl = isDev ? "http://localhost:8081" : window.location.origin;

      // 차세대 통합 뷰어 (/view/) 단일 엔드포인트 호출
      window.open(baseUrl + "/view/" + query_string, "_blank");
    },
    result_preview: async function() {
      let data = {
        patient_id: this.patient_id,
        request_date: this.request_date
      };
      let res = await this.get(this.$lookupUrl + '/server/result_preview.php', data);
      if (res && res.data && res.data.info) {
        this.forecast_date = res.data.info.forecast_date;
        this.progress = res.data.info.progress;
        this.finsh_date = res.data.info.finsh_date;
        this.create_date = res.data.info.create_date;
        this.now_request_date = res.data.info.now_request_date;
      }
    },
    get_request_date_combo: async function() {
      let is_success = false;
      let data = {
        patient_id: this.patient_id
      };
      let res = await this.get(this.$lookupUrl + '/server/result/get_request_date_combo.php', data);
      if (res && res.data && res.data.info) {
        this.request_date_list = [];
        res.data.info.forEach(element => {
          this.request_date_list.push(element.request_date);
        });
        if (this.request_date_list && this.request_date_list.length > 0) {
          this.request_date = this.request_date_list[0];
          this.result_preview();
        }
        is_success = true;
      } else {
        this.is_error = true;
      }
      return is_success;
    },
    get_result_template: async function() {
      let data = {
        request_date: this.request_date,
        lang_cd: this.$store.getters.lang_cd
      };
      let res = await this.get(this.$lookupUrl + '/server/result/get_template_list.php', data);
      if (res && res.data && res.data.ret == "0000" && res.data.info && res.data.info.length > 0) {
        let template_info = res.data.info[0];
        this.template_version = template_info.seq;
      }
    },
  }
}
</script>

<style scoped>
</style>
