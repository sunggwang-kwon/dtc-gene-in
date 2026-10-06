import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

const messages = {
  kor: {
    login: {
      title: '지니인사이트 유전자 검사 결과 확인',
      subtitle: '바코드 번호(ID) 및 이름을 입력해 주세요.',
      barcodePlaceholder: '바코드번호(ID)',
      namePlaceholder: '이름',
      loginBtn: '로그인',
      language: '언어',
      kor: '한국어',
      eng: 'English',
    },
    app: {
      logout: '로그아웃',
      logoutConfirm: '로그아웃 하시겠습니까?',
      autoLogout: '일정시간 서비스 미사용으로 자동 로그아웃 되었습니다.',
    },
    validation: {
      required: '필수입력입니다.',
    },
    common: {
      year: '년',
      month: '월',
      day: '일',
      monthNames: { 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7', 8: '8', 9: '9', 10: '10', 11: '11', 12: '12' },
    },
    progress: {
      title: '지니인사이트 유전자 검사 결과 확인',
      requestDate: '접수일자',
      barcodeId: '바코드번호(ID)',
      name: '이름',
      progress: '진행 상황',
      forecastDate: '예상 결과 완료일',
      actualDate: '실제 결과 완료일',
      reportDate: '결과보고일',
      viewReport: '결과보고서 조회',
      noData: '데이터가 없습니다.',
      inquiry: '궁금하신 사항은 고객센터 또는 담당 거래처로 문의해 주시기 바랍니다.',
      noResult: '분석결과가 없습니다',
      error: '에러가 발생했습니다.',
      invalidAccess: '잘못된 접근입니다. 다시 로그인해주세요.',
      resultNotReady: '아직 검사결과가 완료되지 않았습니다.',
    },
  },
  eng: {
    login: {
      title: 'GeneInsight Genetic Test Report',
      subtitle: 'Please enter barcode number (ID) and name.',
      barcodePlaceholder: 'Barcode Number (ID)',
      namePlaceholder: 'Name',
      loginBtn: 'Login',
      language: 'Language',
      kor: '한국어',
      eng: 'English',
    },
    app: {
      logout: 'Logout',
      logoutConfirm: 'Do you want to logout?',
      autoLogout: 'You have been automatically logged out due to inactivity.',
    },
    validation: {
      required: 'This field is required.',
    },
    common: {
      year: '년',
      month: '월',
      day: '일',
      monthNames: { 1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr', 5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug', 9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec' },
    },
    progress: {
      title: 'GeneInsight Genetic Test Result Check',
      requestDate: 'Accession Date',
      barcodeId: 'Barcode Number (ID)',
      name: 'Name',
      progress: 'Status',
      forecastDate: 'Estimated Completion Date',
      actualDate: 'Actual Completion Date',
      reportDate: 'Reported Date',
      viewReport: 'View Result Report',
      noData: 'No data available.',
      inquiry: 'If you have any questions, please contact us at the email address below.',
      noResult: 'No analysis results available.',
      error: 'An error has occurred.',
      invalidAccess: 'Invalid access. Please login again.',
      resultNotReady: 'Test results are not yet complete.',
    },
  },
}

const i18n = new VueI18n({
  locale: 'kor',
  fallbackLocale: 'kor',
  messages,
})

export default i18n
