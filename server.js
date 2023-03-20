const express = require('express');
const fs = require('fs');
const cors = require('cors');
const csv = require('fast-csv');

const app = express();
const csvHeader = 'name,password\n';
const csvFilePath = 'login.csv';

app.use(cors({
    origin:'http://localhost:4200', 
    optionSuccessStatus:200,
 }
 ));
app.use(express.json());

app.post('/data', (req,res)=>{
    const {name, password} = req.body;
    const csvData = `${name},${password}\n`;

    if(!fs.existsSync(csvFilePath) || !fs.readFileSync(csvFilePath).toString().includes(csvHeader)){
        fs.writeFileSync(csvFilePath, csvHeader);
    }

    fs.appendFileSync(csvFilePath, csvData);
    res.status(200).json({message: 'Login successful'});

});

app.get('/data', (req,res) => {
    fs.readFile('login.csv', 'utf-8', (err,data) => {
        if(err){
            console.error(err);
            return;
        }

        const names = [];
        fs.createReadStream(csvFilePath)
        .pipe(csv.parse({ headers: true }))
        .on('data', row => names.push(row))
         .on('end', () => {
               console.log(names);
           // Do something with the names
           res.status(200).json({names: names});
          });

              
        })
    })



const server = app.listen(3000, () => {
    console.log(`app is running at port 3000`);
  });
  