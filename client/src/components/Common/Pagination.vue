<template>
    <nav role="navigation" aria-label="Pagination Navigation">
        <ul v-if="enable" class="v-pagination theme--light">
            <li>
                <button @click="first" :disabled="!page||page<=1" type="button" class="v-pagination__navigation mr-1"><v-icon :disabled="!page||page<=1">mdi-chevron-double-left</v-icon></button>
            </li>
            <li>
                <button @click="prev" :disabled="!page||page<=1" type="button" class="v-pagination__navigation ml-1"><v-icon :disabled="!page||page<=1">mdi-chevron-left</v-icon></button>
            </li>
            <li v-for="index in lastPage" :key="index">
                <button v-if="index==page" @click="nums(index)" type="button" class="v-pagination__item v-pagination__item--active primary">{{index}}</button>
                <button v-else-if="index>=startPage&&index<=endPage" @click="nums(index)" type="button" class="v-pagination__item">{{index}}</button>
            </li>
            <li>
                <button @click="next" :disabled="!page||page>=lastPage" type="button" class="v-pagination__navigation mr-1"><v-icon :disabled="!page||page>=lastPage">mdi-chevron-right</v-icon></button>
            </li>
            <li>
                <button @click="last" :disabled="!page||page>=lastPage" type="button" class="v-pagination__navigation ml-1"><v-icon :disabled="!page||page>=lastPage">mdi-chevron-double-right</v-icon></button>
            </li>
        </ul>
        <ul v-else class="v-pagination theme--light">
            <li>
                <button disabled type="button" class="v-pagination__navigation mr-1"><v-icon disabled>mdi-chevron-double-left</v-icon></button>
            </li>
            <li>
                <button disabled type="button" class="v-pagination__navigation ml-1"><v-icon disabled>mdi-chevron-left</v-icon></button>
            </li>
            <li>
                <button disabled type="button" class="v-pagination__navigation mr-1"><v-icon disabled>mdi-chevron-right</v-icon></button>
            </li>
            <li>
                <button disabled type="button" class="v-pagination__navigation ml-1"><v-icon disabled>mdi-chevron-double-right</v-icon></button>
            </li>
        </ul>
        <v-pagination v-show="false"></v-pagination>
    </nav>
</template>

<script>
export default {
    name:"pagination-vue",
    props:[
        'page', 'pagePerRecord', 'recordLength'
    ],
    data:()=>({
        startPage:0,
        endPage:0,

        lastPage:0,
    }),
    methods:{
        calPage:function(){
            for ( this.startPage = this.page ; this.startPage > 0 ; this.startPage-- ){
                if ( this.startPage % 10 == 1 ){
                    this.endPage = this.startPage + 9
                    break
                }
            }
            this.lastPage = Math.ceil(this.recordLength/this.pagePerRecord)
            if ( this.lastPage < this.endPage ){
                this.endPage = this.lastPage
            }
        },
        first:function(){
            this.$emit('input', 1)
        },
        last:function(){
            this.$emit('input', this.lastPage)
        },
        prev:function(){
            this.$emit('input', this.page-1)
        },
        next:function(){
            this.$emit('input', this.page+1)
        },
        nums:function(val){
            if ( this.page == val )
            {
                return
            }
            this.$emit('input', val)
        }
    },
    computed:{
        enable:function(){
            if ( this.page && this.pagePerRecord && this.recordLength ){
                this.calPage()
                return true
            }
            return false
        }
    }
}
</script>