<template>
    <div>
        <PDFViewer :src="generatePDF" :toPrint="toPrint" />
    </div>
</template>

<script>
import PDFViewer from './PDFViewer';
import moment from 'moment';

export default {
    props: {
        attendance: {
            type: Object,
            required: true
        },
        toPrint: {
            type: Boolean,
            default: true
        }
    },
    data() {
        return {
            headers: [{employee: 'Employee', morning: 'Morning', afternoon: 'Afternoon', ottimings: 'OT Timings', othours: 'OT Hours', locations: 'Locations', status: 'Status'}],
            body: [],
            footer: [],
            total: 0,
            toWords: new ToWords()
        }
    },
    methods: {
        fillBody: {

        },
        fillFooter: {
            
        }
    },
    created: function() {

    },
    computed: {
        generatePDF() {
            if (process.client) {
                const jsPDF = require('jspdf');
                require('jspdf-autotable');
                
                let doc = new jsPDF(); //default => unit: 'mm', format: 'a4',

                // doc.setFontSize(7);
                // doc.text(`(Edge)`, 1, 1);

                doc.setFontSize(11);
                doc.setFont('Helvetica', 'Bold');

                doc.text(`ATTENDANCE AND OVERTIME SHEET`, 85, 42);
                doc.text(`No. ${this.invoice.invoice_code}`, 14, 52);
                doc.text(`To: ${this.invoice.customer.account}`, 14, 58);
                doc.text(`${moment(this.invoice.date).format("MMMM DD, YYYY")}`, 170, 52);

                doc.autoTable({
                    head: this.headers,
                    body: this.body,
                    foot: this.footer,
                    startY: 70,
                    theme: 'plain',
                    tableLineColor: [0, 0, 0],
                    tableLineWidth: 0.2,
                    styles: {
                        lineColor: [0, 0, 0],
                        lineWidth: 0,
                        halign: 'center'
                    },
                    headStyles: {
                        lineColor: [0, 0, 0],
                        lineWidth: 0.2,
                        fillColor: [255, 255, 255],
                        textColor: 0,
                        fontSize: 11,
                        valign: 'middle'
                    },
                    footStyles: {
                        lineColor: [0, 0, 0],
                        lineWidth: 0.2,
                    },
                    columnStyles: {
                        keys: { valign: 'top' },
                        description: { halign: 'left' },
                        price: { halign: 'right' },
                        amount: { halign: 'right' }
                    },
                    willDrawCell: function (data) {
                        if (data.row.section === 'body') {
                            //console.log(data)
                            data.doc.line(data.cursor.x + data.column.width, data.cursor.y, data.cursor.x + data.column.width, data.cursor.y + data.row.height);
                        }
                    }
                });
                
                doc.setFont('Helvetica', '');
                doc.text(`Received By:`, 14, doc.lastAutoTable.finalY + 10);
                doc.line(40, doc.lastAutoTable.finalY + 10, 74, doc.lastAutoTable.finalY + 10);
                doc.text(`Signature:`, 14, doc.lastAutoTable.finalY + 20);
                doc.line(40, doc.lastAutoTable.finalY + 20, 74, doc.lastAutoTable.finalY + 20);
                doc.text(`Authorized Signature`, 160, doc.lastAutoTable.finalY + 20);
                
                //doc.rect(14, 14, 182, doc.lastAutoTable.finalY - 14); //border
                //console.log(doc.lastAutoTable); //info about the last drawn table
                
                doc.autoPrint({ variant: 'non-conform' });
                let _pdf = doc.output('datauristring');
                return _pdf;
            }
            else {
                return
            }
        }
    },
    components: {
        PDFViewer
    }
}
</script>