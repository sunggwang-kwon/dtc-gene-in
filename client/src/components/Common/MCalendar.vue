<template>
  <v-dialog v-model="menu" content-class="d-print-none" max-width="300">
    <v-card>
      <v-app-bar v-if="select==1" dark dense :elevation="0">
        <div>{{ updateDate }}</div>
      </v-app-bar>
      <v-app-bar v-else dark dense :elevation="0">
        <div v-if="!updateDate[0]"> {{ updateDate[1] }}</div>
        <div v-else-if="!updateDate[1]">{{ updateDate[0] }}</div>
        <div v-else-if="updateDate[0]<updateDate[1]"> {{ updateDate[0] }} ~ {{ updateDate[1] }} </div>
        <div v-else> {{updateDate[1] }} ~ {{ updateDate[0] }}</div>
      </v-app-bar>
      <v-card-text class="pa-0">
        <v-date-picker v-if="select==1" v-model="updateDate" no-title locale="ko"></v-date-picker>
        <v-date-picker v-else v-model="updateDate" no-title locale="ko" range></v-date-picker>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="close" color="red" dark small :elevation="0">취소</v-btn>
        <v-btn @click="commit" dark small :elevation="0">확인</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name:"calendar-vue",
  props:['select'],
  data:()=>({
    menu: false,
    date: [],
    updateDate: [],
    x: 0,
    y: 0,
  }),
  methods:{
    open:function(curDate){
        this.updateDate = curDate;
        this.date = this.updateDate;
        this.menu = true;
    },
    close:function(){
        this.menu = false;
    },
    reset:function(){
        Object.assign(this.$data, this.$options.data());
    },
    commit:function(){
      if ( this.updateDate.length == 0 ){
        return;
      }
      else if ( this.updateDate.length == 1 ){
        if ( this.select == 1 ){
          this.date = this.updateDate;
        }
        else{
          this.date = [this.updateDate[0], this.updateDate[0]];
        }
      }
      else{
        this.date = this.updateDate;
      }
      this.$emit("commit", this.date);
      this.close();
    }
  },
}
</script>