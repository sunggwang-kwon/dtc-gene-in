<template>
  <div v-if="!$vuetify.breakpoint.mobile" class="tinycss">
    <table style="width:100%; position:relative;" border="0">
      <thead>
        <tr>
          <th v-if="select!==false" :style="{
              position: top? 'sticky': '',
              top: top? top : '',
              zIndex: top? '1' : '',
            }" width="40px">
            <v-checkbox v-model="is_all_check" @change="change_all_check" class="pa-0 ma-0" dense hide-details></v-checkbox>
          </th>
          <th v-for="header in headers" :key="header.key" 
            :style="{
              width:header.width?header.width:'',
              textAlign:header.align?header.align:'left',
              position: top? 'sticky': '',
              top: top? top : '',
              zIndex: top? '1' : '',
            }"
          >
            <v-btn @click="set_sort(header.key)" :class="sort==header.key?'pa-0 ma-0':'py-0 px-2 ma-0'" small text :ripple="false" plain>
              <span style="font-weight:bold;">{{ header.text }}</span>
              <v-icon v-if="sort==header.key&&order=='asc'" small>mdi-menu-up</v-icon>
              <v-icon v-else-if="sort==header.key&&order=='desc'" small>mdi-menu-down</v-icon>
            </v-btn>
          </th>
          <th v-if="detail!==false" :style="{
              position: top? 'sticky': '',
              top: top? top : '',
              zIndex: top? '1' : ''
            }" width="40px">
          </th>
        </tr>
      </thead>
      <tbody v-if="items.length>0">
        <tr v-for="(item,index) in items" :key="index">
          <td v-if="select!==false"><v-checkbox v-model="item.check" @change="change_check" class="pa-0 ma-0" dense hide-details></v-checkbox></td>
          <td v-for="(item_header, index2) in headers" :key="index2"
            :style="{
              textAlign:item_header.align?item_header.align:'left',
              fontSize:'0.9rem',
              color:item_header.link?'rgb(26,13,189)':null
            }"
          >
            <v-hover v-if="item_header.link" v-slot="{hover}">
              <div @click="$emit('link', item)" :style="hover?'text-decoration:underline;cursor:pointer;':''">{{ item[item_header.key] }}</div>
            </v-hover>
            <div v-else>{{ item[item_header.key] }}</div>
          </td>
          <td v-if="detail!==false">
            <v-btn @click="$emit('click', item, $event)" class="pa-0 ma-0" icon small><v-icon color="rgba(0,0,0,0.3)">mdi-chevron-right</v-icon></v-btn>
          </td>
        </tr>
      </tbody>
      <tbody v-else>
        <tr>
          <td :colspan="headers.length+2" class="text-center">데이터가 없습니다.</td>
        </tr>
      </tbody>
    </table>
  </div>

  <div v-else>
    <v-card v-for="(item,index) in items" class="mb-5" :key="index" outlined>
      <v-card-text>
        <v-row v-if="select!==false" align="center">
          <v-col>
            <v-checkbox v-model="item.check" @change="change_check" class="pa-0 ma-0" dense hide-details></v-checkbox>
          </v-col>
        </v-row>
        <v-row v-for="(item_header, index2) in headers" :key="index2" align="center" style="border-top:1px solid rgba(0,0,0,0.12);" :style="index2%2==0?'background:rgba(0,0,0,0.01)':''">
          <v-col cols="6">
            <div style="font-size:10pt;">{{ item_header.text }}</div>
          </v-col>
          <v-col cols="6">
            <div v-if="item_header.link" @click="$emit('link', item)" style="color:rgb(26,13,189); overflow:hidden;white-space:nowrap;text-overflow:ellipsis; font-size:10pt; text-align:end;">{{ item[item_header.key] }}</div>
            <div v-else style="overflow:hidden;white-space:nowrap;text-overflow:ellipsis; font-size:10pt; text-align:end;">{{ item[item_header.key] }}</div>
          </v-col>
        </v-row>
        <v-row v-if="detail!==false" align="center" style="border-top:1px solid rgba(0,0,0,0.12);">
          <v-col>
            <v-btn @click="$emit('click', item, $event)" block dark :elevation="0">상세보기</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <div v-if="items.length==0" style="height:100px; display:flex; align-items:center; justify-content:center; background-color:white;">데이터가 없습니다.</div>
  </div>
</template>

<script>
export default {
  name: 'dataTable-vue',
  props:['headers', 'items', 'sort_', 'order_', 'top', 'select', 'detail'],
  data: () => ({
    is_all_check: false,
    sort: null,
    order: null,
  }),
  created:function(){
    if( this.sort_ ) this.sort = this.sort_;
    if ( this.order_ ) this.order = this.order_;
  },
  methods:{
    change_all_check: function(){
      if ( this.is_all_check ){
        this.items.forEach(element=>{
          this.$set(element, 'check', true);
        });
      }
      else{
        this.items.forEach(element=>{
          this.$set(element, 'check', false);
        });
      }
      let checked_items = [];
      for ( let i = 0 ; i < this.items.length ; i++ ){
        if ( this.items[i].check ){
          checked_items.push(i);
        }
      }
      this.$emit('select', checked_items);
    },
    change_check: function(){
      let checked_items = [];
      let cnt = 0;
      for ( let i = 0 ; i < this.items.length ; i++ ){
        if ( this.items[i].check ){
          cnt++;
          checked_items.push(i);
        }
      }
      if ( this.items.length == cnt ){
        this.is_all_check = true;
      }
      else{
        this.is_all_check = false;
      }
      this.$emit('select', checked_items);
    },
    set_sort: function(key){
      if ( !this.sort || this.sort != key ){
        this.sort = key;
        this.order = 'desc';
      }
      else{
        if ( this.order == 'desc' ){
          this.order = 'asc';
        }
        else{
          this.sort = null;
          this.order = null;
        }
      }
      this.$emit('sort', this.sort, this.order);
    }
  },
}
</script>