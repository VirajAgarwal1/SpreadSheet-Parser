const express = require('express')
const fileUpload = require('express-fileupload');
const excelReader = require('xlsx')
const fs = require('fs')
const JoinedColumns = require('./excel_fix.js');

const app = express()

// IDK This is kinda mandatory
app.use(express.urlencoded({extended:false}))
// This is to recieve Files
app.use(fileUpload())
//This is to recieve JSON
app.use(express.json());
// This si to recieve text
app.use(express.text())

app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html')
})

app.post('/',(req,res)=>{
    myfile = req.files.excel_file
    myfile.mv(__dirname+'/uploads/'+myfile.name)
    mes = {
        status: 200,
        ok: true,
        message: 'The file '+myfile.name+' has been saved/updated to the database.',
        fileName: myfile.name
    }
    res.json(mes)
})

app.post('/excelParse',(req,res)=>{
    // console.log(req.body.fileName);
    fileName = req.body.fileName
    if (fs.existsSync(__dirname+'/uploads/'+fileName)){
        const excel = excelReader.readFile(__dirname+'/uploads/'+fileName)
        
        let excel_parsed_data = []

        excel_sheets = excel.SheetNames

        for (let index = 0; index < excel_sheets.length; index++) {
            const eachSheet = excelReader.utils.sheet_to_json(excel.Sheets[excel.SheetNames[index]]);

            for (let t = 0; t < eachSheet.length; t++) {
                const element = eachSheet[t];
                excel_parsed_data.push(element)
            }            
        }
        mes = {
            status: 200,
            fileName: fileName,
            message: 'Successful parsing of the file.',
            data: JoinedColumns(excel_parsed_data)
        }

        res.json(mes)
    }else {

        mes = {
            status: 404,
            fileName: fileName,
            message: 'The file requested doesnt exist.'
        }
        res.json(mes)
    }
})




app.listen(5000,()=>{
    console.log('Server started at port 5000...');
})
