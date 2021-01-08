<template>
    <div>
        <v-btn v-show="toPrint" x-small class="mx-1 print-form" fab fixed right bottom @click="$refs.pdfComponent.print()" color="primary">
            <v-icon dark>mdi-printer</v-icon>
        </v-btn>
        
        <div class="move-page" v-show="pageCount > 1">
            <v-btn x-small class="mx-1 move-prev" fab @click="movePage('prev')" color="primary">
                <v-icon dark>mdi-chevron-left</v-icon>
            </v-btn>
            <v-btn x-small class="mx-1" fab @click="movePage('next')" color="primary">
                <v-icon dark>mdi-chevron-right</v-icon>
            </v-btn>
        </div>

        <h3 class="text-right mr-1">
            {{currentPage}} / {{pageCount}}
        </h3>

        <PDFRender
            :src="src"
            :page="currentPage"
            ref="pdfComponent"
            @num-pages="pageCount = $event"
            @page-loaded="currentPage = $event"
        ></PDFRender>
    </div>
</template>

<script>
import PDFRender from 'vue-pdf';

export default {
    props: {
        src: {
            type: String,
            required: true
        },
        toPrint: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            currentPage: 1,
            pageCount: 0,
        }
    },
    methods: {
        movePage(action) {
            if (action === 'prev') {
                if (this.currentPage > 1)
                    this.currentPage--;
            }
            else if (action === 'next') {
                if (this.currentPage < this.pageCount)
                    this.currentPage++
            }
        }
    },
    components: {
        PDFRender
    }
}
</script>

<style scoped>
    .move-page {
        position:               fixed;
        right:                  64px;
        bottom:                 16px;
        z-index:                4;
    }
    /* .move-prev {
    }
    .print-form {
    } */
</style>