import { uuid } from 'zod'

export class IdGeneratorAdapter {
    execute() {
        return uuid.v4()
    }
}
