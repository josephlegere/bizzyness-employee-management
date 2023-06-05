<template>
    <div>
        <client-only>
            <PDFViewer :src="generatePDF" :toPrint="toPrint" />
        </client-only>
    </div>
</template>

<script>
// import PDFViewer from './PDFViewer';
import moment from 'moment';
import { jsPDF } from "jspdf";

export default {
    props: {
        attendance: {
            type: Object,
            required: true
        },
        toPrint: {
            type: Boolean,
            default: true
        },
        supervisor: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            headers: [{index: '', employee: 'Employee', morning: 'Morning', afternoon: 'Afternoon', ottimings: 'Overtime', othours: 'OT Hours', locations: 'Locations', status: 'Status'}],
            body: {},
            footer: [],
            total: 0
        }
    },
    methods: {
        fillBody() {
            this.body = this.extractLayout(this.attendance.layout);
            console.log(this.body)
        },
        extractLayout(layout) {
            let _records = [];

            layout.forEach((elem, key) => {
                let _temp_object = {};
                
                let morning = '', afternoon = '', _ottimings = '';
                let { date, employee, othours, locations, status, timings, ottimings } = elem;

                let day_len = timings.day_min.length;
                let noon_len = timings.noon_min.length;
                let ot_len = ottimings.length;

                timings.day_min.forEach((timing, time_key) => {
                    morning += `${timing}${((time_key+1) < day_len ? '\n' : '')}`;
                });
                timings.noon_min.forEach((timing, time_key) => {
                    afternoon += `${timing}${((time_key+1) < noon_len ? '\n' : '')}`;
                });
                ottimings.forEach((timing, time_key) => {
                    _ottimings += `${timing}${((time_key+1) < ot_len ? '\n' : '')}`;
                });

                _temp_object = {
                    date,
                    employee,
                    othours,
                    locations,
                    status,
                    morning,
                    afternoon,
                    ottimings: _ottimings
                };

                _records.push(_temp_object);
            });

            
            //group records by date
            _records = this.groupBy(_records, 'date');

            //add counter to the records, counter is independent from each group
            Object.entries(_records).forEach(daterecords => {
                this.addIndex(daterecords[1]);
            });

            return _records;
        },
        groupBy(list, key) {
            return list.reduce(function(collection, elem) {
                (collection[elem[key]] = collection[elem[key]] || []).push(elem);
                return collection;
            }, {});
        },
        addIndex(list, count) {
            let _count = count || 1;
            list.forEach(elem => {
                elem.index = _count;
                _count++;
            });
            return list;
        }
        // fillFooter() {
            
        // }
    },
    created: function() {
        console.log(this.attendance)
        console.log(this.generatePDF);
        this.fillBody();
    },
    computed: {
        generatePDF() { // ------------------------------ not working in dev build ------------------------------
            if (process.client) {
                // const jsPDF = require('jspdf');
                require('jspdf-autotable');
                
                let doc = new jsPDF(); //default => unit: 'mm', format: 'a4',

                // doc.setFontSize(7);
                // doc.text(`(Edge)`, 1, 1);

                // doc.text(`No. ${this.invoice.invoice_code}`, 14, 52);
                // doc.text(`To: ${this.invoice.customer.account}`, 14, 58);
                // doc.text(`${moment(this.invoice.date).format("MMMM DD, YYYY")}`, 170, 52);

                let pageNumber = doc.internal.getNumberOfPages();

                doc.setPage(pageNumber);
                
                doc.setFontSize(9);

                let tables_len = Object.entries(this.body).length;

                if (tables_len > 0) {
                    Object.entries(this.body).forEach((elem, key) => {
                        console.log(elem);

                        let _key = elem[0];
                        let _value = elem[1];
                        
                        doc.setFontSize(11);
                        doc.setFont('Helvetica', 'Bold');

                        doc.text(`ATTENDANCE AND OVERTIME SHEET`, 70, 42);

                        // doc.text(`${moment(_key).format("MMMM Do YYYY, dddd")}`, 15, (doc.lastAutoTable.finalY + 8) || 68);
                        doc.text(`${moment(_key).format("MMMM Do YYYY, dddd")}`, 15, 68);
                        doc.autoTable({
                            head: this.headers,
                            body: _value,
                            // foot: this.footer,
                            // startY: (doc.lastAutoTable.finalY + 10) || 70,
                            startY: 70,
                            theme: 'plain',
                            tableLineColor: [0, 0, 0],
                            tableLineWidth: 0.2,
                            styles: {
                                lineColor: [0, 0, 0],
                                lineWidth: 0.1,
                                halign: 'center',
                                fontSize: 9
                            },
                            headStyles: {
                                lineColor: [0, 0, 0],
                                lineWidth: 0.2,
                                fillColor: [255, 255, 255],
                                textColor: 0,
                                fontSize: 9,
                                valign: 'middle'
                            },
                            footStyles: {
                                lineColor: [0, 0, 0],
                                lineWidth: 0.2,
                            },
                            columnStyles: {
                                // keys: { valign: 'top' },
                                // description: { halign: 'left' },
                                // price: { halign: 'right' },
                                // amount: { halign: 'right' }
                            },
                            willDrawCell: function (data) {
                                if (data.row.section === 'body') {
                                    //console.log(data)
                                    data.doc.line(data.cursor.x + data.column.width, data.cursor.y, data.cursor.x + data.column.width, data.cursor.y + data.row.height);
                                }
                            }
                        });
                        
                        doc.setFont('Helvetica', '');
                        doc.text(`Approved By: ${this.supervisor.name}`, 158, doc.lastAutoTable.finalY + 20);

                        if ((key + 1) < tables_len)
                            doc.addPage();
                    });

                    // doc.text(`Received By:`, 14, doc.lastAutoTable.finalY + 10);
                    // doc.line(40, doc.lastAutoTable.finalY + 10, 74, doc.lastAutoTable.finalY + 10);
                    // doc.text(`Signature:`, 14, doc.lastAutoTable.finalY + 20);
                    // doc.line(40, doc.lastAutoTable.finalY + 20, 74, doc.lastAutoTable.finalY + 20);
                }
                
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
        PDFViewer: () => {
            if (!process.client) {
                return {
                    component: '<div>PDF Viewer</div>'
                }
            }
            else {
                return {
                    component: import('./PDFViewer')
                }
            }
        }
    }
}
</script>