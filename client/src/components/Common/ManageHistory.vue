<template>
  <v-dialog v-model="is_open" content-class="d-print-none" :width="$vuetify.breakpoint.mobile?'100vw':'1000px'" persistent>
    <v-card>
      <v-card-title>
        <v-row align="center">
          <v-col cols="auto">
            <h6>변경내역</h6>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn @click="close" small icon><v-icon>mdi-window-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider class="pb-5"></v-divider>
      <v-card-text :class="$vuetify.breakpoint.mobile?'px-3':null" style="max-height:50vh; overflow-y:auto;">
        <v-row align="center">
          <v-col>
            <div v-if="!$vuetify.breakpoint.mobile" class="tinycss" style="overflow-x:auto;">
              <table style="position:relactive; min-width:940px; table-layout:fixed;" border="1">
                <thead>
                  <tr>
                    <th style="text-align:center; font-size:10pt; font-weight:bold;">항목</th>
                    <th style="text-align:center; font-size:10pt; font-weight:bold;">이전값</th>
                    <th style="text-align:center; font-size:10pt; font-weight:bold;">변경값</th>
                    <th style="text-align:center; font-size:10pt; font-weight:bold;">변경사유</th>
                    <th width="17%" style="text-align:center; font-size:10pt; font-weight:bold;">변경일시</th>
                    <th style="text-align:center; font-size:10pt; font-weight:bold;">변경자</th>
                  </tr>
                </thead>
                <tbody v-if="patient_list.length>0">
                  <tr v-for="(patient_item, index) in patient_list" :key="index">
                    <td style="text-align:center">{{ patient_item.change_item }}</td>
                    <td style="text-align:center">{{ patient_item.change_before_value }}</td>
                    <td style="text-align:center">{{ patient_item.change_after_value }}</td>
                    <td style="text-align:center">{{ patient_item.change_reason }}</td>
                    <td style="text-align:center">{{ patient_item.modify_time }}</td>
                    <td style="text-align:center">{{ patient_item.lims_id }}</td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td :colspan="6" style="text-align:center;">데이터가 없습니다.</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else>
              <v-card v-for="(patient_item, index) in patient_list" class="mb-5" :key="index" outlined>
                <v-card-text class="px-1">
                  <v-row class="mx-1" align="center">
                    <v-col cols="6">
                      <div style="font-size:10pt;">항목</div>
                    </v-col>
                    <v-col cols="6">
                      <div style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis; font-size:10pt; text-align:end;">{{ patient_item.change_item }}</div>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1" align="center" style="border-top:1px solid rgba(0,0,0,0.12);background:rgba(0,0,0,0.01);">
                    <v-col cols="6">
                      <div style="font-size:10pt;">이전값</div>
                    </v-col>
                    <v-col cols="6">
                      <div style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis; font-size:10pt; text-align:end;">{{ patient_item.change_before_value }}</div>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1" align="center" style="border-top:1px solid rgba(0,0,0,0.12);">
                    <v-col cols="6">
                      <div style="font-size:10pt;">변경값</div>
                    </v-col>
                    <v-col cols="6">
                      <div style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis; font-size:10pt; text-align:end;">{{ patient_item.change_after_value }}</div>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1" align="center" style="border-top:1px solid rgba(0,0,0,0.12);background:rgba(0,0,0,0.01);">
                    <v-col cols="6">
                      <div style="font-size:10pt;">변경사유</div>
                    </v-col>
                    <v-col cols="6">
                      <div style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis; font-size:10pt; text-align:end;">{{ patient_item.change_reason }}</div>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1" align="center" style="border-top:1px solid rgba(0,0,0,0.12);">
                    <v-col cols="6">
                      <div style="font-size:10pt;">변경일시</div>
                    </v-col>
                    <v-col cols="6">
                      <div style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis; font-size:10pt; text-align:end;">{{ patient_item.modify_time }}</div>
                    </v-col>
                  </v-row>
                  <v-row class="mx-1" align="center" style="border-top:1px solid rgba(0,0,0,0.12);background:rgba(0,0,0,0.01);">
                    <v-col cols="6">
                      <div style="font-size:10pt;">변경자</div>
                    </v-col>
                    <v-col cols="6">
                      <div style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis; font-size:10pt; text-align:end;">{{ patient_item.lims_id }}</div>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>
              <div v-if="patient_list.length==0" style="height:100px; display:flex; align-items:center; justify-content:center; background-color:white;">데이터가 없습니다.</div>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import http from '@/mixin/http'
export default {
  name:"manage-history-vue",
  mixins: [http],
  data:()=>({
    is_open: false,

    patient_id: null,
    patient_list:[
      /*
      {
        change_item:'',
        change_before_value:'',
        change_after_value:'',
        change_reason:'',
        modify_time:'',
        lims_id:'',
      }
      */
    ]
  }),
  methods:{
    open: function(patient_id){
      if ( !patient_id ) return;
      this.patient_id = patient_id;
      this.get_patient_history_list().then(res=>{
        this.is_open = res;
      });
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
    get_patient_history_list: async function(){
      let data = {
        patient_id: this.patient_id
      };
      this.$store.commit('load', true);
      //let res = await this.get(this.$rootUrl+'/server/patient/get_patient_history_list.php', data);
      let res = await this.get(this.$lookupUrl+'/server/patient/get_patient_history_list.php', data);
      if ( res ){
        this.patient_list = res.data.info;
        this.$store.commit('load', false);
        return true;
      }
      this.$store.commit('load', false);
      return false;
    },
  }
}
</script>