const express = require('express');
const fs = require('fs');
const cors = require('cors');
const csv = require('fast-csv');

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origins: ['http://localhost:4200']
    }
});

const csvHeader = 'name,password\n';
const csvFilePath = 'login.csv';
let valuee = true;
// let stockData = [];


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
       
        const header = `${Object.keys(req.body).join(',')}\n`;
        const csv = `${Object.values(req.body).join(',')}\n`;
        if(!fs.existsSync('stockData.csv') || !fs.readFileSync('stockData.csv').toString().includes(header)){
          fs.writeFileSync('stockData.csv', header);
      }

      fs.appendFileSync('stockData.csv', csv);
        // const data = fs.readFileSync('login.csv').toString();
        // const foundData = data.slice(0, data.indexOf("\n"));
       
        res.status(200).json({status: 'success', message: 'stock data saved successfully'});
        
    

});

app.get('/stock', (req,res)=>{

  fs.readFile('stockData.csv', 'utf-8', (err,data) => {
    if(err){
        console.error(err);
        return;
    }

    let stockData = [];
    fs.createReadStream('stockData.csv')
    .pipe(csv.parse({ headers: true }))
    .on('data', row => {
     
      
    stockData.push(row); 
   

    })
     .on('end', () => {
      setInterval(() => {
        // const data = Math.random();

        if(valuee){

          let myVal = stockData.map(val => {
          
          
            return  val.entryPrice * 1.02;
           
              
             
          });
          io.emit('changingData', myVal);
          valuee = false;

        } else {
          let myVal = stockData.map(val => {
          
          
            return  (val.entryPrice - (val.entryPrice * 0.02) );
           
              
             
          });
          io.emit('changingData', myVal);
          valuee = true;

        }
        
        
        
        
      }, 1000);
    
    

          
          //  console.log(names);
       // Do something with the names
       res.status(200).json({status : 'success', data: stockData});
      });

          
    })

    
   
    


});

// setInterval(() => {
//     const data = Math.random();
    
//     io.emit('changingData', data);
//   }, 1000);


  

  io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  });

// const server = app.listen(3000, () => {
//     console.log(`app is running at port 3000`);
//   });
  
server.listen(3000, () => {
    console.log(`app is running at port 3000`);

});