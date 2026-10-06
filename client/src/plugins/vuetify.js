import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    options: {
      customProperties: true,
    },
    themes: {
      light: {
        // --- Primary (지니인사이트 브랜드 컬러) ---
        primary:    '#0C67DF',  // 지니인사이트 메인 블루
        secondary:  '#555555',
        accent:     '#21b4e9',  // 지니인사이트 심볼 포인트 시안
        search_btn: '#0C67DF',

        // --- Semantic ---
        error:   '#ef4444',
        success: '#22c55e',
        warning: '#f59e0b',
        info:    '#0C67DF',

        // --- Surface ---
        background: '#ffffff',
        surface:    '#ffffff',

        // --- Custom ---
        anchor: '#0C67DF',
      },
    },
  },
})
