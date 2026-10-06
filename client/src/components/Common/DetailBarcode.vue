<template>
  <v-dialog v-model="is_open" content-class="d-print-none" :width="!$vuetify.breakpoint.mobile?400:'100%'" persistent>
    <v-card>
      <v-card-title>
        <v-row align="center">
          <v-col cols="auto">
            <h6>바코드</h6>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn @click="close" small icon><v-icon>mdi-window-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider class="pb-5"></v-divider>
      <v-card-text :class="$vuetify.breakpoint.mobile?'px-1':null" style="height:60vh; overflow-y:auto;">
        <v-row v-for="(item, index) in items" :key="index" align="center">
          <v-col cols="12">
            <v-card outlined>
              <v-card-text>
                <v-row align="center">
                  <v-col cols="3" style="min-width:85px;" class="pb-1">아이디</v-col>
                  <v-col class="pb-1">{{ item.patient_id }}</v-col>
                </v-row>
                <v-row align="center">
                  <v-col cols="3" style="min-width:85px;" class="py-0">요청일자</v-col>
                  <v-col class="py-0">{{ item.request_date }}</v-col>
                </v-row>
                <v-row align="center">
                  <v-col>
                    <v-img class="ma-1" :src="item.images"></v-img>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import http from '@/mixin/http'
export default {
  name:"detail-barcode-vue",
  mixins: [http],
  data:()=>({
    is_open: false,
    items: [],
  }),
  methods:{
    open: function(items){
      this.items = items;
      this.barcode().then(res=>{
        this.is_open = res;
      })
    },
    close:function(){
      this.is_open = false;
      setTimeout(() => {
        this.reset();
      }, 100);
    },
    reset:function(){
      Object.assign(this.$data, this.$options.data());
    },
    barcode: async function(){
      this.$store.commit('load', true);
      for ( let i = 0 ; i < this.items.length ; i++ ){
        let data = {
          f: 'jpg',
          s: 'code-128',
          d: this.items[i].patient_id + '-' + this.items[i].request_date,
          w: 200,
          h: 60,
        }
        //let res = await this.download(this.$rootUrl+'/server/patient/barcode.php', data);
        let res = await this.download(this.$lookupUrl+'/server/patient/barcode.php', data);
        if ( res ){
          this.items[i].images = window.URL.createObjectURL(res.data);
        }
      }
      this.$store.commit('load', false);
      return true;
    }
  },
}
</script>