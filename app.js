import express from 'express'
import fs from "fs";
import path from "path";
import OpenAI from "openai";
import cors from 'cors';


const openai = new OpenAI();

const speechFile = path.resolve("./speech.mp3");

async function main(speechinput) {
  const mp3 = await openai.audio.speech.create({
    model: "tts-1",
    voice: "alloy",
    input: speechinput,
  });
 
  
  const buffer = Buffer.from(await mp3.arrayBuffer());
  await fs.promises.writeFile(speechFile, buffer);
}

const filePath = './speech.mp3'
const app = express ();
app.use(express.json());
var PORT = 8125;
app.listen(PORT, () => {
    console.log("Server Listening on PORT:", PORT);
  });
  app.use(cors);
  app.get("/speechcreate", (request, response) => {
    const status = {
        "status":"Working"
     };
   var textToSpeechText = request.headers.text.replace(/['"]+/g, '');

    main(textToSpeechText).then(x => {
      
     fs.readFile(filePath, function(error, content) {
            if (error) {
                    console.log(error)
                    console.log("didn't work")
                    response.writeHead(500);
                    response.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                    response.end(); 
                
            }
            else {
                
                console.log("Worked")
                response.writeHead(200, { 'Content-Type': 'audio/mpeg' });
                response.end(content, 'utf-8');
               
            }
        });
    
    })
   

  });