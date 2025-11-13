import{ api } from 'src/boot/axios'

export default class AlunoService {
    static async getAlunos(data){
        console.log('Ação getAlunos chamada dentro do SERVICE /ALUNOS');
        return new Promise (( res, rej) => {
            api.get('/limpeza', data)
            .then(  response => res(response.data))
            .catch( err => rej (err.response));   
        });
    }
}