import Vue from 'vue'
import Vuex from 'vuex'
//import lodash from 'lodash'

Vue.use(Vuex)

export const store = new Vuex.Store({
  strict:process.env.NODE_ENV !== 'production',

  state:{
    load: false,
    lang_cd: 'kor',
  },
  getters:{
    load: function(state){
      return state.load;
    },
    lang_cd: function(state){
      return state.lang_cd;
    },
  },
  mutations:{
    load: function(state, payload){
      state.load = payload;
    },
    setLangCd: function(state, payload){
      state.lang_cd = payload;
    },
  }
});