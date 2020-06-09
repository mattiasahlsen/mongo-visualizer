//SIZE OF LETTER 612x792
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const HK = path.join(__dirname, '../assets/fonts/hk-grotesk/HKGrotesk-Bold.otf')
const OpenSans = path.join(__dirname, '../assets/fonts/Open_Sans/OpenSans-Regular.ttf')
const Raleway = path.join(__dirname, '../assets/fonts/Raleway/Raleway-Regular.ttf')

const titleSize = 15
const textTitleSize = 11
const textSize = 9

// constants
const CV_DIR = path.join(__dirname, './cvs')
const IMAGE_DIR = path.join(__dirname, './profile-pic')

const col1 = {x: 30, y: 20, width: 262}
const col2 = {x: 320, y: 20, width: 262}

const afterImageX = col2.x
const afterImageY = col2.y+(col2.width*0.6)+40
const imgWidth = col2.width*0.6


//FUNCTION TO CREATE SECTIONS
const section = (doc, { x, y, width, sectionTitle, subSections } = {}) => {
    doc.font(HK)
    .moveDown(2.5)
    .fontSize(titleSize)
    .text(sectionTitle.toUpperCase(), x, y, {width})
    subSections.forEach(s => {
        doc.moveDown(0.8)
        .font(HK)
        .fontSize(textTitleSize)
        .text(s.title, {width})
        .font(OpenSans)
        .moveDown(0.2)
        .fontSize(textSize)
        .text(s.text, {width})


    })
    
}

const profilePic = (doc, userId) => {
    // Add an image
    const img = doc.image(path.join(IMAGE_DIR + '/' + userId + '.png'), col2.x+(col2.width*0.2),col2.y, {
        fit: [col2.width*0.6, col2.width*0.6],
        align: 'center',
        valign: 'bottom'
    });
}

const contacts = (doc, {adress, email, phoneNumber}) => {

    // CONTACTS WITH ADRESS MAIL AND PHONENUMBER
    doc.font(HK)
    .fontSize(titleSize)
    .text('CONTACTS', afterImageX, afterImageY, {width: col1.width} )
    .moveDown(0.3)
    .font(OpenSans)
    .fontSize(textTitleSize)
    .text(adress, {width: col1.width, align: 'left'} )
    .text(email, {width: col1.width, align: 'left'} )
    .text(phoneNumber, {width: col1.width, align: 'left'} )
}

const header = (doc, { firstName, lastName, title }) => {
  //NAME AND TITLE
  doc.font(HK)
    .fontSize(44)
    .text(firstName, col1.x, col1.y+(imgWidth*0.3))
    .text(lastName, col1.x, col1.y+(imgWidth*0.3)+44)
    .fontSize(10)
    .font(Raleway)
    .text(title.toUpperCase())
    .moveDown(0.8)
}

const generateCv =({
    userId = '123',
    firstName = 'Firstname',
    lastName = 'Lastname',
    adress = 'Malmvägen 1',
    email = '',
    phoneNumber = '+46761234567',
    title = 'Personal Title',
    wle1company = ' ',
    wle1desc = ' ',
    wle2company = ' ',
    wle2desc = ' ',
    wle3company = ' ',
    wle3desc = ' ',
    edu1school = ' ',
    edu1desc = ' ',
    edu2school = ' ',
    edu2desc = ' ',
    edu3school = ' ',
    edu3desc = ' ',
    merit1title = ' ',
    merit1desc = ' ',
    lang1title = ' ',
    lang1level = ' ',
    lang2title = ' ',
    lang2level = ' ',
    other1title = ' ',
    other1desc = ' ',
    other2title = ' ',
    other2desc = ' ',
    ref1name = ' ',
    ref1number = ' ',
    ref2name = ' ',
    ref2number = ' ',
    }= {}) => {

    // Create a document
    const doc = new PDFDocument({autoFirstPage:false});
    doc.addPage({size: [612, 792]})

    // Pipe its output somewhere, like to a file or HTTP response
    // See below for browser usage
    doc.pipe(fs.createWriteStream(path.join(CV_DIR, userId + '.pdf')));
    
    profilePic(doc, userId)

    header(doc, {firstName, lastName, title})

    //WORK LIFE EXPERIENCE
    section(doc, {
        width: col1.width,
        sectionTitle: 'WORK LIFE EXPERIENCE',
        subSections: [{title:wle1company,text:wle1desc },{title:wle2company,text:wle2desc },{title:wle3company,text:wle3desc }]
    })

     //EDUCATIN
     section(doc, {
        width: col1.width,
        sectionTitle: 'EDUCATION',
        subSections: [{title:edu1school,text:edu1desc },{title:edu2school,text:edu2desc },{title:edu3school,text:edu3desc },]
    })        

    //REFERENCES
    section(doc, {
        width: col1.width,
        sectionTitle: 'REFERENCES',
        subSections: [{title:ref1name,text:ref1number},{title:ref2name,text:ref2number}]
        })

    contacts(doc, {adress, email, phoneNumber})

    //MERITS
    section(doc, {
        width: col1.width,
        sectionTitle: 'MERITS',
        subSections: [{title:merit1title,text:merit1desc }]
    })

    //LANGUAGE
    section(doc, {
        width: col1.width,
        sectionTitle: 'LANGUAGE',
        subSections: [{title:lang1title,text:lang1level},{title:lang2title,text:lang2level}]
        })

    //OTHER
    section(doc, {
        width: col1.width,
        sectionTitle: 'OTHER EXPERIENCES',
        subSections: [{title:other1title,text:other1desc},{title:other2title,text:other2desc}]
        })


    // Finalize PDF file
    doc.end();
}


module.exports = generateCv
