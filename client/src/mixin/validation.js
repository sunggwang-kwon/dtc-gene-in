export default({
  data(){
    return {
    required: v => !!v || this.$t('validation.required'),
    id_rule: v => !(v && (v.length < 4 || v.length > 20) && (/^[a-zA-Z0-9]*$/.test(v)) ) || '4~20자 영문, 숫자만 입력 가능합니다.',
    password_rule: v => !(v && (v.length < 4 || v.length > 20) ) || '4~20자 영문, 숫자, 특수문자만 입력 가능합니다.',
    email_rule: v => !v || /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || '메일 형식이 올바르지 않습니다.',
    birthday_rule: v => !v || /^(19[0-9][0-9]|20\d{2})-?(0[0-9]|1[0-2])-?(0[1-9]|[1-2][0-9]|3[0-1])$/.test(v) || '생년월일 형식이 올바르지 않습니다.',
    phone_rule:    v => !v || /^([0-9]{2,3})-?([0-9]{3,4})-?([0-9]{4})$/.test(v) || '전화번호 형식이 올바르지 않습니다.',
  };
  },
});