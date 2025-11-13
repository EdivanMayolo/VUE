import{ api } from 'src/boot/axios'

export default class ProfessorService {
    static async getProfessor(data){
        return new Promise (( res, rej) => {
            api.get('/professor', data)
            .then(  response => res(response))
            .catch( err => rej (err.response));   
        });
    }

}