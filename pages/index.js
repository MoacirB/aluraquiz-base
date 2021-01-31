import React from 'react';
import styled from 'styled-components';
import db from '../db.json';
import Widget from '../src/components/Widget';
import Footer from '../src/components/Footer';
import GitHubCorner from '../src/components/GitHubCorner';
import QuizBackground from '../src/components/QuizBackground';
import QuizLogo from '../src/components/QuizLogo';
import { useRouter } from 'next/router'
import Input from '../src/components/Input';
import Button from '../src/components/Button';
import QuizContainer from '../src/components/QuizContainer';
import Link from '../src/components/Link';
import { motion } from 'framer-motion';
import Head from 'next/head';


export default function Home() {
  const router = useRouter();
  const [name, setName] = React.useState('');
  return (
    <QuizBackground backgroundImage={db.bg}>
       <Head>
        <title>
          AluraQuiz -
          {db.title}
        </title>
      </Head>
       <QuizContainer>
         <Widget as={motion.section} transition={{delay:0, duration: 0.3}} variants={{show: {opacity:1, y:'0'}, hidden: {opacity:0, y:'100%'}}} initial="hidden" animate="show">

           <Widget.Header>
              <h1>Universe Quiz</h1>
           </Widget.Header>

           <Widget.Content>
            <form onSubmit={(e)=>{
              e.preventDefault();

              router.push(`/quiz?name=${name}`);
            }}>
              <Input name="nomeDoUsuario" placeholder="Forneça sua nomenclatura" value={name} onChange={(e)=>{setName(e.target.value)}}/> 
              <Button type="submit" disabled={name.length === 0}>Jogar</Button>
            </form>
          </Widget.Content>
         </Widget>

         <Widget as={motion.section} transition={{delay:0.15, duration: 0.3}} variants={{show: {opacity:1}, hidden: {opacity:0}}} initial="hidden" animate="show">
           <Widget.Content>
             <h1 style={{marginBottom:'10px'}}>Quizes da Galera</h1>

             {db.external.map((link)=>{
              const [projectName, githubUser] = link
              .replace(/\//g, '')
              .replace('https:', '')
              .replace('.vercel.app', '')
              .split('.');

               return (
                <li key={link} style={{listStyleType: 'none'}}>
                  <Widget.Topic as={Link} href={`/quiz/${projectName}___${githubUser}`}>
                  {`${githubUser}/${projectName}`}
                  </Widget.Topic>
                </li>
               )
              })}
          </Widget.Content>
         </Widget>
         <Footer />
       </QuizContainer>
       <GitHubCorner projectUrl="https://github.com"/>
    </QuizBackground>
  );
}