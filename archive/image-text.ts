const tesseract = require("tesseract.js")
const fs = require("fs")

tesseract.recognize("new-path-clean.png", "eng", {
    logger: m => console.log(m)
}).then(result => {
    console.log(result.data.text)
}).catch(err => {
    console.log(err.message)
})


const getImageText = async (fileName, lang, logger) => {
    let recognizeResult = null
    try {
        if (fs.existsSync(fileName)) {
            if (logger) {
                const myLogger = {
                    logger: m => console.log(m)
                }
                recognizeResult = await tesseract.recognize(fileName, lang, myLogger)
            } else {
                recognizeResult = await tesseract.recognize(fileName, lang)
            }
            if (recognizeResult) {
                return recognizeResult.data.text
            }
        }
    } catch (error) {
        return error.message
    }
}
