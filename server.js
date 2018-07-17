const bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const employees = require('./employees.json');

const server = express();

server.use(express.static(path.join(__dirname, '')));
server.use(bodyParser.json());
server.use(cors());


server.get('/get_employees', (req, res) => {
	res.json(employees);
});

server.get('/get_video', (req, res) => {
	const path = 'Genius_Plaza_Hiring_Video.mp4';
	const stat = fs.statSync(path);
  const fileSize = stat.size;
	const range = req.headers.range;
	
	if (range) {
    const parts = range.replace(/bytes=/, "").split("-")
    const start = parseInt(parts[0], 10)
    const end = parts[1] 
      ? parseInt(parts[1], 10)
      : fileSize-1
    const chunksize = (end-start)+1
    const file = fs.createReadStream(path, {start, end})
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
    }
    res.writeHead(200, head)
    fs.createReadStream(path).pipe(res)
	}
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
	console.log('server running on ' + port);
});