import * as functions from "firebase-functions";
import * as express from 'express';
import { check } from 'express-validator'
import * as cors from 'cors';
import handleValidationResults from '../utilities/handleValidationResults';
import axios from "axios";


interface Request {
  body: {
    userPrompt: string
  }
}

const app = express()
app.use(cors())

app.post(
  '/api/prompt',
  [
    check('userPrompt').not().isEmpty().trim().escape()
  ],
  async (req: Request, res: any) => {
    handleValidationResults(req, res)
    const { userPrompt } = req.body

    const apiRequest = {
      prompt: userPrompt,
      temperature: 0.9,
      max_tokens: 50
    }
    
    const openaiURL = "https://api.openai.com/v1/engines/text-curie-001/completions"
    const response: any = await axios.post(openaiURL, apiRequest, {
      headers: {
        "Authorization": `Bearer ${functions.config().openai.key}`
      }
    })

    const aiResponse = response.data.choices[0].text

    try {
      res.status(200).send({
        status: 'success',
        aiResponse: aiResponse
      })
    } catch (error) {
      res.send({ code: 500, error: error})
    }
  }
)

exports.app = functions.https.onRequest(app)