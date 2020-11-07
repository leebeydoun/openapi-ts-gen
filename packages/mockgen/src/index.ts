import { OAResponseGenerator } from './OAResponseGenerator'

new OAResponseGenerator().initialise('./sample/main-spec.yaml').then(generator => {
    const mock = generator.generate('/investigations')
    console.log(mock)
})
