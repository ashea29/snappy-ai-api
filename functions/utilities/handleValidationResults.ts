import { validationResult } from 'express-validator';

const handleValidationResults = (req: any, res: any) => {
  const validationErrors = validationResult(req)
  const invalidFields: any[] = []

  if (!validationErrors.isEmpty()) {
    validationErrors.array().forEach((err) => {
      invalidFields.push(err.param)
    })
    res.send({code: 422, message: `Invalid input: [${invalidFields}]. Please verify and try again`})
    return 
  }
}

export default handleValidationResults