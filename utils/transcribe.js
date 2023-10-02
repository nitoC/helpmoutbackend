import axios from 'axios'
import fs from 'fs-extra'


async function transcribe(params, token) {
  
// replace with your API token
const YOUR_API_TOKEN = token

// URL of the file to transcribe
const FILE_URL = params

// AssemblyAI transcript endpoint (where we submit the file)
const transcript_endpoint = "https://api.assemblyai.com/v2/transcript"

// request parameters 
const data = {
  audio_url: FILE_URL // You can also use a URL to an audio or video file on the web
}

// HTTP request headers
const headers={
  "Authorization": YOUR_API_TOKEN,
  "Content-Type": "application/json"
}

// submit for transcription via HTTP request
const response = await axios.post(transcript_endpoint, data, { headers: headers })

// polling for transcription completion
const pollingEndpoint = `https://api.assemblyai.com/v2/transcript/${response.data.id}`

while (true) {
  const pollingResponse = await axios.get(pollingEndpoint, {
    headers: headers
  })
  const transcriptionResult = pollingResponse.data

  if (transcriptionResult.status === 'completed') {
    // print the results
    console.log(transcriptionResult)
    break
  } else if (transcriptionResult.status === 'error') {
    throw new Error(`Transcription failed: ${transcriptionResult.error}`)
  } else {
    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
}

}


export default transcribe;