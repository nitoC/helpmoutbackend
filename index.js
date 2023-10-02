import express from 'express';
import {config} from 'dotenv';
import cors from 'cors'
import fs from 'fs';
import multer from 'multer';
import { Readable } from 'stream';
import aws from 'aws-sdk';
import bodyParser from 'body-parser';
import {uploadS3, getFile} from './s3.js';


config();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log(file)
    cb(null, './uploads')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-video-' +file.originalname+'-'+uniqueSuffix)
  }
})

const upload = multer({storage})
const port = process.env.PORT
const token = process.env.TOKEN

const app = express()

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({extended:true}))

let readableStream;

// Define a route to handle the POST request
app.post('/video',upload.single('file'), async (req, res) => {
  // Access the uploaded file from req.file
  try {
    console.log(req.file)
   let myUrl = await uploadS3(req.file)
      res.status(200).json({
        message: 'File uploaded successfully.',
        filename: req.file.filename,
        destination: myUrl,
      })


  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
   }
  }
  )

  app.get('/video/:filename', async (req, res) => {
    const filename = req.params.filename;
    const videoPath = `https://blob-helpmeout.s3.amazonaws.com/${filename}`; // Adjust the path to your uploaded files
  console.log(videoPath)
    if (videoPath) {
      // Set the appropriate content type
      let data = await getFile(filename)
      res.setHeader('Content-Type', 'video/webm');
  
      // Create a read stream from the video file and pipe it to the response
      return data.pipe(res);
      
    } else {
      // If the file does not exist, return a 404 Not Found response
      res.status(404).send('Video not found');
    }
  });
  
  
app.listen(port, ()=>{
    console.log(`listening to ${port}`)
})