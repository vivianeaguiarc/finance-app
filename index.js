import 'dotenv/config'
import { app } from './src/app.cjs'

app.listen(3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`)
})
