import PDFDocument from 'pdfkit'

function escapeCsvValue(value) {
    const stringValue = String(value ?? '')

    if (/[",\n\r]/.test(stringValue)) {
        return `"${stringValue.replace(/"/g, '""')}"`
    }

    return stringValue
}

function csvRow(values) {
    return `${values.map(escapeCsvValue).join(',')}\n`
}

export function buildFinancialReportCsv(report) {
    const lines = []

    lines.push(csvRow(['Financial Report']))
    lines.push(
        csvRow([
            'Period Start',
            report.period.startDate ?? '',
            'Period End',
            report.period.endDate ?? '',
        ]),
    )
    lines.push(
        csvRow([
            'Total Earnings',
            report.summary.totalEarnings,
            'Total Expenses',
            report.summary.totalExpenses,
        ]),
    )
    lines.push(
        csvRow([
            'Balance',
            report.summary.balance,
            'Transaction Count',
            report.summary.transactionCount,
        ]),
    )
    lines.push('\n')
    lines.push(csvRow(['Transactions']))
    lines.push(csvRow(['Date', 'Name', 'Type', 'Amount', 'Category']))

    for (const transaction of report.transactions) {
        lines.push(
            csvRow([
                transaction.date,
                transaction.name,
                transaction.type,
                transaction.amount,
                transaction.categoryName,
            ]),
        )
    }

    lines.push('\n')
    lines.push(csvRow(['Summary By Category']))
    lines.push(csvRow(['Category', 'Type', 'Total Amount', 'Count']))

    for (const row of report.byCategory) {
        lines.push(
            csvRow([row.categoryName, row.type, row.totalAmount, row.count]),
        )
    }

    lines.push('\n')
    lines.push(csvRow(['Summary By Type']))
    lines.push(csvRow(['Type', 'Total Amount', 'Count']))

    for (const row of report.byType) {
        lines.push(csvRow([row.type, row.totalAmount, row.count]))
    }

    return `\uFEFF${lines.join('')}`
}

export function buildFinancialReportPdf(report) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ margin: 50, size: 'A4' })
        const chunks = []

        doc.on('data', (chunk) => chunks.push(chunk))
        doc.on('end', () => resolve(Buffer.concat(chunks)))
        doc.on('error', reject)

        doc.fontSize(20).text('Financial Report', { align: 'center' })
        doc.moveDown()

        doc.fontSize(11)
        doc.text(
            `Period: ${report.period.startDate ?? 'N/A'} to ${report.period.endDate ?? 'N/A'}`,
        )
        doc.moveDown(0.5)
        doc.text(`Total Earnings: ${report.summary.totalEarnings}`)
        doc.text(`Total Expenses: ${report.summary.totalExpenses}`)
        doc.text(`Balance: ${report.summary.balance}`)
        doc.text(`Transactions: ${report.summary.transactionCount}`)

        if (report.meta?.truncated) {
            doc.moveDown(0.5)
            doc.text(
                `Note: export limited to ${report.meta.transactionLimit} transactions.`,
            )
        }

        doc.moveDown()
        doc.fontSize(14).text('Transactions')
        doc.moveDown(0.5)
        doc.fontSize(10)

        const tableTop = doc.y
        const columns = [90, 140, 70, 70, 120]
        const headers = ['Date', 'Name', 'Type', 'Amount', 'Category']

        headers.forEach((header, index) => {
            const x =
                50 +
                columns.slice(0, index).reduce((sum, width) => sum + width, 0)
            doc.text(header, x, tableTop, {
                width: columns[index],
                continued: false,
            })
        })

        doc.moveDown(0.5)

        for (const transaction of report.transactions) {
            if (doc.y > 720) {
                doc.addPage()
            }

            const rowY = doc.y
            const values = [
                transaction.date.slice(0, 10),
                transaction.name,
                transaction.type,
                transaction.amount,
                transaction.categoryName,
            ]

            values.forEach((value, index) => {
                const x =
                    50 +
                    columns
                        .slice(0, index)
                        .reduce((sum, width) => sum + width, 0)
                doc.text(String(value), x, rowY, {
                    width: columns[index],
                    continued: false,
                })
            })

            doc.moveDown(0.8)
        }

        doc.end()
    })
}
