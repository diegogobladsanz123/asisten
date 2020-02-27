const Fs = require('fs')
const Path = require('path')
const Util = require('util')
const Puppeteer = require('puppeteer')
const Handlebars = require('handlebars')
const ReadFile = Util.promisify(Fs.readFile)

class genPDF {
    async html(data, templateName) { //proceso de compilar la data con la vista
        try {
            const templatePath = Path.resolve(`./views/pdfReport/${templateName}.html`)
            const content = await ReadFile(templatePath, 'utf8')

            // compile and render template with handlebars
            const template = Handlebars.compile(content)
            //console.log('data =>', data);
            return template(data)
        } catch (error) {
            throw new Error('Cannot create invoice HTML template..')
        }
    }

    async getNotificacion(data, templateName) { //se pasa la data y el nombre de la vista html es necesario pasar el dato entre ''
        const html = await this.html(data, templateName)

        const browser = await Puppeteer.launch()
        const page = await browser.newPage()
        await page.setContent(html)

        return page.pdf({
            format: 'a4',
            printBackground: true,
            margin: {
                top: "2.5cm",
                right: "1.5cm",
                bottom: "1.5cm",
                left: "1.5cm"
            }
        })
    }
    async getFicha(data, templateName, landscape) { //se pasa la data y el nombre de la vista html es necesario pasar el dato entre ''

        const html = await this.html(data, templateName)

        const browser = await Puppeteer.launch()
        const page = await browser.newPage()
        await page.setContent(html)

        return page.pdf({
            format: 'a4',
            printBackground: true,
            margin: {
                top: "1.5cm",
                right: "1.5cm",
                bottom: "1.5cm",
                left: "1.5cm"
            },
            landscape: landscape,
        })
    }
}

module.exports = genPDF;

//asdasdas