<template>
  <v-dialog v-model="is_open" content-class="d-print-none" :width="$vuetify.breakpoint.mobile?'100vw':'550px'" persistent>
    <v-card>
      <v-card-title>
        <v-row align="center">
          <v-col cols="auto">
            <h6>유전자 정보</h6>
          </v-col>
          <v-spacer></v-spacer>
          <v-col cols="auto">
            <v-btn @click="close" small icon><v-icon>mdi-window-close</v-icon></v-btn>
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider class="pb-5"></v-divider>
      <v-card-text v-if="gene_list.length>0" :class="$vuetify.breakpoint.mobile?'px-1':null" style="height:50vh; overflow-y:scroll;">
        <v-card v-for="(gene_item, index) in gene_list" class="mb-5" :key="index" outlined>
          <v-card-title style="background-color:rgb(249,250,251)">
            <v-row align="center" justify="end">
              <v-col cols="auto" class="py-0">
                <v-btn @click="commit(gene_item)" small dark :elevation="0">선택</v-btn>
              </v-col>
            </v-row>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row align="start">
              <v-col cols="auto" style="min-width:80px;">
                검사종류
              </v-col>
              <v-col>
                {{ gene_item.test_type_id }}
              </v-col>
            </v-row>
            <v-row align="start">
              <v-col cols="auto" class="py-0" style="min-width:80px;">
                유전자명
              </v-col>
              <v-col class="py-0">
                {{ gene_item.gene_cd }}
              </v-col>
            </v-row>
            <v-row align="start">
              <v-col cols="auto" style="min-width:80px;">
                설명
              </v-col>
              <v-col>
                {{ gene_item.note }}
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-card-text>
      <v-card-text v-else :class="$vuetify.breakpoint.mobile?'px-1':null" style="height:50vh; overflow-y:auto;">
        <v-row class="mx-1" style="height:100%;" align="center" justify="center">
          <v-col cols="auto">
            <div style="text-align:center">데이터가 없습니다.</div>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions class="px-0 mx-0">
        <v-row style="margin:5px;" align="center">
          <v-col class="pr-0">
            <v-text-field v-model="test_type_id" @keydown.enter="get_gene_list" dense outlined hide-details placeholder="검사코드" clearable></v-text-field>
          </v-col>
          <v-col cols="auto">
            <v-btn @click="get_gene_list" small dark :elevation="0">검색</v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import http from '@/mixin/http'
export default {
  name:"gene-vue",
  mixins: [http],
  data:()=>({
    is_open: false,

    index: 0,
    test_type_id: null,
    gene_list:[
      /*
      {
        test_type_id:'',
        gene_cd:'',
        note:'',
      }
      */
    ],
  }),
  methods:{
    open: function(test_type_id, index){
      if ( index == null || index == undefined ) return;
      this.test_type_id = test_type_id;
      this.index = index;
      this.get_gene_list().then(res=>{
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
    get_gene_list: async function(){
      let data = {
        test_type_id: this.test_type_id
      };
      this.$store.commit('load', true);
      //let res = await this.get(this.$rootUrl+'/server/base/get_gene_list.php', data);
      let res = await this.get(this.$lookupUrl+'/server/base/get_gene_list.php', data);
      if ( res ){
        this.gene_list = res.data.info;
        this.$store.commit('load', false);
        return true;
      }
      this.$store.commit('load', false);
      return false;
    },
    commit:function(item){
      this.$emit('commit', {index: this.index, item: item});
      this.close();
    }
  },
}
</script>