const express = require('express');
const fs = require('fs');
const cors = require('cors');
const csv = require('fast-csv');

const app = express();
const csvHeader = 'name,password\n';
const csvFilePath = 'login.csv';
let stockData =
[
  {
    stock: 'nifty',
    entryType: 'US',
    entryPrice: '1',
    stopLoss: '1',
    targetPoint: '1',
    quantity: '1',
    tag: 'US',
    autoSquare: '1'
  },
  {
    stock: 'nifty',
    entryType: 'CA',
    entryPrice: '11',
    stopLoss: '11',
    targetPoint: '11',
    quantity: '11',
    tag: 'CA',
    autoSquare: '11'
  },
  {
    stock: 'nifty',
    entryType: 'FR',
    entryPrice: '12',
    stopLoss: '12',
    targetPoint: '12',
    quantity: '12',
    tag: 'CA',
    autoSquare: '12'
  },
  {
    stock: 'nifty',
    entryType: 'FR',
    entryPrice: 'we',
    stopLoss: '13',
    targetPoint: '13',
    quantity: '13',
    tag: 'FR',
    autoSquare: '13'
  },
  {
    stock: 'nifty',
    entryType: 'DE',
    entryPrice: '14',
    stopLoss: '14',
    targetPoint: '14',
    quantity: '14',
    tag: 'DE',
    autoSquare: '14'
  },
  {
    stock: 'nifty',
    entryType: 'DE',
    entryPrice: 'we',
    stopLoss: '12',
    targetPoint: '435',
    quantity: '435',
    tag: 'DE',
    autoSquare: '14'
  }
];

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

 app.post('/stock', (req,res)=>{
        stockData.push(req.body);
        console.log(stockData);
        res.status(200).json({status: 'success', message: 'stock data saved successfully'});
        
    

});

app.get('/stock', (req,res)=>{

    
    res.status(200).json({status: 'success', data: stockData});
    


});


const server = app.listen(3000, () => {
    console.log(`app is running at port 3000`);
  });
  
