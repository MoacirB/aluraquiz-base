import React from 'react';
import QuizScreen from '../../src/Screens/Quiz'
import { ThemeProvider } from 'styled-components';

export default function QuizDaGaleraPage({dbExterno}){
    return (
        <ThemeProvider theme={dbExterno.theme}>
            <QuizScreen externalQuestions={dbExterno.questions} externalBg={dbExterno.bg}/>
        </ThemeProvider>
    )
}

export async function getServerSideProps(context){
    const [projectName, githubUser] = context.query.id.split('___');
    //https://${projectName}.${githubUser}.vercel.app/api/db
    try{
      const dbExterno = await fetch(`https://${projectName}.${githubUser}.vercel.app/api/db`)
      .then((respostaDoServer) => {
        if (respostaDoServer.ok) {
          return respostaDoServer.json();
        }
        throw new Error('Falha em pegar os dados');
      })
      .then((respostaConvertidaEmObjeto) => respostaConvertidaEmObjeto);

      return {
          props: {
              dbExterno,
          },
      }
    }catch(err){console.log(err)}
    
}