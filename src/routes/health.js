import { getHealthPayload } from '../controllers/health.js'

export async function healthHandler(req, res) {
    const { statusCode, body } = await getHealthPayload()

    return res.status(statusCode).json({
        ...body,
        requestId: req.id,
    })
}
